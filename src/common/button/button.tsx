import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";

import "./button.css";

type props = {
  flowUp: Function;
  text: string;
};

const Button = (props: props) => {
  const onClickEvent = (event: any) => {
    props.flowUp();
  };

  return (
    <>
      <input type="button" value={props.text} onClick={onClickEvent} className="fancy-button"></input>
    </>
  );
};
export default Button;
