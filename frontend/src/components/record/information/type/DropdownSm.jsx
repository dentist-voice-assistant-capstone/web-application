import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import classes from "./DropdownSm.module.css";

function DropdownSm({
  quadrant,
  side,
  id,
  mode,
  specific_id,
  data,
  handleSetInformation,
}) {
  const [value, setValue] = useState(data);
  const handleSelect = (target) => {
    handleSetInformation(quadrant, id, side, mode, target, specific_id);
    setValue(target);
  };

  if (side === "buccal") {
    return (
      <DropdownButton
        className={classes.smallbox}
        title={value}
        onSelect={handleSelect}
      >
        <Dropdown.Item eventKey="-5">-5</Dropdown.Item>
        <Dropdown.Item eventKey="-4">-4</Dropdown.Item>
        <Dropdown.Item eventKey="-3">-3</Dropdown.Item>
        <Dropdown.Item eventKey="-2">-2</Dropdown.Item>
        <Dropdown.Item eventKey="-1">-1</Dropdown.Item>
        <Dropdown.Item eventKey="0">0</Dropdown.Item>
        <Dropdown.Item eventKey="1">1</Dropdown.Item>
        <Dropdown.Item eventKey="2">2</Dropdown.Item>
        <Dropdown.Item eventKey="3">3</Dropdown.Item>
        <Dropdown.Item eventKey="4">4</Dropdown.Item>
        <Dropdown.Item eventKey="5">5</Dropdown.Item>
        <Dropdown.Item eventKey="6">6</Dropdown.Item>
        <Dropdown.Item eventKey="7">7</Dropdown.Item>
        <Dropdown.Item eventKey="8">8</Dropdown.Item>
        <Dropdown.Item eventKey="9">9</Dropdown.Item>
        <Dropdown.Item eventKey="10">10</Dropdown.Item>
        <Dropdown.Item eventKey="11">11</Dropdown.Item>
        <Dropdown.Item eventKey="12">12</Dropdown.Item>
        <Dropdown.Item eventKey="13">13</Dropdown.Item>
        <Dropdown.Item eventKey="14">14</Dropdown.Item>
        <Dropdown.Item eventKey="15">15</Dropdown.Item>
      </DropdownButton>
    );
  } else if (side === "lingual") {
    return (
      <DropdownButton
        className={classes.smallbox}
        title={value}
        onSelect={handleSelect}
      >
        <Dropdown.Item eventKey="1">1</Dropdown.Item>
        <Dropdown.Item eventKey="2">2</Dropdown.Item>
        <Dropdown.Item eventKey="3">3</Dropdown.Item>
        <Dropdown.Item eventKey="4">4</Dropdown.Item>
        <Dropdown.Item eventKey="5">5</Dropdown.Item>
        <Dropdown.Item eventKey="6">6</Dropdown.Item>
        <Dropdown.Item eventKey="7">7</Dropdown.Item>
        <Dropdown.Item eventKey="8">8</Dropdown.Item>
        <Dropdown.Item eventKey="9">9</Dropdown.Item>
        <Dropdown.Item eventKey="10">10</Dropdown.Item>
        <Dropdown.Item eventKey="11">11</Dropdown.Item>
        <Dropdown.Item eventKey="12">12</Dropdown.Item>
        <Dropdown.Item eventKey="13">13</Dropdown.Item>
        <Dropdown.Item eventKey="14">14</Dropdown.Item>
        <Dropdown.Item eventKey="15">15</Dropdown.Item>
      </DropdownButton>
    );
  }
}
export default DropdownSm;
