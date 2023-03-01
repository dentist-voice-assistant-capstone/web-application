class Tooth {
  constructor(ID, quadrant) {
    this.ID = ID;
    this.quadrant = quadrant;
    this.missing = false;

    this.PD = {
      "buccal": {"distal": null, "buccal": null, "mesial": null},
      "lingual": {"distal": null, "lingual": null, "mesial": null}
    }
    
    this.RE = {
      "buccal": {"distal": null, "buccal": null, "mesial": null},
      "lingual": {"distal": null, "lingual": null, "mesial": null}
    }

    this.BOP = {
      "buccal": {"distal": null, "buccal": null, "mesial": null},
      "lingual": {"distal": null, "lingual": null, "mesial": null}
    }

    this.MO = null
    this.MGJ = null
  }
}

module.exports = Tooth;