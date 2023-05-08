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
    const toothSides = ["buccal", "lingual"];
    let result = [];
    toothSides.forEach((toothSide) => {
      result.push({
        side: toothSide,
        PD: {
          mesial: this.PD[toothSide]["mesial"],
          middle: this.PD[toothSide][toothSide],
          distal: this.PD[toothSide]["distal"],
        },
        RE: {
          mesial: this.RE[toothSide]["mesial"],
          middle: this.RE[toothSide][toothSide],
          distal: this.RE[toothSide]["distal"],
        },
        BOP: {
          mesial: this.BOP[toothSide]["mesial"],
          middle: this.BOP[toothSide][toothSide],
          distal: this.BOP[toothSide]["distal"],
        },
      });
    });
    return {
      ID: this.ID,
      missing: this.missing,
      depended_side_data: result,
      MO: this.MO,
      MGJ: this.MGJ,
    };
  }

  importValue(toothData) {
    const commands = ["PD", "RE", "BOP"];
    let result = {};
    commands.forEach((command) => {
      result[command] = {
        buccal: {
          distal: toothData.depended_side_data[0][command]["distal"],
          buccal: toothData.depended_side_data[0][command]["middle"],
          mesial: toothData.depended_side_data[0][command]["mesial"],
        },
        lingual: {
          distal: toothData.depended_side_data[1][command]["distal"],
          lingual: toothData.depended_side_data[1][command]["middle"],
          mesial: toothData.depended_side_data[1][command]["mesial"],
        },
      };
    });
    this.missing = toothData.missing;
    this.PD = result.PD;
    this.RE = result.RE;
    this.BOP = result.BOP;
    this.MO = toothData.MO;
    this.MGJ = toothData.MGJ;
    return;
  }
}

module.exports = Tooth;
