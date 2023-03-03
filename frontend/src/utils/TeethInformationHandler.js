exports.teethInformationHandler = (
  obj,
  q,
  i,
  side,
  mode,
  target,
  spec_id = NaN
) => {
  //   console.log(obj);
  if (obj.quadrant === q) {
    obj.idxArray.map((data) => {
      if (data.ID === i) {
        if (mode === "PD") {
          const newPD = data.depended_side_data.map((checkSide) => {
            if (checkSide.side === side) {
              checkSide.PD[spec_id] = target;
            }
            return checkSide;
          });

          return newPD;
        } else if (mode === "RE") {
          const newRE = data.depended_side_data.map((checkSide) => {
            if (checkSide.side === side) {
              checkSide.RE[spec_id] = target;
            }
            return checkSide;
          });

          return newRE;
        } else if (mode === "BOP") {
          const newBOP = data.depended_side_data.map((checkSide) => {
            if (checkSide.side === side) {
              checkSide.BOP[spec_id] = target;
            }
            return checkSide;
          });

          return newBOP;
        } else if (mode === "MO") {
          data.MO = target;
          return data;
        } else if (mode === "MGJ") {
          data.MGJ = target;
          return data;
        } else if (mode === "Missing") {
          data.missing = target;
          return data;
        }
      }
      return data;
    });
  }
  return obj;
};
