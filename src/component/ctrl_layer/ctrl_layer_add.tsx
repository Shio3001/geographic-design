import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import PulldownMenu from "../../common/pulldown_menu/pulldown_menu";
import Button from "../../common/button/button";

import CtrlLayer from "./ctrl_layer";
import { AppContext } from "./../../app_context";
import { CtrlGisContext } from "./../ctrl_gis_context";
import { searchUniqueKey, getArrayIndexNum, getArrayIndexStr, searchUniqueKeyBySearchKey } from "./../../gis_scipt/gis_unique_data";
import { getGisInfo, getKeysGisUnitIDs, getNamesGisUnitIDs, getGisUnitIDs } from "./../../gis_scipt/route_setup";
import LayerData from "../ctrl_dataflow/edit_data/layer_data";

type TypeCtrlLayerAdd = {
  unit_id_index: number;
  classification1: number;
};

type TypeActionCtrlLayerAdd = {
  action_type: string;
  action_data: number;
};

const CtrlLayerAdd = () => {
  const AppContextValue = useContext(AppContext);
  const CtrlGisContextValue = useContext(CtrlGisContext);

  const renaderLayerAdd = (state: TypeCtrlLayerAdd, action: TypeActionCtrlLayerAdd): TypeCtrlLayerAdd => {
    if (action.action_type == "unit_id") {
      return { unit_id_index: action.action_data, classification1: state.classification1 };
    }
    if (action.action_type == "classification1") {
      return { unit_id_index: state.unit_id_index, classification1: action.action_data };
    }
    return state;
  };

  const [ctrl_layer_add, dispatchCtrlLayerAdd] = useReducer(renaderLayerAdd, {
    unit_id_index: 0,
    classification1: 0,
  });

  const getViewOptions1 = () => {
    return getNamesGisUnitIDs();
  };

  const getViewOptions2 = () => {
    const unit_id = getKeysGisUnitIDs()[ctrl_layer_add.unit_id_index];
    const unit_type = AppContextValue.gis_info.id_type[unit_id];

    switch (unit_type) {
      case "RailroadSection": {
        return searchUniqueKey(unit_id, "N02_004");
      }
      case "Station": {
        return searchUniqueKey(unit_id, "N02_004");
      }
      // case "Coast": {
      //   return searchUniqueKey(unit_id, "pref");
      // }
      default:
        return [];
    }
  };

  const flowUpAdd = () => {
    const unit_id = getKeysGisUnitIDs()[ctrl_layer_add.unit_id_index];
    const unit_type = AppContextValue.gis_info.id_type[unit_id];

    switch (unit_type) {
      case "RailroadSection": {
        const railway = searchUniqueKey(unit_id, "N02_004")[ctrl_layer_add.classification1];
        const lines = searchUniqueKeyBySearchKey(unit_id, "N02_004", railway, "N02_003");

        const edit_data = AppContextValue.edit_data;
        for (let i in lines) {
          const line = lines[i];
          const nlayer: LayerData = new LayerData();
          nlayer.setUnit(getKeysGisUnitIDs()[ctrl_layer_add.unit_id_index]);
          nlayer.updateLayerElement("railway", railway);
          nlayer.updateLayerElement("line", line);
          edit_data.addLayer(nlayer);
        }

        AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
        return;
      }
      case "Station": {
        const railway = searchUniqueKey(unit_id, "N02_004")[ctrl_layer_add.classification1];
        const lines = searchUniqueKeyBySearchKey(unit_id, "N02_004", railway, "N02_003");
        const edit_data = AppContextValue.edit_data;
        console.log("flowUpAdd", railway, lines);

        for (let i in lines) {
          const line = lines[i];
          const nlayer: LayerData = new LayerData();
          nlayer.setUnit(getKeysGisUnitIDs()[ctrl_layer_add.unit_id_index]);
          nlayer.updateLayerElement("railway", railway);
          nlayer.updateLayerElement("line", line);
          edit_data.addLayer(nlayer);
        }
        console.log("flowUpAdd--", edit_data);

        AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
        return;
      }

      case "Coast": {
        const prefs = searchUniqueKey(unit_id, "pref");
        const edit_data = AppContextValue.edit_data;

        for (let i in prefs) {
          const pref = prefs[i];
          const nlayer: LayerData = new LayerData();
          nlayer.setUnit(getKeysGisUnitIDs()[ctrl_layer_add.unit_id_index]);
          nlayer.updateLayerElement("pref", pref);
          nlayer.updateLayerElement("threshold", "1000");
          nlayer.updateLayerElement("thinoout", "10");
          edit_data.addLayer(nlayer);
        }

        AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
        return;
      }
      case "Lake": {
        const lakes = searchUniqueKey(unit_id, "lake");
        const edit_data = AppContextValue.edit_data;

        for (let i in lakes) {
          const lake = lakes[i];
          const nlayer: LayerData = new LayerData();
          nlayer.setUnit(getKeysGisUnitIDs()[ctrl_layer_add.unit_id_index]);
          nlayer.updateLayerElement("lake", lake);
          nlayer.updateLayerElement("threshold", "0");
          nlayer.updateLayerElement("thinoout", "10");
          edit_data.addLayer(nlayer);
        }

        AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
        return;
      }

      default:
        return;
    }
  };

  const flowUp0 = (index: number) => {
    dispatchCtrlLayerAdd({ action_type: "unit_id", action_data: index });
    dispatchCtrlLayerAdd({ action_type: "classification1", action_data: 0 });
  };

  const flowUp1 = (index: number) => {
    dispatchCtrlLayerAdd({ action_type: "classification1", action_data: index });
  };

  return (
    <div className="ctrl_layer_add">
      <Button flowUp={flowUpAdd} text={"一括追加"}></Button>
      <PulldownMenu flowUp={flowUp0} view_options={getViewOptions1()} selected={ctrl_layer_add.unit_id_index} />
      {getViewOptions2().length == 0 ? <></> : <PulldownMenu flowUp={flowUp1} view_options={getViewOptions2()} selected={ctrl_layer_add.classification1} />}
    </div>
  );
};
export default CtrlLayerAdd;
