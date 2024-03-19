import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";
import { TypeJsonGISRailroadSection, TypeJsonGISStation, TypeGisUnit, TypeGisUnits, TypeGISInfo } from "../../../gis_scipt/route_type";

import LayerData from "./layer_data";

class EditData {
  layers: { [name: string]: LayerData };
  layers_order: Array<string>;
  layer_length: number;

  width: number;
  height: number;

  filename: string;

  constructor(layer_number?: number) {
    this.layer_length = 0;
    this.layers_order = [];
    this.layers = {};
    this.width = 1000;
    this.height = 1000;
    this.filename = "animation";
    if (!layer_number) {
      layer_number = 0;
    }

    for (let i = 0; i < layer_number; i++) {
      const layer_d: LayerData = new LayerData();
      layer_d.setUnit("2022_rail");
      this.layers_order.push(layer_d.layer_uuid);
      this.layers[layer_d.layer_uuid] = layer_d;
    }
  }

  deleteLayerByUUID = (uuid: string) => {
    const new_layers_order = this.layers_order.filter((n) => n !== uuid);
    delete this.layers[uuid];
    this.layers_order = new_layers_order;
  };

  setFileName = (filename: string) => {
    this.filename = filename;
  };

  setLayer = (layer: LayerData) => {
    this.layers[layer.layer_uuid] = layer;
    console.log(this);
  };
  addLayer = (layer: LayerData) => {
    this.layers[layer.layer_uuid] = layer;
    this.layers_order.push(layer.layer_uuid);
    console.log(this);
  };

  getLayer = (uuid: string) => {
    return this.layers[uuid];
  };
}

export default EditData;
