import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";
import PulldownMenu from "../../common/PulldownMenu/pulldown_menu";

import { getKeysGisUnitIDs, getNamesGisUnitIDs, getGisUnitIDs } from "./../../gis_scipt/route_setup";
import {
  searchUniqueKey,
  getArrayIndexNum,
  getArrayIndexStr,
  searchUniqueIndex,
  logicalAnd,
  searchUniquePropertie,
  searchUniqueKeyBySearchKey,
} from "./../../gis_scipt/gis_unique_data";

import { AppContext } from "./../../app_context";
import LayerData from "../ctrl_dataflow/edit_data/layer_data";

type PullRapper = { layer_uuid: string };

const PullRapperUnnecessary = (props: PullRapper) => {
  return <></>;
};

const PullRapperRailroadSection = (props: PullRapper) => {
  const AppContextValue = useContext(AppContext);
  const layer = AppContextValue.edit_data.getLayer(props.layer_uuid);

  const [railway, setRailway] = useState(layer.getElement("railway"));
  const [line, setLine] = useState(layer.getElement("line"));

  const railways = searchUniqueKey(layer.unit_id, "N02_004");
  const lines = searchUniqueKey(layer.unit_id, "N02_003");

  useEffect(() => {
    const layer_railway = layer.getElement("railway");
    const layer_line = layer.getElement("line");
    setRailway(layer_railway);
    setLine(layer_line);
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
    setRailway(layer_railway);
    layer.updateLayerElement("railway", layer_railway);
    const edit_data = AppContextValue.edit_data;
    edit_data.setLayer(layer);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  const flowUpUnitLine = (index: number) => {
    const layer_line = lines[index];
    setRailway(layer_line);
    layer.updateLayerElement("line", layer_line);
    const edit_data = AppContextValue.edit_data;
    edit_data.setLayer(layer);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  const getLineViewOptions = () => {
    const unit_id = layer.getUnitId();
    const view_lines = searchUniqueKeyBySearchKey(unit_id, "N02_004", layer.layer_infomation["railway"], "N02_003");

    return view_lines;
  };

  return (
    <>
      <PulldownMenu flowUp={flowUpUnitRailway} view_options={railways} selected={getArrayIndexStr(railways, railway)} />
      <PulldownMenu flowUp={flowUpUnitLine} view_options={getLineViewOptions()} selected={getArrayIndexStr(lines, line)} />
    </>
  );
};

const PullRapperStation = (props: PullRapper) => {
  const AppContextValue = useContext(AppContext);
  const layer = AppContextValue.edit_data.getLayer(props.layer_uuid);

  const [railway, setRailway] = useState(layer.getElement("railway"));
  const [line, setLine] = useState(layer.getElement("line"));

  const railways = searchUniqueKey(layer.unit_id, "N02_004");
  const lines = searchUniqueKey(layer.unit_id, "N02_003");

  useEffect(() => {
    const layer_railway = layer.getElement("railway");
    const layer_line = layer.getElement("line");
    setRailway(layer_railway);
    setLine(layer_line);
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
    setRailway(layer_railway);
    layer.updateLayerElement("railway", layer_railway);
  };

  const flowUpUnitLine = (index: number) => {
    const layer_line = lines[index];
    setRailway(layer_line);
    layer.updateLayerElement("line", layer_line);
  };
  const getLineViewOptions = () => {
    const unit_id = layer.getUnitId();
    const view_lines = searchUniqueKeyBySearchKey(unit_id, "N02_004", layer.layer_infomation["railway"], "N02_003");

    return view_lines;
  };
  return (
    <>
      <PulldownMenu flowUp={flowUpUnitRailway} view_options={railways} selected={getArrayIndexStr(railways, railway)} />
      <PulldownMenu flowUp={flowUpUnitLine} view_options={getLineViewOptions()} selected={getArrayIndexStr(lines, line)} />
    </>
  );
};

type propsCtrlLayerPull = {
  layer_uuid: string;
};
const CtrlLayerPull = (props: propsCtrlLayerPull) => {
  const AppContextValue = useContext(AppContext);
  const layer = AppContextValue.edit_data.getLayer(props.layer_uuid);

  const unit_id = layer.unit_id;

  const unit_type = AppContextValue.gis_info.id_type[unit_id];

  switch (unit_type) {
    case "RailroadSection": {
      return (
        <>
          <PullRapperRailroadSection layer_uuid={props.layer_uuid} />
        </>
      );
    }
    case "Station": {
      return (
        <>
          <PullRapperStation layer_uuid={props.layer_uuid} />
        </>
      );
    }
    default:
      return <></>;
  }
};
export default CtrlLayerPull;
