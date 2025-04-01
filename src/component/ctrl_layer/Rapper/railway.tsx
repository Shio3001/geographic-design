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
const PullRapperRailroadSection = (props: PullRapper) => {
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
    if (!layer.layer_infomation["path_join"]) {
      flowUpPathJoin(true);
    }
    if (!layer.layer_infomation["path_optimize"]) {
      flowUpPathOptimize(true);
    }
    if (!layer.layer_infomation["sharp_angle_removal"]) {
      flowUpSharpAngleRemoval(false);
    }
    if (!layer.layer_infomation["original_data_coordinate_correction"]) {
      flowUpOriginalDataCoordinateCorrection(true);
    }
    if (!layer.layer_infomation["path_optimize_closed_type"]) {
      flowUpPathOptimizeClosedPathType(1);
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

  const flowUpPathJoin = (check: boolean) => {
    console.log("flowUpPathJoin", check);
    layer.updateLayerElement("path_join", check ? "ok" : "no");
    const edit_data = AppContextValue.edit_data;
    edit_data.setLayer(layer);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  const flowUpOriginalDataCoordinateCorrection = (check: boolean) => {
    layer.updateLayerElement("original_data_coordinate_correction", check ? "ok" : "no");
    const edit_data = AppContextValue.edit_data;
    edit_data.setLayer(layer);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  const getCheckedOriginalDataCoordinateCorrection = () => {
    if (!("original_data_coordinate_correction" in layer.layer_infomation)) {
      return false;
    }

    const c = layer.getElement("original_data_coordinate_correction");
    return c == "ok";
  };

  const getCheckedPathJoin = () => {
    if (!("path_join" in layer.layer_infomation)) {
      return false;
    }

    const c = layer.getElement("path_join");
    return c == "ok";
  };

  const flowUpPathOptimize = (check: boolean) => {
    console.log("flowUpPathOptimize", check);
    layer.updateLayerElement("path_optimize", check ? "ok" : "no");
    const edit_data = AppContextValue.edit_data;
    edit_data.setLayer(layer);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  const getCheckedPathOptimize = () => {
    if (!("path_optimize" in layer.layer_infomation)) {
      return false;
    }

    const c = layer.getElement("path_optimize");
    return c == "ok";
  };
  const flowUpPathOptimizeClosedPathType = (index: number) => {
    // const path_optimize_closed_type = getCheckedPathOptimizeClosedPathType()[index];
    layer.updateLayerElement("path_optimize_closed_type", String(index));
    const edit_data = AppContextValue.edit_data;
    edit_data.setLayer(layer);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };
  const getCheckedPathOptimizeClosedPathType = () => {
    return ["なし", "最短経路優先", "最長経路優先"];
  };

  const flowUpSharpAngleRemoval = (check: boolean) => {
    layer.updateLayerElement("sharp_angle_removal", check ? "ok" : "no");
    const edit_data = AppContextValue.edit_data;
    edit_data.setLayer(layer);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };
  const getCheckedSharpAngleRemoval = () => {
    if (!("sharp_angle_removal" in layer.layer_infomation)) {
      return false;
    }

    const c = layer.getElement("sharp_angle_removal");
    return c == "ok";
  };

  return (
    <>
      <SelectBox flowUp={flowUpUnitRailway} view_options={railways} selected={getArrayIndexStr(railways, layer.getElement("railway"))} />
      <SelectBox flowUp={flowUpUnitLine} view_options={getLineViewOptions()} selected={getArrayIndexStr(getLineViewOptions(), layer.getElement("line"))} />
      <CheckBox flowUp={flowUpPathOptimize} label_text={"パスの最適化"} checked={getCheckedPathOptimize()} />
      <CheckBox flowUp={flowUpPathJoin} label_text={"パスの結合"} checked={getCheckedPathJoin()} />
      <CheckBox flowUp={flowUpOriginalDataCoordinateCorrection} label_text={"座標補正"} checked={getCheckedOriginalDataCoordinateCorrection()} />
      <CheckBox flowUp={flowUpSharpAngleRemoval} label_text={"鋭角除去"} checked={getCheckedSharpAngleRemoval()} />
      <PulldownMenu
        flowUp={flowUpPathOptimizeClosedPathType}
        view_options={getCheckedPathOptimizeClosedPathType()}
        selected={Number(typeof layer.getElement("path_optimize_closed_type") == "undefined" ? 0 : Number(layer.getElement("path_optimize_closed_type")))}
        label_text="閉路処理方式"
      />
    </>
  );
};

export default PullRapperRailroadSection;
