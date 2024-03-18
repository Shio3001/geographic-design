import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";

import PulldownMenu from "../../common/PulldownMenu/pulldown_menu";
import Button from "../../common/button/button";

import CtrlLayerPull from "./ctrl_layer_pull";

import { AppContext } from "./../../app_context";
import { CtrlGisContext } from "./../ctrl_gis_context";
import { searchUniqueKey, getArrayIndexNum, getArrayIndexStr } from "./../../gis_scipt/gis_unique_data";

import { getGisInfo, getKeysGisUnitIDs, getNamesGisUnitIDs, getGisUnitIDs } from "./../../gis_scipt/route_setup";

type props = {
  layer_uuid: string;
};

const CtrlLayer = (props: props) => {
  const AppContextValue = useContext(AppContext);
  const CtrlGisContextValue = useContext(CtrlGisContext);

  const flowUpAdd = () => {};
  const flowUpDelete = () => {};
  const flowUpUnitName = () => {};

  useEffect(() => {}, [AppContextValue.app_state.update]);

  return (
    <div className="ctrl_layer">
      <div className="ctrl_layer_pull_down_lateral">
        <Button flowUp={flowUpAdd} text={"下に追加"}></Button>
        <Button flowUp={flowUpDelete} text={"削除"}></Button>
        <PulldownMenu flowUp={flowUpUnitName} view_options={getNamesGisUnitIDs()} />
        <CtrlLayerPull layer_uuid={props.layer_uuid} />
      </div>
    </div>
  );
};
export default CtrlLayer;
