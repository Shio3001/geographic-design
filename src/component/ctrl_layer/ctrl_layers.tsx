import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";

import PulldownMenu from "../../common/PulldownMenu/pulldown_menu";
import CtrlLayerPull from "./ctrl_layer_pull";
import CtrlLayer from "./ctrl_layer";
import TextBox from "../../common/textbox/textbox";
import NumberBox from "../../common/numberbox/numberbox";

import { getGisInfo, getKeysGisUnitIDs, getNamesGisUnitIDs, getGisUnitIDs } from "./../../gis_scipt/route_setup";

const CtrlLayers = () => {
  const [layer_length, setLayerLength] = useState(0);
  const flowUpLayerLength = (length: number) => {
    setLayerLength(length);
  };

  const buildComponentLayer = () => {
    const components = [];

    for (let i = 0; i < layer_length; i++) {
      components.push(<CtrlLayer key={i} />);
    }

    return components;
  };

  return (
    <>
      <NumberBox flowUp={flowUpLayerLength} number={layer_length} />{" "}
      {buildComponentLayer().map((Component, index) => {
        return Component;
      })}
    </>
  );
};
export default CtrlLayers;
