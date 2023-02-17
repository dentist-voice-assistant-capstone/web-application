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
  `MGJ`,
  `BOP`,
  `PD`,
  `RE`,
  ``,
  `RE`,
  `PD`,
  `BOP`,
  `MO`,
  ``,
  `MO`,
  `BOP`,
  `PD`,
  `RE`,
  ``,
  `RE`,
  `PD`,
  `BOP`,
  `MGJ`,
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

exports.createReport = (EX_DATA) => {
  //--------------create a workbook and worksheet--------------
  const wb = new Excel.Workbook();
  const ws = wb.addWorksheet(`My Sheet`);
  ws.views = [{}];

  //---------------set width and height ---------------------
  const colW = [{ width: 4.5 }];
  for (let i = 1; i <= colID.length; i++) {
    colW.push(colW[0]);
  }
  for (let i = 1; i <= 19; i++) {
    ws.getRow(i).height = 20;
  }
  ws.columns = colW;

  //----------------------set gray color----------------------------------
  for (let i = 0; i < colID.length; i++) {
    setGrayColor(ws, colID[i], 10);
  }
  for (let i = 1; i < 20; i++) {
    setGrayColor(ws, `Z`, i);
  }

  //-----------------------merge cell ---------------------------------
  merge(ws, `1`);
  merge(ws, `5`);
  merge(ws, `9`);
  merge(ws, `11`);
  merge(ws, `15`);
  merge(ws, `19`);

  ws.mergeCells(`A10:AX10`);
  ws.mergeCells(`Z1:Z4`);
  ws.mergeCells(`Z6:Z9`);
  ws.mergeCells(`Z11:Z14`);
  ws.mergeCells(`Z16:Z19`);

  //-----------------------fill side---------------------------------
  ws.getCell(`Z1`).value = `B\nU\nC\nC\nA\nL`;
  ws.getCell(`Z6`).value = `L\nI\nN\nG\nU\nA\nL`;
  ws.getCell(`Z11`).value = `L\nI\nN\nG\nU\nA\nL`;
  ws.getCell(`Z16`).value = `B\nU\nC\nC\nA\nL`;

  //-----------------------set properties at side---------------------------------
  setExcelProperties(ws, `Z`, 1);
  setExcelProperties(ws, `Z`, 6);
  setExcelProperties(ws, `Z`, 11);
  setExcelProperties(ws, `Z`, 16);

  //-----------------------set row header and properties---------------------------------
  const row_header = ws.getColumn(1);
  row_header.values = header;

  for (let row = 1; row < 20; row++) {
    setExcelProperties(ws, `A`, row);
  }

  //-----------------------create instant for indexing---------------------------------
  const mo_mode = [9, 11];
  const mgj_mode = [1, 19];
  const tooth_mode = [5, 15];
  const pd_mode = { buccal: [3, 17], lingual: [7, 13] };
  const re_mode = { buccal: [4, 16], lingual: [6, 14] };
  const bop_mode = { buccal: [2, 18], lingual: [8, 12] };

  const pattern_flag = [
    { 0: `distal`, 1: `middle`, 2: `mesial` },
    { 0: `mesial`, 1: `middle`, 2: `distal` },
  ];

  //-----------------------fill data to each cell---------------------------------
  EX_DATA.forEach((data) => {
    const flag = data.quadrant === 1 || data.quadrant === 4 ? 0 : 1;
    let start_col = data.quadrant === 1 || data.quadrant === 4 ? 1 : 26;
    const mode = data.quadrant === 1 || data.quadrant === 2 ? 0 : 1;

    const mo_row = mo_mode[mode];
    const mgj_row = mgj_mode[mode];
    const tooth_row = tooth_mode[mode];

    data.idxArray.forEach((idx) => {
      ws.getCell(
        `${colID[start_col]}${tooth_row}`
      ).value = `${data.quadrant}${idx.ID}`;

      // if (idx.missing) {
      ws.getCell(`${colID[start_col]}${mo_row}`).value = idx.MO;
      ws.getCell(`${colID[start_col]}${mgj_row}`).value = idx.MGJ;
      // }

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
            continue;
          }

          ws.getCell(
            `${colID[start_col + id]}${pd_mode[side_data.side][mode]}`
          ).value = side_data.PD[pattern_flag[flag][id]];
          ws.getCell(
            `${colID[start_col + id]}${re_mode[side_data.side][mode]}`
          ).value = side_data.RE[pattern_flag[flag][id]];
          // ws.getCell(
          //   `${colID[start_col + id]}${bop_mode[side_data.side][mode]}`
          // ).value = side_data.BOP[pattern_flag[flag][id]] | 0;

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
    FileSaver.saveAs(blob, "report.xlsx");
  });
};
