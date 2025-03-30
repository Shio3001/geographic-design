import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";

import PulldownMenu from "../../common/pulldown_menu/pulldown_menu";
import SelectBox from "../../common/selectbox/selectbox";
import Button from "../../common/button/button";

import CtrlLayerPull from "./ctrl_layer_pull";

import { AppContext } from "./../../app_context";
import { CtrlGisContext } from "./../ctrl_gis_context";
import { searchUniqueKey, getArrayIndexNum, getArrayIndexStr } from "./../../gis_scipt/gis_unique_data";

import { getGisInfo, getKeysGisUnitIDs, getNamesGisUnitIDs, getGisUnitIDs } from "./../../gis_scipt/route_setup";
import LayerData from "../ctrl_dataflow/edit_data/layer_data";

type props = {
  layer_uuid: string;
};

const CtrlLayer = (props: props) => {
  const AppContextValue = useContext(AppContext);
  const CtrlGisContextValue = useContext(CtrlGisContext);

  // const flowUpAdd = () => {
  //   const nlayer: LayerData = new LayerData();
  //   const edit_data = AppContextValue.edit_data;
  //   nlayer.setUnit("2022_rail");
  //   edit_data.addLayer(nlayer);
  //   AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  // };
  const flowUpDelete = () => {
    const edit_data = AppContextValue.edit_data;
    edit_data.deleteLayerByUUID(props.layer_uuid);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };
  const flowUpUnitName = (pull_index: number) => {
    const unit_id_c = getKeysGisUnitIDs()[pull_index];
    const edit_data = AppContextValue.edit_data;
    const layer = edit_data.getLayer(props.layer_uuid);
    layer.clearLayerElement();
    layer.setUnit(unit_id_c);
    edit_data.setLayer(layer);
    edit_data.updateUUID(props.layer_uuid);

    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  const flowUpUnitCopy = () => {
    const edit_data = AppContextValue.edit_data;
    edit_data.copyLayer(props.layer_uuid);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  useEffect(() => {}, [AppContextValue.update]);

  return (
    <div className="ctrl_layer">
      <div className="ctrl_layer_pull_down_lateral">
        {/* <Button flowUp={flowUpAdd} text={"下に追加"}></Button> */}
        <Button flowUp={flowUpDelete} text={"削除"}></Button>
        <Button flowUp={flowUpUnitCopy} text={"複製"}></Button>
        <SelectBox
          flowUp={flowUpUnitName}
          view_options={getNamesGisUnitIDs()}
          selected={getArrayIndexStr(getKeysGisUnitIDs(), AppContextValue.edit_data.layers[props.layer_uuid].unit_id)}
        />
        <CtrlLayerPull layer_uuid={props.layer_uuid} />
      </div>
    </div>
  );
};
export default CtrlLayer;
