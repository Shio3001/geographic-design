import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";

import PulldownMenu from "../../common/PulldownMenu/pulldown_menu";
import CtrlLayerPull from "./ctrl_layer_pull";

import { getGisInfo, getKeysGisUnitIDs, getNamesGisUnitIDs, getGisUnitIDs } from "./../../gis_scipt/route_setup";

const CtrlLayer = () => {
  const [unit_id, setUnitID] = useState(getKeysGisUnitIDs()[0]);

  const flowUpUnitName = (index: number) => {
    // console.log(index);

    if (index == -1) {
    }

    console.log(getKeysGisUnitIDs()[index]);
    setUnitID(getKeysGisUnitIDs()[index]);
  };

  return (
    <div className="ctrl_layer">
      <div className="ctrl_layer_pull_down_lateral">
        <PulldownMenu unselected={true} flowUp={flowUpUnitName} view_options={getNamesGisUnitIDs()} />
        <CtrlLayerPull unit_id={unit_id} unit_type={getGisInfo().units[unit_id].unit_type} />
      </div>
    </div>
  );
};
export default CtrlLayer;
