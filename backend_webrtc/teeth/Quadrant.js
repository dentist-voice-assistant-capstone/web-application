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
    return {
      quadrant: this.quadrant,
      teeth: result,
    };
  }

  importValue(quadrantData) {
    const teeth = quadrantData.teeth;
    for (let i = 0; i < this.teeth.length; i++) {
      this.teeth[i].importValue(teeth[i]);
    }
    return;
  }
}

module.exports = Quadrant;
