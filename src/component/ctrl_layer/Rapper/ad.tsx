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

const PullRapperAdministrative = (props: PullRapper) => {
  const AppContextValue = useContext(AppContext);
  const layer = AppContextValue.edit_data.getLayer(props.layer_uuid);
  const [threshold, setThreshold] = useState(layer.getElement("threshold") ? layer.getElement("threshold") : "10000");
  const [thinoout, setThinoout] = useState(layer.getElement("thinoout") ? layer.getElement("thinoout") : "10");

  const pref = searchUniqueKey(getGisInfo(), layer.unit_id, "N03_001");

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
    if (!layer.layer_infomation["administrative"]) {
      flowUpUnitAdministrative(0);
    }
    if (!layer.layer_infomation["path_join"]) {
      flowUpPathJoin(true);
    }

    if (!layer.layer_infomation["threshold"]) {
      flowUpUnitThreshold("10000");
    }
    if (!layer.layer_infomation["thinoout"]) {
      flowUpUnitThinoout("10");
    }
  }, [props.unit_type, props.layer_uuid]);

  const flowUpUnitPref = (index: number) => {
    const layer_pref = pref[index];
    layer.updateLayerElement("pref", layer_pref);
    const edit_data = AppContextValue.edit_data;
    edit_data.setLayer(layer);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  const getAdministrativeViewOptions = () => {
    const unit_id = layer.getUnitId();
    const view_lines = searchUniqueKeyBySearchKey(getGisInfo(), unit_id, "N03_001", layer.layer_infomation["administrative"], "N03_007");
    return view_lines;
  };

  const flowUpUnitAdministrative = (index: number) => {
    const layer_administrative = getAdministrativeViewOptions()[index];
    layer.updateLayerElement("administrative", layer_administrative);
    const edit_data = AppContextValue.edit_data;
    edit_data.setLayer(layer);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  const flowUpUnitThreshold = (value: string) => {
    layer.updateLayerElement("threshold", value);
    setThreshold(value);
    const edit_data = AppContextValue.edit_data;
    edit_data.setLayer(layer);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  const flowUpUnitThinoout = (value: string) => {
    layer.updateLayerElement("thinoout", value);
    setThinoout(value);
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
      <SelectBox
        flowUp={flowUpUnitAdministrative}
        view_options={getAdministrativeViewOptions()}
        selected={getArrayIndexStr(getAdministrativeViewOptions(), layer.getElement("administrative"))}
      />
      <CheckBox flowUp={flowUpPathJoin} label_text={"パスの結合"} checked={getCheckedPathJoin()} />{" "}
      <TextBox label_text="閾値" text={threshold} flowUp={flowUpUnitThreshold}></TextBox>{" "}
      <TextBox label_text="間引き" text={thinoout} flowUp={flowUpUnitThinoout}></TextBox>{" "}
    </>
  );
};

export default PullRapperAdministrative;
