import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";

import "./pulldown_menu.css";

type props = {
  flowUp: Function;
  view_options: Array<string>;
  unselected?: boolean;
  selected: number;
  label_text?: string;
};

const PulldownMenu = (props: props) => {
  // const [selectIndex, setSelectIndex] = useState(props.selected);

  const onChangeEvent = (event: any) => {
    console.log(event, event.target.value);
    const value: number = event.target.value as number;

    console.log("onChangeEvent", value);
    // setSelectIndex(value);
    props.flowUp(value);
  };

  // useEffect(() => {
  //   setSelectIndex(props.selected);
  // }, [props.selected]);

  return (
    <>
      <div className="pulldowm-com">
        <p className="select_title">{props.label_text}</p>
        <select value={props.selected} onChange={onChangeEvent}>
          {props.view_options.map((view, index) => {
            return (
              <option key={index} value={index}>
                {index}. {view}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
};
export default PulldownMenu;
