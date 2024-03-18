import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";
import { TypeJsonGISRailroadSection, TypeJsonGISStation, TypeGisUnit, TypeGisUnits, TypeGISInfo } from "../../../gis_scipt/route_type";

import { UUID } from "uuidjs";

const getUUID = () => {
  return String(UUID.generate());
};

class LayerData {
  // unit_type: string;
  unit_id: string;

  layer_uuid: string;
  layer_infomation: { [key: string]: string };

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

  setKeys = (keys: Array<string>) => {
    for (let i = 0; i < keys.length; i++) {
      this.layer_infomation[keys[i]] = "";
    }
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
}

export default LayerData;
