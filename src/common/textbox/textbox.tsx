import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";

type props = {
  flowUp: Function;
  text: string;
};

const TextBox = (props: props) => {
  const [text, setText] = useState(props.text);

  const onChangeEvent = (event: any) => {
    console.log(event, event.target.value);
    const value: string = event.target.value as string;

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
export default TextBox;
