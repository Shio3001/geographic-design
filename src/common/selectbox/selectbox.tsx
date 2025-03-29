import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";
import Select from "react-select";

import "./selectbox.css";

type props = {
  flowUp: Function;
  view_options: Array<string>;
  unselected?: boolean;
  selected: number;
  label_text?: string;
};

type TypeOption = {
  label: string;
  value: number;
};

const SelectBox = (props: props) => {
  // const [selectIndex, setSelectIndex] = useState(props.selected);

  const onChangeEvent = (e: TypeOption) => {
    console.log("onChangeEvent", e);
    // setSelectIndex(value);
    props.flowUp(e.value);
  };

  const getSelectBoxOption = () => {
    const view_options = props.view_options;

    const rv: Array<TypeOption> = [];

    for (let i = 0; i < view_options.length; i++) {
      rv.push({ value: i, label: i + "." + view_options[i] });
    }

    return rv;
  };

  return (
    <>
      <div className="select-com">
        <p className="select_title">{props.label_text}</p>
        <Select
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              width: "280px",
              height: "40px",
              fontSize: "20px",
            }),
          }}
          /** SelectBox の id */
          instanceId="search-select-box"
          value={getSelectBoxOption()[props.selected]}
          options={getSelectBoxOption()}
          onChange={(option) => onChangeEvent(option)}
          /** 検索で、該当なしの場合のメッセージ */
          noOptionsMessage={() => "路線が見つかりません"}
          placeholder="路線を選んでください"
          /** 検索可能・オプション */
          isSearchable={true}
          components={{
            /** Defaultで表示されているセパレーターを消す */
            IndicatorSeparator: () => null,
          }}
        />
      </div>
    </>
  );
};
export default SelectBox;
