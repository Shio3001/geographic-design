import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import PulldownMenu from "../../../common/pulldown_menu/pulldown_menu";

import CheckBox from "./../../../common/checkbox/checkbox";
import NumberBox from "./../../../common/numberbox/numberbox";
import SelectBox from "../../../common/selectbox/selectbox";

import { getGisInfo, getKeysGisUnitIDs, getNamesGisUnitIDs, getGisUnitIDs } from "./../../../gis_scipt/route_setup";
import {
  searchUniqueKey,
  getArrayIndexNum,
  getArrayIndexStr,
  searchUniqueIndex,
  logicalAnd,
  searchUniquePropertie,
  searchUniqueKeyBySearchKey,
} from "./../../../gis_scipt/gis_unique_data";

import { AppContext } from "./../../../app_context";
import LayerData from "../../ctrl_dataflow/edit_data/layer_data";
import TextBox from "../../../common/textbox/textbox";

import { PullRapper } from "./helper";

const PullRapperRiver = (props: PullRapper) => {
  const AppContextValue = useContext(AppContext);
  const layer = AppContextValue.edit_data.getLayer(props.layer_uuid);

  const pref = searchUniqueKey(getGisInfo(), layer.unit_id, "pref");

  useEffect(() => {
    return () => {
      const edit_data = AppContextValue.edit_data;
      edit_data.setLayer(layer);
      AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
    };
  }, [props.unit_type, props.layer_uuid]);

  useEffect(() => {
    if (!layer.layer_infomation["pref"]) {
      flowUpUnitPref(0);
    }
    if (!layer.layer_infomation["river"]) {
      flowUpUnitRiver(0);
    }
    if (!layer.layer_infomation["path_join"]) {
      flowUpPathJoin(true);
    }
  }, [props.unit_type, props.layer_uuid]);

  const flowUpUnitPref = (index: number) => {
    const layer_pref = pref[index];
    layer.updateLayerElement("pref", layer_pref);
    const edit_data = AppContextValue.edit_data;
    edit_data.setLayer(layer);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });

    flowUpUnitRiver(0);
  };

  const getRiverValueOptions = () => {
    const unit_id = layer.getUnitId();
    const view_lines = searchUniqueKeyBySearchKey(getGisInfo(), unit_id, "pref", layer.layer_infomation["pref"], "river");
    return view_lines;
  };
  const getRiverViewOptions = () => {
    return getRiverValueOptions();
  };

  const flowUpUnitRiver = (index: number) => {
    const layer_river = getRiverValueOptions()[index];
    layer.updateLayerElement("river", layer_river);
    const edit_data = AppContextValue.edit_data;
    edit_data.setLayer(layer);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  const flowUpPathJoin = (check: boolean) => {
    console.log("flowUpPathJoin", check);
    layer.updateLayerElement("path_join", check ? "ok" : "no");
    const edit_data = AppContextValue.edit_data;
    edit_data.setLayer(layer);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  const getCheckedPathJoin = () => {
    if (!("path_join" in layer.layer_infomation)) {
      return true;
    }

    const c = layer.getElement("path_join");
    return c == "ok";
  };
  return (
    <>
      <SelectBox flowUp={flowUpUnitPref} view_options={pref} selected={getArrayIndexStr(pref, layer.getElement("pref"))} />{" "}
      <SelectBox flowUp={flowUpUnitRiver} view_options={getRiverViewOptions()} selected={getArrayIndexStr(getRiverValueOptions(), layer.getElement("river"))} />
      <CheckBox flowUp={flowUpPathJoin} label_text={"パスの結合"} checked={getCheckedPathJoin()} />{" "}
    </>
  );
};

export default PullRapperRiver;
