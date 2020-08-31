const isMapOrMountainValid = (line: string, firstLineChar: string): boolean => {
  if (line.indexOf(firstLineChar) !== 0) return false;

  const array = line.split("-");
  if (array.length !== 3) return false;

  return !(isNaN(Number(array[1])) || isNaN(Number(array[2])));
};

const isTreasureValid = (line: string): boolean => {
  if (line.indexOf("T") !== 0) return false;

  const array = line.split("-");
  if (array.length !== 4) return false;

  return !(
    isNaN(Number(array[1])) ||
    isNaN(Number(array[2])) ||
    isNaN(Number(array[3]))
  );
};

const isAdventurerValid = (line: string): boolean => {
  if (line.indexOf("A") !== 0) return false;

  const array = line.split("-");
  if (array.length !== 6) return false;

  if (isNaN(Number(array[2])) || isNaN(Number(array[3]))) return false;

  if (["N", "S", "W", "E"].indexOf(array[4].trim()) < 0) return false;

  return /^[ADG]+$/.test(array[5].trim());
};

const validateFile = (content: string): boolean => {
  const lines = content.split("\n");

  let isValid = true;

  for (let i = 1; i < lines.length; i++) {
    //End Loop if the file doesn't start with "C" for Card
    if (!isValid) {
      break;
    }
    //Ignore the comments in file
    if (lines[i].indexOf("#") === 0) {
      continue;
    }

    if (lines[i].indexOf("C") === 0) {
      isValid = isValid && isMapOrMountainValid(lines[i], "C");
    }

    if (lines[i].indexOf("M") === 0) {
      isValid = isValid && isMapOrMountainValid(lines[i], "M");
    }

    if (lines[i].indexOf("T") === 0) {
      isValid = isValid && isTreasureValid(lines[i]);
    }

    if (lines[i].indexOf("A") === 0) {
      isValid = isAdventurerValid(lines[i]);
    }
  }

  return isValid;
};

export { validateFile };
