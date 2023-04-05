const Excel = require("exceljs");
const FileSaver = require("file-saver");

// ----------------setting excel properties --------------------------------
const addBorder = (ws, col, row) => {
  ws.getCell(`${col}${row}`).border = {
    top: { style: `thin` },
    left: { style: `thin` },
    bottom: { style: `thin` },
    right: { style: `thin` },
  };
};

const setCenter = (ws, col, row) => {
  ws.getCell(`${col}${row}`).alignment = {
    vertical: `middle`,
    horizontal: `center`,
    wrapText: true,
  };
};

const setFont = (ws, col, row) => {
  ws.getCell(`${col}${row}`).font = {
    size: 8.5,
  };
};

const setRedFont = (ws, col, row) => {
  ws.getCell(`${col}${row}`).font = {
    size: 8.5,
    color: { argb: "ffef5350" },
  };
};

const setGrayColor = (ws, col, row) => {
  ws.getCell(`${col}${row}`).fill = {
    type: `pattern`,
    pattern: `solid`,
    fgColor: { argb: `cccccc` },
  };
};

const setExcelProperties = (ws, col, row) => {
  addBorder(ws, col, row);
  setCenter(ws, col, row);
  setFont(ws, col, row);
};
// ---------------------------------------------------------------------

const colID = [
  `A`,
  `B`,
  `C`,
  `D`,
  `E`,
  `F`,
  `G`,
  `H`,
  `I`,
  `J`,
  `K`,
  `L`,
  `M`,
  `N`,
  `O`,
  `P`,
  `Q`,
  `R`,
  `S`,
  `T`,
  `U`,
  `V`,
  `W`,
  `X`,
  `Y`,
  `Z`,
  `AA`,
  `AB`,
  `AC`,
  `AD`,
  `AE`,
  `AF`,
  `AG`,
  `AH`,
  `AI`,
  `AJ`,
  `AK`,
  `AL`,
  `AM`,
  `AN`,
  `AO`,
  `AP`,
  `AQ`,
  `AR`,
  `AS`,
  `AT`,
  `AU`,
  `AV`,
  `AW`,
  `AX`,
];
const header = [
  `CAL`,
  `MGJ`,
  `BOP`,
  `PD`,
  `RE`,
  ``,
  `MO`,
  `F`,
  `BOP`,
  `PD`,
  `RE`,
  `CAL`,
  ``,
  `CAL`,
  `RE`,
  `PD`,
  `BOP`,
  `F`,
  `MO`,
  ``,
  `RE`,
  `PD`,
  `BOP`,
  `MGJ`,
  `CAL`,
];

const merge = (ws, r) => {
  ws.mergeCells(`${colID[1]}${r}:${colID[3]}${r}`);
  ws.mergeCells(`${colID[4]}${r}:${colID[6]}${r}`);
  ws.mergeCells(`${colID[7]}${r}:${colID[9]}${r}`);
  ws.mergeCells(`${colID[10]}${r}:${colID[12]}${r}`);
  ws.mergeCells(`${colID[13]}${r}:${colID[15]}${r}`);
  ws.mergeCells(`${colID[16]}${r}:${colID[18]}${r}`);
  ws.mergeCells(`${colID[19]}${r}:${colID[21]}${r}`);
  ws.mergeCells(`${colID[22]}${r}:${colID[24]}${r}`);
  ws.mergeCells(`${colID[26]}${r}:${colID[28]}${r}`);
  ws.mergeCells(`${colID[29]}${r}:${colID[31]}${r}`);
  ws.mergeCells(`${colID[32]}${r}:${colID[34]}${r}`);
  ws.mergeCells(`${colID[35]}${r}:${colID[37]}${r}`);
  ws.mergeCells(`${colID[38]}${r}:${colID[40]}${r}`);
  ws.mergeCells(`${colID[41]}${r}:${colID[43]}${r}`);
  ws.mergeCells(`${colID[44]}${r}:${colID[46]}${r}`);
  ws.mergeCells(`${colID[47]}${r}:${colID[49]}${r}`);
};

