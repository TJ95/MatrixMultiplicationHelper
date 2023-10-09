import path from 'path';
import {correct, StageTest, wrong} from 'hs-test-web';

const pagePath = path.join(import.meta.url, '../../src/index.html');

global.browserOptions = {
    defaultViewport: {
        width: 1024,
        height: 768
    }
}

class Test extends StageTest {

    page = this.getPage(pagePath)

    tests = [this.page.execute(() => {
        // test #1
        // HELPERS-->
        // method to check if element with id exists
        this.elementExists = (id, nodeNames) => {
            const element = document.body.querySelector(id);
            if (!element) return true;
            else return (nodeNames && !nodeNames.includes(element.nodeName.toLowerCase()));
        };

        // method to check if element with id has right text
        this.elementHasText = (id, correctText) => {
            const element = document.body.querySelector(id);
            if (!element) return true;

            if (correctText) {
                return (element.innerText !== correctText);
            }

            return !element.innerText || element.innerText.trim().length === 0;
        };

        // method to check if element with id has right attribute
        this.elementHasAttribute = (id, attribute, value) => {
            const element = document.body.querySelector(id);
            if (!element) return true;
            const attributeValue = element.getAttribute(attribute);
            if (!attributeValue) return true;
            // console.log(attributeValue);
            return value && attributeValue !== value;
        };

        // check content only has one element
        this.checkContentLen = () => {
            const content = document.body.querySelector(this.content);
            if (content.children.length !== 1) return wrong("The content div should only have one element.");
        };

        // check img
        this.checkImg = (srcStartsWith) => {
            // check if img exists
            const img = document.body.querySelector("img");
            if (!img) return wrong("The image is not displayed after clicking the button.");

            // check if parent is in content
            const imgInContent = document.body.querySelector("#content > img");
            if (!imgInContent)
                return wrong("The image should be a child of the element with the selector of #content.");

            // check if img has src or starts with srcStartsWith
            const src = img.getAttribute("src");
            if (!src || !src.includes(srcStartsWith))
                return wrong("The image does not have a source or the source does not start correctly.");
        };

        // check p
        this.checkP = (text="Breed not found!") => {
            // check if p exists
            const p = document.body.querySelector("p");
            if (!p) return wrong("The paragraph is not displayed after clicking the button with wrong input.");

            // check if parent is content
            const pInContent = document.body.querySelector("#content > p");
            if (!pInContent)
                return wrong("The paragraph should be a child of the element with the selector of #content.");

            // check if p has text
            if (p.innerText !== text)
                return wrong("The paragraph does not have the correct text.");
        };

        // check ol
        this.checkOl = () => {
            // check if ol exists
            const ol = document.body.querySelector("ol");
            if (!ol) return wrong("The ordered list is not displayed after clicking the button.");

            // check if parent is content
            const olInContent = document.body.querySelector("#content > ol");
            if (!olInContent)
                return wrong("The ordered list should be a child of the element with the selector of #content.");

            // check if ol has li
            const li = document.body.querySelector("ol > li");
            if (!li) return wrong("The ordered list does not have any list items.");

            // check if li has text
            if (li.innerText.trim().length === 0)
                return wrong("The list item does not have any text.");
        };

        // empty input
        this.emptyInput = () => {
            const input = document.body.querySelector("#input-breed");
            if (!input) return wrong("The input field is missing.");
            input.value = "";
        };

        // CONSTANTS-->
        const theElement = "The element with the selector of";
        this.content = "#content";
        // <--CONSTANTS

        // MESSAGES-->
        this.missingIdMsg = (id) => {
            return `${theElement} "${id}" is missing in the body of the HTML document.`;
        };
        this.wrongTagMsg = (id, tag, tagAlt) => {
            if (tagAlt) return `${theElement} "${id}" should be a/an ${tag} or ${tagAlt} tag.`;
            else return `${theElement} "${id}" should be a/an ${tag} tag.`;
        };
        this.wrongTextMsg = (id, text) => {
            return `${theElement} "${id}" should have the text: "${text}".`;
        };
        // <--MESSAGES
        return correct();

    }), this.page.execute(() => {
        // test #2
        // STAGE1 TAGS

        // check if h1 exists
        const h1 = "h1";
        if (this.elementExists(h1)) return wrong(this.missingIdMsg(h1));

        // check if correct text
        const h1Text = "Dog Glossary";
        if (this.elementHasText(h1, h1Text)) return wrong(this.wrongTextMsg(h1, h1Text));

        // check if  #button-random-dog exists
        const buttonRandom = "#button-random-dog";
        if (this.elementExists(buttonRandom)) return wrong(this.missingIdMsg(buttonRandom));

        // check if its button
        if (this.elementExists(buttonRandom, ["button"]))
            return wrong(this.wrongTagMsg(buttonRandom, "button"));

        // check if it has text
        const buttonText = "Show Random Dog";
        if (this.elementHasText(buttonRandom, buttonText))
            return wrong(this.wrongTextMsg(buttonRandom, buttonText));

        // check if content exists
        if (this.elementExists(this.content)) return wrong(this.missingIdMsg(this.content));

        // check if its div
        if (this.elementExists(this.content, ["div"])) return wrong(this.wrongTagMsg(this.content, "div"));

        return correct();
    }),
        this.node.execute(async () => {
            // test #3
            // check button click and img after click
            const buttonRandom = "#button-random-dog";
            const button = await this.page.findBySelector(buttonRandom);
            const isEventFired = button.waitForEvent('click', 1000);
            await button.click();

            if (await !isEventFired) return wrong(`Expected click event on button with ${buttonRandom} id!`);

            await new Promise((resolve => {
                setTimeout(() => {
                    resolve();
                }, 3000)
            }));

            // check img
            await this.page.evaluate(() => {
                const srcStart = "https://images.dog.ceo/breeds";
                return this.checkImg(srcStart);
            });

            await button.click();

            await new Promise((resolve => {
                setTimeout(() => {
                    resolve();
                }, 3000)
            }));

            // check content only has one element
            await this.page.evaluate(() => {
                return this.checkContentLen();
            });

            // check img
            await this.page.evaluate(() => {
                const srcStart = "https://images.dog.ceo/breeds";
                return this.checkImg(srcStart);
            });

            return correct();
        }),
        this.page.execute(() => {
            // test #4
            // check if #input-breed exists
            const inputBreed = "#input-breed";
            if (this.elementExists(inputBreed)) return wrong(this.missingIdMsg(inputBreed));

            // check if its input
            if (this.elementExists(inputBreed, ["input"])) return wrong(this.wrongTagMsg(inputBreed, "input"));

            // check if it has placeholder
            const placeholder = "Enter a breed";
            if (this.elementHasAttribute(inputBreed, "placeholder", placeholder))
                return wrong(`The "${inputBreed}" input should have the placeholder attribute with the value of "${placeholder}".`);

            // check if #button-show-breed exists
            const buttonShowBreed = "#button-show-breed";
            if (this.elementExists(buttonShowBreed)) return wrong(this.missingIdMsg(buttonShowBreed));

            // check if its button
            if (this.elementExists(buttonShowBreed, ["button"]))
                return wrong(this.wrongTagMsg(buttonShowBreed, "button"));

            // check if it has text
            const buttonText = "Show Breed";
            if (this.elementHasText(buttonShowBreed, buttonText))
                return wrong(this.wrongTextMsg(buttonShowBreed, buttonText));

            return correct();
        }),
        this.node.execute(async () => {
            // test #5
            // check button click and img after click
            const buttonShowBreed = "#button-show-breed";
            const button = await this.page.findBySelector(buttonShowBreed);
            const input = await this.page.findBySelector("#input-breed");
            const inputText = "Hound";
            await input.inputText(inputText);

            const isEventFired = button.waitForEvent('click', 1000);
            await button.click();

            if (await !isEventFired) return wrong(`Expected click event on button with ${buttonShowBreed} id!`);

            await new Promise((resolve => {
                setTimeout(() => {
                    resolve();
                }, 3000)
            }));

            // check content only has one element
            await this.page.evaluate(() => {
                return this.checkContentLen();
            });

            // check img
            await this.page.evaluate(() => {
                const srcStart = "https://images.dog.ceo/breeds/hound";
                return this.checkImg(srcStart);
            });

            // check if it can handle wrong input
            const wrongInput = " scooby";
            await input.inputText(wrongInput);
            await button.click();

            await new Promise((resolve => {
                setTimeout(() => {
                    resolve();
                }, 3000)
            }));

            // check paragraph
            await this.page.evaluate(() => {
                return this.checkP();
            });

            // check content only has one element
            await this.page.evaluate(() => {
                return this.checkContentLen();
            });

            return correct();
        }),
        this.page.execute(() => {
            // test #6
            // check if #button-show-sub-breed exists
            const buttonShowSubBreed = "#button-show-sub-breed";
            if (this.elementExists(buttonShowSubBreed)) return wrong(this.missingIdMsg(buttonShowSubBreed));

            // check if its button
            if (this.elementExists(buttonShowSubBreed, ["button"]))
                return wrong(this.wrongTagMsg(buttonShowSubBreed, "button"));

            // check if it has text
            const buttonText = "Show Sub-Breed";
            if (this.elementHasText(buttonShowSubBreed, buttonText))
                return wrong(this.wrongTextMsg(buttonShowSubBreed, buttonText));

            return correct();
        }),
        this.node.execute(async () => {
            // test #7
            await this.page.evaluate(() => {
                return this.emptyInput();
            });

            // check button click  click
            const buttonShowBreed = "#button-show-sub-breed";
            const button = await this.page.findBySelector(buttonShowBreed);
            const input = await this.page.findBySelector("#input-breed");
            const inputText = "BullDog";
            await input.inputText(inputText);

            const isEventFired = button.waitForEvent('click', 1000);
            await button.click();

            if (await !isEventFired) return wrong(`Expected click event on button with ${buttonShowBreed} id!`);

            await new Promise((resolve => {
                setTimeout(() => {
                    resolve();
                }, 3000)
            }));

            // check content only has one element
            await this.page.evaluate(() => {
                return this.checkContentLen();
            });

            // check ol
            await this.page.evaluate(() => {
                return this.checkOl();
            });

            // check if it can handle wrong input
            const wrongInput = " cute";
            await input.inputText(wrongInput);
            await button.click();

            await new Promise((resolve => {
                    setTimeout(() => {
                        resolve();
                    }, 3000)
                }
            ));

            // check paragraph
            await this.page.evaluate(() => {
                return this.checkP();
            });

            // check content only has one element
            await this.page.evaluate(() => {
                return this.checkContentLen();
            });

            await this.page.evaluate(() => {
                return this.emptyInput();
            });

            // check if it can handle wrong input
            const noSubInput = "affenpinscher";
            await input.inputText(noSubInput);
            await button.click();

            await new Promise((resolve => {
                    setTimeout(() => {
                        resolve();
                    }, 3000)
                }
            ));

            // check paragraph
            await this.page.evaluate(() => {
                return this.checkP("No sub-breeds found!");
            });

            // check content only has one element
            await this.page.evaluate(() => {
                return this.checkContentLen();
            });

            return correct();
        }),
    ]

}

it("Test stage", async () => {
    await new Test().runTests()
}).timeout(30000);