// @ts-nocheck
import { Direction, EmptyGrid, Adventurer, Treasure } from "./ts-files/Classes";
import { jsPDF } from "jspdf";
import {
  changeOrientation,
  getMapResult,
  initializeMap,
  moveAdventurer,
  renderMap,
} from "./ts-files/MapUtils";
import { from } from "rxjs";
import { validateFile } from "./ts-files/Validator";
import { customArrayProperty } from "./ts-files/Utils";
import { map } from "rxjs/operators";

//Check validity
const isValid: boolean = false;
const renderFinalMap: boolean = false;

//Maps datas initialization
const contents: string;
const arrayOfMoves = [];
const finalMap: string;

//Get DOM Elements
const inputFile = document.querySelector("#file-input");
const btnStart = document.querySelector("#btn-start");
const btnResult = document.querySelector("#btn-result");
const alertBox = document.querySelectorAll(".alert-file");
const cards = document.querySelector(".card-box");
const mapResult = document.querySelector("#map-result");
const rowCards = document.querySelector(".row-cards");
const btnReload = document.querySelector("#btn-reload");

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
    //Get the file data
    contents = event.target.result.toString();
    isValid = validateFile(contents);

    if (isValid) {
      //Enable buttons if the file is valid
      btnStart.classList.replace("btn-off", "btn-start");
      //show the alert box
      alertBox[1].hidden = false;
      setTimeout(() => {
        //hide after 2.5s
        alertBox[1].hidden = true;
      }, 2500);

      initializer(contents);
    } else {
      alertBox[0].hidden = false;
      setTimeout(() => {
        alertBox[0].hidden = true;
      }, 6000);
    }
  };
  reader.onerror = function (event) {
    console.error("File could not be read! Code " + event.target.error.code);
  };

  reader.readAsText(e.target.files[0]);
});

//Start the game
btnStart.addEventListener("click", (e) => {
  alertBox[1].hidden = true;
  inputFile.disabled = true;
  btnStart.classList.replace("btn-start", "btn-off");
  runTheMap(contents);
});

//Get the Result as PDF
btnResult.addEventListener("click", (e) => {
  //Generate the file
  let docMap = new jsPDF();
  docMap.text(finalMap, 20, 15);
  docMap.save("treasure-map.pdf");
});

//Realod the Game once finished
btnReload.addEventListener("click", () => {
  window.location.reload();
});

// Initialize the first map take from file
function initializer(datas: string) {
  const [mapData, adventurer] = initializeMap(datas);

  renderMap(mapData);
}

// Play the Game to move the adventurer
function runTheMap(datas: string) {
  const [mapData, adventurer] = initializeMap(datas);

  let orientation = adventurer.orientation;
  let position = adventurer.position;
  const sequence = adventurer.moveSequence;

  const sequenceArray = sequence.split("");

  for (const instruction of sequenceArray) {
    if (instruction === "A") {
      const newPosition = moveAdventurer(orientation, position);
      let temp = null;

      if (mapData[position.x][position.y].length === 1) {
        temp = mapData[position.x][position.y][0];
        mapData[position.x][position.y] = [new EmptyGrid("-")];
      } else {
        temp = mapData[position.x][position.y][1];
        mapData[position.x][position.y].pop();
      }

      if (mapData[newPosition.x][newPosition.y][0] instanceof Treasure) {
        const treasure = mapData[newPosition.x][newPosition.y][0] as Treasure;
        treasure.decrease();
        if (treasure.quantity === 0) {
          mapData[newPosition.x][newPosition.y].shift();
        }
        (temp as Adventurer).addTreasure();
        mapData[newPosition.x][newPosition.y] = mapData[newPosition.x][
          newPosition.y
        ].concat([temp]);
      } else {
        mapData[newPosition.x][newPosition.y] = [temp];
      }

      arrayOfMoves.push(
        rowCards.children[newPosition.x].children[newPosition.y]
      );

      position = newPosition;
    }
    //console.log(arrayOfMoves);
    if (instruction === "G" || instruction === "D") {
      orientation = changeOrientation(orientation, instruction as Direction);
    }
  }

  //Get the final map for PDF
  finalMap = getMapResult(mapData);

  //Enable new Array Property
  customArrayProperty(arrayOfMoves);

  //Render the map after the adventurer move
  let offset: number = 0;
  arrayOfMoves
    .asyncForEach((move) => {
      setTimeout(() => {
        move.classList.add("card-moved", "checked");
        setTimeout(() => {
          move.classList.remove("card-moved");
        }, 1000);
      }, 500 + offset);
      offset += 1000;
    })
    .then((data) => {
      renderFinalMap = data.status === "finished";
      renderMap(mapData);
      btnResult.classList.replace("btn-off", "btn-start");
      mapResult.hidden = false;
    });
}
