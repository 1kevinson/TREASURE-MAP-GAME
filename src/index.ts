// @ts-nocheck
import { Direction, EmptyGrid, Adventurer, Treasure } from "./ts-files/Classes";
import {
  changeOrientation,
  getMapResult,
  initializeMap,
  moveAdventurer,
  renderMap,
} from "./ts-files/MapUtils";
import { validateFile } from "./ts-files/Validator";

//Check validity
const isValid = false;

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
    //Get the file data
    const contents = event.target.result.toString();
    isValid = validateFile(contents);

    if (isValid) {
      //Enable buttons if the file is valid
      btnStart.classList.replace("btn-off", "btn-start");
    } else {
      alertBox.hidden = false;
    }
  };
  reader.onerror = function (event) {
    console.error("File could not be read! Code " + event.target.error.code);
  };

  reader.readAsText(e.target.files[0]);
});

btnStart.addEventListener("click", (e) => {});

if (isValid) {
  const [mapData, adventurer] = initializeMap(content);

  renderMap(mapData);

  let orientation = adventurer.orientation;
  let position = adventurer.position;
  const sequence = adventurer.moveSequence;

  const sequenceArray = sequence.split("");

  for (const instruction of sequenceArray) {
    if (instruction === "A") {
      const newPosition = moveAdventurer(orientation, position);
      let temp = null;

      if (mapData[position.x][position.y].length === 1) {
        console.log(mapData[position.x][position.y]);
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

      position = newPosition;
    }

    if (instruction === "G" || instruction === "D") {
      orientation = changeOrientation(orientation, instruction as Direction);
    }

    renderMap(mapData);
  }
} else {
}
