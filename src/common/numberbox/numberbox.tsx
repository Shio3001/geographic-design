import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";

type props = {
  flowUp: Function;
  number: number;
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
      <input type="text" value={text} onChange={onChangeEvent}></input>
    </>
  );
};
export default NumberBox;
