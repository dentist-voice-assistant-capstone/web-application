const Tooth = require("./Tooth.js");

class Quadrant {
  constructor(quadrant) {
    this.quadrant = quadrant;
    this.teeth = [];

    for (let ID = 1; ID <= 8; ID++) {
      const t = new Tooth(ID, quadrant);
      this.teeth.push(t);
    }
  }

  exportValue() {
    let result = [];
    this.teeth.forEach((tooth) => result.push(tooth.exportValue()));
    // if quadrant = 1 or quadrant = 4, reverse the result list.
    if (this.quadrant === 1 || this.quadrant === 4) {
      result.reverse();
    }
    return {
      quadrant: this.quadrant,
      idxArray: result,
    };
  }

  importValue(quadrantData) {
    const teeth = quadrantData.idxArray;
    // if quadrant = 1 or quadrant = 4, reverse the result list.
    if (this.quadrant === 1 || this.quadrant === 4) {
      teeth.reverse();
    }
    teeth.forEach((tooth, index) => this.teeth[index].importValue(tooth));
    return;
  }
}

module.exports = Quadrant;
