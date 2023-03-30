class Tooth {
  constructor(ID, quadrant) {
    this.ID = ID;
    this.quadrant = quadrant;
    this.missing = false;

    this.PD = {
      buccal: { distal: null, buccal: null, mesial: null },
      lingual: { distal: null, lingual: null, mesial: null },
    };

    this.RE = {
      buccal: { distal: null, buccal: null, mesial: null },
      lingual: { distal: null, lingual: null, mesial: null },
    };

    this.BOP = {
      buccal: { distal: null, buccal: null, mesial: null },
      lingual: { distal: null, lingual: null, mesial: null },
    };

    this.MO = null;
    this.MGJ = null;
  }

  exportValue() {
    return {
      ID: this.ID,
      quadrant: this.quadrant,
      missing: this.missing,
      PD: this.PD,
      RE: this.RE,
      BOP: this.BOP,
      MO: this.MO,
      MGJ: this.MGJ,
    };
  }

  importValue(toothData) {
    this.ID = toothData.ID;
    this.quadrant = toothData.quadrant;
    this.missing = toothData.missing;
    this.PD = toothData.PD;
    this.RE = toothData.RE;
    this.BOP = toothData.BOP;
    this.MO = toothData.MO;
    this.MGJ = toothData.MGJ;
    return;
  }
}

module.exports = Tooth;
