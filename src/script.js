// Create an array to store defined matrices
const matrices = [];

let currentMatrix = null; // Variable to store the current matrix being created

function generateMatrixInput() {
    const matrixName = document.getElementById("matrixName").value;
    const matrixRows = parseInt(document.getElementById("matrixRows").value);
    const matrixCols = parseInt(document.getElementById("matrixCols").value);

    // Create a matrix object
    currentMatrix = {
        name: matrixName,
        rows: matrixRows,
        cols: matrixCols,
        data: [], // Array to store matrix elements
    };

    // Generate table-like input fields for matrix elements
    generateTableInput(currentMatrix);

    console.log("Matrix values input for:", matrixName);

    // Clear the input fields after defining a matrix
    document.getElementById("matrixName").value = "";
    document.getElementById("matrixRows").value = "";
    document.getElementById("matrixCols").value = "";
}

function generateTableInput(matrix) {
    const matrixInputDiv = document.getElementById("matrixInput");
    matrixInputDiv.innerHTML = ""; // Clear previous input fields

    const table = document.createElement("table");

    for (let i = 0; i < matrix.rows; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < matrix.cols; j++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.placeholder = `Element at row ${i + 1}, col ${j + 1}`;
            input.className = "matrix-element";
            cell.appendChild(input);

            // Store the input element in the matrix data array
            matrix.data.push(input);

            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    matrixInputDiv.appendChild(table);
}

function createMatrix() {
    if (currentMatrix) {
        matrices.push(currentMatrix);
        displayDefinedMatrices();
        currentMatrix = null; // Reset the current matrix
        clearMatrixInput();
        console.log("Matrix created and added to the list.");
    }
}

function clearMatrixInput() {
    const matrixInputDiv = document.getElementById("matrixInput");
    matrixInputDiv.innerHTML = "";
}

function displayDefinedMatrices() {
    const matrixList = document.getElementById("matrixList");
    matrixList.innerHTML = ""; // Clear the list

    matrices.forEach((matrix, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${matrix.name}</strong> (${matrix.rows}x${matrix.cols})<br>${getMatrixValues(matrix)}`;
        matrixList.appendChild(listItem);
    });

    // Trigger MathJax to process and render LaTeX expressions
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, matrixList]);
}

function getMatrixValues(matrix) {
    let latexMatrix = "\\begin{bmatrix}";
    for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.cols; j++) {
            const inputValue = matrix.data[i * matrix.cols + j].value;
            latexMatrix += inputValue;
            if (j < matrix.cols - 1) {
                latexMatrix += " & ";
            }
        }
        latexMatrix += " \\\\ ";
    }
    latexMatrix += "\\end{bmatrix}";
    return `Matrix Values (LaTeX-style): $$${latexMatrix}$$`;
}

function multiplyMatrices() {
    const matrixA = document.getElementById("matrixA").value;
    const matrixB = document.getElementById("matrixB").value;

    // Send matrixA and matrixB to the backend for multiplication (not shown here).
    
    const result = "Result will appear here"; // Replace this with the actual result from the backend.

    document.getElementById("resultText").innerText = result;
}
