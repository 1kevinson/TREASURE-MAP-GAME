// @ts-nocheck
import { Direction, EmptyGrid, Adventurer, Treasure } from "./ts-files/Classes";
import { validateFile } from "./ts-files/Validator";

//Get DOM Elements
const inputFile = document.querySelector("#file-input");
const btnStart = document.querySelector("#btn-start");
const btnResult = document.querySelector("#btn-result");

//Disable buttons
btnStart.style.disabled;

//Get file entered by user
inputFile.addEventListener("change", (e) => {
  const reader = new FileReader();
  const filename = e.target.value.split("\\")[2];

  //Change the label onChange of input file
  e.target.nextElementSibling.innerText = "../" + filename;

  reader.onload = function (event) {
    const contents = event.target.result;
  };
  reader.onerror = function (event) {
    console.error("File could not be read! Code " + event.target.error.code);
  };

  reader.readAsText(e.target.files[0]);
});

btnStart.addEventListener("click", (e) => {
  console.log(content);
  console.log(validateFile(content));
});

const content = `C​ - 3 - 4
M​ - 1 - 0
M​ - 2 - 1
T​ - 0 - 3 - 2
T​ - 1 - 3 - 3
A​ - Lara - 1 - 1 - S - AADADAGGA`;

const isValid = validateFile(content);
