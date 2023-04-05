const getToothStartPosition = (quadrant, id, tooth_side) => {
  if (!!!quadrant || !!!id || !!!tooth_side) {
    return null;
  }

  if (((quadrant === 1 || quadrant === 3) && tooth_side.toLowerCase() === "buccal") ||
    ((quadrant === 2 || quadrant === 4) && tooth_side.toLowerCase() === "lingual")) {
    return "distal";
  } else if (((quadrant === 1 || quadrant === 3) && tooth_side.toLowerCase() === "lingual") ||
    ((quadrant === 2 || quadrant === 4) && tooth_side.toLowerCase() === "buccal")) {
    return "mesial";
  } else {
    return null;
  }
}

const getListOfMissingToothFromInformation = (information) => {
  /* input: information (ToothTable)
     output: a array of objects of missing tooths 
            [{q: ..., i: ...}, {q: ..., i: ...}]
  */
  const missingToothList = [];
  for (let q = 1; q <= 4; q++) {
    for (let i = 0; i < information[q - 1].idxArray.length; i++) {
      let ID = information[q - 1].idxArray[i].ID
      if (information[q - 1].idxArray[i].missing) {
        missingToothList.push({ q: q, i: ID })
      }
    }
  }
  return missingToothList
}

const defaultCurrentCommand = {
  command: null,
  tooth: null,
  side: null,
  position: null,
  quadrant: 1,
};

const currentCommandReducer = (prevCommand, action) => {
  switch (action.type) {
    case "CLEAR_COMMAND":
      return defaultCurrentCommand;
    case "UPDATE_COMMAND":
      // if the quadrant is changed, then set new quadrant
      let quadrant = prevCommand.quadrant;
      if (!!action.payload.tooth) {
        let newQuadrant = parseInt(action.payload.tooth.slice(0, 1));
        quadrant = newQuadrant;
      }
      return { ...action.payload, quadrant };

    case "NEXT_TOOTH":
      if (!!!action.payload.next_tooth) {
        return prevCommand;
      }
      let position = null;
      if (action.payload.mode === "RE") {
        position = getToothStartPosition(
          action.payload.next_tooth.q,
          action.payload.next_tooth.i,
          prevCommand.side
        );
      }

      let nextToothCommand = {
        command: prevCommand.command,
        tooth:
          action.payload.next_tooth.q.toString() +
          action.payload.next_tooth.i.toString(),
        side: prevCommand.side,
        position: position,
        quadrant: action.payload.next_tooth.q,
      };
      return nextToothCommand;

    case "UPDATE_PDRE_POSITION":
      /* this action will work when the system receive the RE value of 
        the latest tooth position
      */
      if (
        prevCommand.command !== "PDRE" ||
        !!!prevCommand.side ||
        !!!prevCommand.tooth ||
        !!!prevCommand.position ||
        !!!action.payload ||
        !!!action.payload.tooth ||
        !!!action.payload.side ||
        !!!action.payload.position
      ) {
        return prevCommand;
      }

      let tooth = prevCommand.tooth;
      let q = parseInt(tooth.slice(0, 1));
      let currentSide = prevCommand.side.toLowerCase();
      let currentPosition = prevCommand.position.toLowerCase();

      if (
        tooth !== action.payload.tooth ||
        currentSide !== action.payload.side.toLowerCase() ||
        currentPosition !== action.payload.position.toLowerCase()
      ) {
        return prevCommand;
      }

      let positionArray;
      if (
        ((q === 1 || q === 3) && currentSide === "buccal") ||
        ((q === 2 || q === 4) && currentSide === "lingual")
      ) {
        positionArray = ["distal", "middle", "mesial"];
      } else if (
        ((q === 1 || q === 3) && currentSide === "lingual") ||
        ((q === 2 || q === 4) && currentSide === "buccal")
      ) {
        positionArray = ["mesial", "middle", "distal"];
      }

      let currentPositionIndex = positionArray.findIndex(
        (p) => p === currentPosition
      );

      // stay at the same zee, just move the position
      if (currentPositionIndex < 2) {
        let newPosition = positionArray[currentPositionIndex + 1];
        return {
          command: "PDRE",
          tooth: tooth,
          side: currentSide,
          position: newPosition,
          quadrant: q,
        };
      } else {
        return prevCommand;
      }

    case "CHANGE_QUADRANT":
      let quadrantToChange = action.payload.quadrant;
      if (quadrantToChange !== prevCommand.quadrant) {
        return { ...prevCommand, quadrant: quadrantToChange };
      } else {
        return prevCommand;
      }

    default:
      return prevCommand;
  }
};

export { getToothStartPosition, getListOfMissingToothFromInformation, defaultCurrentCommand, currentCommandReducer }