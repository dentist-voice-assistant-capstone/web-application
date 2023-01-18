const Tooth = require("./Tooth.js");

class Quadrant {
    constructor(quadrant) {
      this.quadrant = quadrant;
      this.teeth = [];

      for (let ID = 1; ID <= 8; ID++) {
        const t = new Tooth(ID, quadrant)
        this.teeth.push(t)
      }
    }
  }

module.exports = Quadrant;