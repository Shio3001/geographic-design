import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect, useRef } = React;
import { createRoot } from "react-dom/client";

import "./checkbox.css";

type props = {
  label_text: string;
  checked: boolean;
  flowUp: Function;
};

const CheckBox = (props: props) => {
  const checkbox_ref = useRef<HTMLInputElement>(null);

  const [check, setCheck] = useState(props.checked);

  const onChangeEvent = (event: any) => {
    props.flowUp(!props.checked);
    setCheck(!props.checked);
    checkbox_ref.current.checked = !props.checked;
  };

  useEffect(() => {
    checkbox_ref.current.checked = props.checked;
    setCheck(props.checked);
  }, [props.checked]);

  return (
    <>
      <div className="checkbox-com">
        <input type="checkbox" onChange={onChangeEvent} ref={checkbox_ref}></input>
        <label style={{ userSelect: "none" }} onClick={onChangeEvent}>
          {props.label_text}
        </label>
      </div>
    </>
  );
};
export default CheckBox;
