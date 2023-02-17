const Quadrant = require("./Quadrant.js");

class ToothTable {
  constructor() {
    this.quadrants = [];

    for (let quadrant = 1; quadrant <= 4; quadrant++) {
      const q = new Quadrant(quadrant)
      this.quadrants.push(q)
    }
  }

  updateValue(q, i, mode, target, side = null, position = null) {
    /* 
      return true if the value changed, otherwise return false
    */
    let isUpdate;
    switch (mode) {
      case ("PD"):
        isUpdate = this.quadrants[q - 1].teeth[i - 1].PD[side][position] !== target;
        this.quadrants[q - 1].teeth[i - 1].PD[side][position] = target;
        break;
      case ("RE"):
        isUpdate = this.quadrants[q - 1].teeth[i - 1].RE[side][position] !== target;
        this.quadrants[q - 1].teeth[i - 1].RE[side][position] = target;
        break;
      case ("BOP"):
        isUpdate = this.quadrants[q - 1].teeth[i - 1].BOP[side][position] !== target;
        isUpdate = this.quadrants[q - 1].teeth[i - 1].BOP[side][position] = target;
        break;
      case ("MO"):
        isUpdate = this.quadrants[q - 1].teeth[i - 1].MO !== target;
        this.quadrants[q - 1].teeth[i - 1].MO = target;
        break;
      case ("MGJ"):
        isUpdate = this.quadrants[q - 1].teeth[i - 1].MGJ !== target;
        this.quadrants[q - 1].teeth[i - 1].MGJ = target;
        break;
      case ("Missing"):
        isUpdate = this.quadrants[q - 1].teeth[i - 1].missing !== target;
        this.quadrants[q - 1].teeth[i - 1].missing = target;
        break;
      default:
        return false;
    }
    return isUpdate;
  }

  findNextAvailableTooth(q, i, side = null) {
    // instantiate toothArray that represents the order of recording PDRE values 
    // based on the quadrant, side that being recorded
    let toothArray = [];
    if ((q === 1) || (q === 2)) {
      for (let quadrant = 1; quadrant <= 2; quadrant++) {
        if (quadrant === 1) {
          for (let toothID = 8; toothID >= 1; toothID--) {
            toothArray.push([quadrant, toothID]);
          }
        } else {
          for (let toothID = 1; toothID <= 8; toothID++) {
            toothArray.push([quadrant, toothID]);
          }
        }
      }
    } else if ((q === 3) || (q === 4)) {
      for (let quadrant = 4; quadrant >= 3; quadrant--) {
        if (quadrant === 4) {
          for (let toothID = 8; toothID >= 1; toothID--) {
            toothArray.push([quadrant, toothID]);
          }
        } else {
          for (let toothID = 1; toothID <= 8; toothID++) {
            toothArray.push([quadrant, toothID]);
          }
        }
      }
    }
    // reverse the toothArray 
    // for quadrant 1-2 if side === "lingual"
    // for quadrant 3-4 if side === "buccal"
    if (!!side && (((q === 1 || q === 2) && side === "lingual") || ((q === 3 || q === 4) && side === "buccal"))) {
      toothArray.reverse();
    }

    let toothIndex = toothArray.findIndex((t) => {
      return t[0] === q && t[1] === i
    }) + 1;

    let next_tooth = null;
    while (toothIndex < toothArray.length) {
      const [next_tooth_q, next_tooth_i] = toothArray[toothIndex]
      // check that tooth at quadrant: next_tooth_q, ID: next_tooth_i is not missing ?
      if (!this.quadrants[next_tooth_q - 1].teeth[next_tooth_i - 1].missing) {
        next_tooth = { q: next_tooth_q, i: next_tooth_i };
        break;
      }
      toothIndex++;
    }
    return next_tooth;
  }

  showPDREValue() {
    let pd = 'PD: ';
    let re = 'RE: ';
    let tooth = '   ';
    for (let i = 8; i >= 1; i--) {
      pd += this.quadrants[0].teeth[i - 1].PD["buccal"]["distal"] || 'x' + ' '
      pd += this.quadrants[0].teeth[i - 1].PD["buccal"]["buccal"] || 'x' + ' '
      pd += this.quadrants[0].teeth[i - 1].PD["buccal"]["mesial"] || 'x' + ' '

      re += this.quadrants[0].teeth[i - 1].RE["buccal"]["distal"] || 'x' + ' '
      re += this.quadrants[0].teeth[i - 1].RE["buccal"]["buccal"] || 'x' + ' '
      re += this.quadrants[0].teeth[i - 1].RE["buccal"]["mesial"] || 'x' + ' '

      pd += '| '
      re += '| '

      tooth += `==1${i}== `
    }
    pd += '||| '
    re += '||| '
    for (let i = 1; i <= 8; i++) {
      pd += this.quadrants[1].teeth[i - 1].PD["buccal"]["mesial"] || 'x' + ' '
      pd += this.quadrants[1].teeth[i - 1].PD["buccal"]["buccal"] || 'x' + ' '
      pd += this.quadrants[1].teeth[i - 1].PD["buccal"]["distal"] || 'x' + ' '

      re += this.quadrants[1].teeth[i - 1].RE["buccal"]["mesial"] || 'x' + ' '
      re += this.quadrants[1].teeth[i - 1].RE["buccal"]["buccal"] || 'x' + ' '
      re += this.quadrants[1].teeth[i - 1].RE["buccal"]["distal"] || 'x' + ' '

      pd += '| '
      re += '| '

      tooth += `==2${i}== `
    }

    console.log(pd)
    console.log(re)
    console.log(tooth)
  }
}

module.exports = ToothTable;