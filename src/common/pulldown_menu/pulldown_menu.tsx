import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";

type props = {
  flowUp: Function;
  view_options: Array<string>;
  unselected?: boolean;
  selected: number;
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
      <select value={props.selected} onChange={onChangeEvent}>
        {props.view_options.map((view, index) => {
          return (
            <option key={index} value={index}>
              {index}. {view}
            </option>
          );
        })}
      </select>
    </>
  );
};
export default PulldownMenu;
