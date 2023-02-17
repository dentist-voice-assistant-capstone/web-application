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

export { getToothStartPosition }