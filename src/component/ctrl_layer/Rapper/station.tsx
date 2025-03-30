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
import exp from "constants";

const PullRapperStation = (props: PullRapper) => {
  const AppContextValue = useContext(AppContext);
  const layer = AppContextValue.edit_data.getLayer(props.layer_uuid);

  const railways = searchUniqueKey(getGisInfo(), layer.unit_id, "N02_004");

  useEffect(() => {
    return () => {
      const edit_data = AppContextValue.edit_data;
      edit_data.setLayer(layer);
      AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
    };
  }, [props.layer_uuid]);

  useEffect(() => {
    if (!layer.layer_infomation["railway"]) {
      flowUpUnitRailway(0);
    }
    if (!layer.layer_infomation["line"]) {
      flowUpUnitLine(0);
    }
  }, [props.layer_uuid]);

  const flowUpUnitRailway = (index: number) => {
    const layer_railway = railways[index];
    layer.updateLayerElement("railway", layer_railway);
    layer.updateLayerElement("line", getLineViewOptions()[0]);

    const edit_data = AppContextValue.edit_data;

    edit_data.setLayer(layer);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  const flowUpUnitLine = (index: number) => {
    const layer_line = getLineViewOptions()[index];
    layer.updateLayerElement("line", layer_line);
    const edit_data = AppContextValue.edit_data;
    edit_data.setLayer(layer);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  const getLineViewOptions = () => {
    const unit_id = layer.getUnitId();
    const view_lines = searchUniqueKeyBySearchKey(getGisInfo(), unit_id, "N02_004", layer.layer_infomation["railway"], "N02_003");

    return view_lines;
  };

  const flowUpStationAverage = (check: boolean) => {
    layer.updateLayerElement("station_average", check ? "ok" : "no");
    const edit_data = AppContextValue.edit_data;
    edit_data.setLayer(layer);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  const getCheckedStationAverage = () => {
    if (!("station_average" in layer.layer_infomation)) {
      return false;
    }

    const c = layer.getElement("station_average");
    return c == "ok";
  };

  return (
    <>
      <SelectBox flowUp={flowUpUnitRailway} view_options={railways} selected={getArrayIndexStr(railways, layer.getElement("railway"))} />
      <SelectBox flowUp={flowUpUnitLine} view_options={getLineViewOptions()} selected={getArrayIndexStr(getLineViewOptions(), layer.getElement("line"))} />
      <CheckBox flowUp={flowUpStationAverage} label_text={"駅座標平均"} checked={getCheckedStationAverage()} />
    </>
  );
};

export default PullRapperStation;
