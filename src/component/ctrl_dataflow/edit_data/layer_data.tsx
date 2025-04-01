import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";
import { TypeJsonGISRailroadSection, TypeJsonGISStation, TypeGisUnit, TypeGisUnits, TypeGISInfo } from "../../../gis_scipt/route_type";

import { UUID } from "uuidjs";

export const getUUID = () => {
  return String(UUID.generate());
};

class LayerData {
  // unit_type: string;
  unit_id: string;
  layer_uuid: string;
  layer_infomation: { [key: string]: string };

  getLawData = () => {
    return {
      unit_id: this.unit_id,
      layer_uuid: this.layer_uuid,
      layer_infomation: this.layer_infomation,
    };
  };

  constructor() {
    // this.unit_type = "";
    this.unit_id = "";
    this.layer_uuid = getUUID();
    this.layer_infomation = {};
  }

  setUnit = (unit_id: string) => {
    this.unit_id = unit_id;
  };

  updateLayerInfomation = (layer_infomation: { [key: string]: string }) => {
    this.layer_infomation = layer_infomation;
  };
  updateLayerElement = (key: string, value: string) => {
    this.layer_infomation[key] = value;
  };
  clearLayerElement = () => {
    this.layer_infomation = {};
  };
  updateUUID = () => {
    this.layer_uuid = getUUID();
    return this.layer_uuid;
  };

  setKeys = (keys: Array<string>) => {
    for (let i = 0; i < keys.length; i++) {
      this.layer_infomation[keys[i]] = "";
    }
  };

  deepCopyLayer = () => {
    const layer = new LayerData();
    layer.layer_infomation = this.deepCopyLayerInfomation();
    layer.unit_id = this.unit_id;
    return layer;
  };

  // getUnitType = () => {
  //   return this.unit_type;
  // };
  getUnitId = () => {
    return this.unit_id;
  };
  getElement = (key: string) => {
    return this.layer_infomation[key];
  };

  deepCopyLayerInfomation = () => {
    // layer_infomationだけdeepcopy
    // newlayerはしない

    return structuredClone(this.layer_infomation);
  };
}

export default LayerData;