exports.createReport = (DATA, file_name) => {
  //--------------create a workbook and worksheet--------------
  const wb = new Excel.Workbook();
  const ws = wb.addWorksheet(`My Sheet`);
  ws.views = [{}];

  //---------------set width and height ---------------------
  const colW = [{ width: 4.5 }];
  for (let i = 1; i <= colID.length; i++) {
    colW.push(colW[0]);
  }
  for (let i = 1; i <= 25; i++) {
    ws.getRow(i).height = 20;
  }
  ws.columns = colW;

  //----------------------set gray color----------------------------------
  for (let i = 0; i < colID.length; i++) {
    setGrayColor(ws, colID[i], 13);
  }
  for (let i = 1; i <= 25; i++) {
    setGrayColor(ws, `Z`, i);
  }

  //-----------------------merge cell ---------------------------------
  merge(ws, `2`);
  merge(ws, `6`);
  merge(ws, `7`);
  merge(ws, `19`);
  merge(ws, `20`);
  merge(ws, `24`);

  ws.mergeCells(`A13:AX13`);
  ws.mergeCells(`Z1:Z5`);
  ws.mergeCells(`Z7:Z12`);
  ws.mergeCells(`Z14:Z19`);
  ws.mergeCells(`Z21:Z25`);

  //-----------------------fill side---------------------------------
  ws.getCell(`Z1`).value = `B\nU\nC\nC\nA\nL`;
  ws.getCell(`Z7`).value = `L\nI\nN\nG\nU\nA\nL`;
  ws.getCell(`Z14`).value = `L\nI\nN\nG\nU\nA\nL`;
  ws.getCell(`Z21`).value = `B\nU\nC\nC\nA\nL`;

  //-----------------------set properties at side---------------------------------
  setExcelProperties(ws, `Z`, 1);
  setExcelProperties(ws, `Z`, 7);
  setExcelProperties(ws, `Z`, 14);
  setExcelProperties(ws, `Z`, 21);

  //-----------------------set row header and properties---------------------------------
  const row_header = ws.getColumn(1);
  row_header.values = header;

  for (let row = 1; row <= 25; row++) {
    setExcelProperties(ws, `A`, row);
  }

  //-----------------------create instant for indexing---------------------------------

  const mo_mode = [7, 19];
  const f_mode = [8, 18];
  const mgj_mode = [2, 24];
  const tooth_mode = [6, 20];
  const pd_mode = { buccal: [4, 22], lingual: [10, 16] };
  const re_mode = { buccal: [5, 21], lingual: [11, 15] };
  const bop_mode = { buccal: [3, 23], lingual: [9, 17] };
  const cal_mode = { buccal: [1, 25], lingual: [12, 14] };

  const pattern_flag = [
    { 0: `distal`, 1: `middle`, 2: `mesial` },
    { 0: `mesial`, 1: `middle`, 2: `distal` },
  ];

  //-----------------------fill data to each cell---------------------------------
  DATA.forEach((data) => {
    const flag = data.quadrant === 1 || data.quadrant === 4 ? 0 : 1;
    let start_col = data.quadrant === 1 || data.quadrant === 4 ? 1 : 26;
    const mode = data.quadrant === 1 || data.quadrant === 2 ? 0 : 1;

    const mo_row = mo_mode[mode];
    const mgj_row = mgj_mode[mode];
    const tooth_row = tooth_mode[mode];
    const f_row = f_mode[mode];

    data.idxArray.forEach((idx) => {
      ws.getCell(
        `${colID[start_col]}${tooth_row}`
      ).value = `${data.quadrant}${idx.ID}`;

      ws.getCell(`${colID[start_col]}${mo_row}`).value = idx.MO;
      ws.getCell(`${colID[start_col]}${mgj_row}`).value = idx.MGJ;

      setExcelProperties(ws, colID[start_col], tooth_row);
      setExcelProperties(ws, colID[start_col], mo_row);
      setExcelProperties(ws, colID[start_col], mgj_row);

      if (idx.missing) {
        setGrayColor(ws, colID[start_col], tooth_row);
        setGrayColor(ws, colID[start_col], mo_row);
        setGrayColor(ws, colID[start_col], mgj_row);
      }

      idx.depended_side_data.forEach((side_data) => {
        for (let id = 0; id < 3; id++) {
          setExcelProperties(
            ws,
            colID[start_col + id],
            pd_mode[side_data.side][mode]
          );
          setExcelProperties(
            ws,
            colID[start_col + id],
            re_mode[side_data.side][mode]
          );
          setExcelProperties(
            ws,
            colID[start_col + id],
            bop_mode[side_data.side][mode]
          );
          setExcelProperties(
            ws,
            colID[start_col + id],
            cal_mode[side_data.side][mode]
          );
          setExcelProperties(ws, colID[start_col + id], f_row);

          if (idx.missing) {
            setGrayColor(
              ws,
              colID[start_col + id],
              pd_mode[side_data.side][mode]
            );
            setGrayColor(
              ws,
              colID[start_col + id],
              re_mode[side_data.side][mode]
            );
            setGrayColor(
              ws,
              colID[start_col + id],
              bop_mode[side_data.side][mode]
            );
            setGrayColor(
              ws,
              colID[start_col + id],
              cal_mode[side_data.side][mode]
            );
            setGrayColor(ws, colID[start_col + id], f_row);
            continue;
          }
          if (side_data.PD[pattern_flag[flag][id]] >= 4) {
            setRedFont(
              ws,
              colID[start_col + id],
              pd_mode[side_data.side][mode]
            );
          }
          ws.getCell(
            `${colID[start_col + id]}${pd_mode[side_data.side][mode]}`
          ).value = side_data.PD[pattern_flag[flag][id]];

          if (side_data.RE[pattern_flag[flag][id]] >= 4) {
            setRedFont(
              ws,
              colID[start_col + id],
              re_mode[side_data.side][mode]
            );
          }
          ws.getCell(
            `${colID[start_col + id]}${re_mode[side_data.side][mode]}`
          ).value = side_data.RE[pattern_flag[flag][id]];

          ws.getCell(
            `${colID[start_col + id]}${cal_mode[side_data.side][mode]}`
          ).value =
            side_data.PD[pattern_flag[flag][id]] +
            side_data.RE[pattern_flag[flag][id]];

          if (side_data.BOP[pattern_flag[flag][id]] | 0) {
            ws.getCell(
              `${colID[start_col + id]}${bop_mode[side_data.side][mode]}`
            ).fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "ef5350" },
            };
          }
        }
      });
      start_col = start_col + 3;
    });
  });

  wb.xlsx.writeBuffer().then(function (buffer) {
    const blob = new Blob([buffer], { type: "applicationi/xlsx" });
    FileSaver.saveAs(blob, `${file_name}.xlsx`);
  });
};
