import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect, useRef } = React;
import { createRoot } from "react-dom/client";

import "./numberbox.css";

type props = {
  flowUp: Function;
  number: number;
  label_text: string;
};

const NumberBox = (props: props) => {
  const [text, setText] = useState(props.number);

  const onChangeEvent = (event: any) => {
    console.log(event, event.target.value);
    const value: number = event.target.value as number;

    console.log("onChangeEvent", value);
    setText(value);
    props.flowUp(value);
  };

  return (
    <>
      <div className="number_box">
        <p>{props.label_text}</p>
        <input type="text" value={text} onChange={onChangeEvent}></input>
      </div>
    </>
  );
};
export default NumberBox;
