// @ts-nocheck
import { Direction, EmptyGrid, Adventurer, Treasure } from "./ts-files/Classes";
import { validateFile } from "./ts-files/Validator";

//Get DOM Elements
const inputFile = document.querySelector("#file-input");
const btnStart = document.querySelector("#btn-start");
const btnResult = document.querySelector("#btn-result");
const alertBox = document.querySelector("#alert-file");

//Disable buttons at the app start
btnStart.classList.replace("btn-start", "btn-off");
btnResult.classList.replace("btn-result", "btn-off");

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

btnStart.addEventListener("click", (e) => {});

const content = `# {C comme Carte} - {Nb. de case en largeur} - {Nb. de case en hauteur}
C​ - 3 - 4
# {M comme Montagne} - {Axe horizontal} - {Axe vertical}
M​ - 1 - 0
M​ - 2 - 1
# {T comme Trésor} - {Axe horizontal} - {Axe vertical} - {Nb. de trésors}
T​ - 0 - 3 - 2
T​ - 1 - 3 - 3
# {A comme Aventurier} - {Nom de l’aventurier} - {Axe horizontal} - {Axe vertical} - {Orientation} - {Séquence de mouvement}
A​ - Lara - 1 - 1 - S - AADADAGGA`;

const isValid = validateFile(content);
console.log(isValid);

if (isValid) {
} else {
  alertBox.hidden = false;
}
