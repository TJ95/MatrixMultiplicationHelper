let randomButton = document.getElementById("button-random-dog");
randomButton.addEventListener('click', getRandomDoggo);

let showBreedButton = document.getElementById("button-show-breed");
showBreedButton.addEventListener('click', getBreed);
function getRandomDoggo(){
    fetch('https://dog.ceo/api/breeds/image/random')
        .then(checkStatus)
        .then(response => response.json())
        .then(data => handleData(data))
        .catch(error => console.log(error))
}

//checkStatus
function checkStatus(response){
    if(response.ok){
        return Promise.resolve(response);
    }else{
        document.getElementById("content").innerHTML = '<p>Breed not found!</p>';
        return Promise.reject(new Error(response.statusText));
    }
}

//handleData
function handleData(data){
    let url = data.message;
    console.log(url)
    document.getElementById('content').innerHTML = `<img src='${url}' alt=""/>`;
}


function getBreed() {
    let breed = document.getElementById("input-breed").value.toLowerCase();
    fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
        .then(checkStatus)
        .then(response => response.json())
        .then(data => handleData(data))
        .catch(error => console.log(error))
}