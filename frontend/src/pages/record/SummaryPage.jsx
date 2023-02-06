import classes from "./SummaryPage.module.css";
import NavBar from "../../components/ui/NavBar";
import { useNavigate, useLocation } from "react-router-dom";
import { startAPIHandler } from "../../utils/apiHandler";
import { Parser } from "html-to-react";
// import { JsonToExcel } from "react-json-to-excel";

const SummaryPage = () => {
  const { state } = useLocation();
  const { information } = state;
  // console.log(information);

  const jsonrawtoxlsx = require("jsonrawtoxlsx");
  // const fs = require("fs");

  const { jsonToHTMLTable } = require("nested-json-to-table");

  const tableHTML = jsonToHTMLTable(information);
  console.log(tableHTML.outerHTML);
  // const buffer = jsonrawtoxlsx(information);

  // fs.writeFileSync("example.xlsx", buffer, "binary");

  // const insertHTML = (information, position, insertion) => {
  //   var output = [
  //     information.slice(0, position),
  //     insertion,
  //     information.slice(position),
  //   ].join("");
  //   return output;
  // };

  // console.log(insertHTML(information.outerHTML, 5, " id='table-to-xls'"));

  // function startHandler() {
  //   startAPIHandler(); // just console.log("starting")
  //   navigate("/record");
  // }

  // function editAccountMenuOnClickHandler() {
  //   navigate("/account/edit");
  // }

  // let settings = {
  //   fileName: "MySpreadsheet", // Name of the resulting spreadsheet
  //   extraLength: 5, // A bigger number means that columns will be wider
  //   writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
  //   writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
  //   RTL: true, // Display the columns from right-to-left (the default value is false)
  // };

  // xlsx(information, settings);

  return (
    // <>
    //   {/* rendered the JSX */}
    //   <div>{tableHTML}</div>
    // </>
    <div style={container}>
      <div dangerouslySetInnerHTML={{ __html: tableHTML.outerHTML }}></div>
      {/* {Parser().parse(tableHTML)} */}
      {/* <div dangerouslySetInnerHTML={{ __html: { tableHTML } }} /> */}
    </div>
  );
};

export default SummaryPage;

const container = {
  width: 500,
  margin: "10px auto",
};
