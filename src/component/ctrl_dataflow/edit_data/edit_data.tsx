import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";
import { TypeJsonGISRailroadSection, TypeJsonGISStation, TypeGisUnit, TypeGisUnits, TypeGISInfo } from "../../../gis_scipt/route_type";

import LayerData, { getUUID } from "./layer_data";

class EditData {
  layers: { [name: string]: LayerData };
  layers_order: Array<string>;
  layer_length: number;
  width: number;
  height: number;
  decimal_place: number;
  filename: string;
  use_thread: boolean;

  getLawData = () => {
    const gld = () => {
      const rv: { [name: string]: LayerData } = {};
      for (let l_key of Object.keys(this.layers)) {
        rv[l_key] = this.layers[l_key].getLawData() as LayerData;
      }
      return rv;
    };
    return {
      layers: gld(),
      layers_order: this.layers_order,
      layer_length: this.layer_length,
      width: this.width,
      height: this.height,
      decimal_place: this.decimal_place,
      filename: this.filename,
      use_thread: this.use_thread,
    };
  };

  constructor(layer_number?: number) {
    this.layer_length = 0;
    this.layers_order = [];
    this.layers = {};
    this.width = 1000;
    this.height = 1000;
    this.decimal_place = 3;
    this.filename = "animation";
    this.use_thread = true;
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

  copyLayer = (layer_uuid: string) => {
    const layer = this.layers[layer_uuid];
    const new_layer = layer.deepCopyLayer();
    this.layers[new_layer.layer_uuid] = new_layer;
    this.layers_order.push(new_layer.layer_uuid);
    this.layer_length++;
    console.log(this);
  };

  updateUUID = (layer_uuid: string) => {
    const layer = this.layers[layer_uuid];
    const new_uuid = layer.updateUUID();

    // 挿入位置は維持する（つまり、layers_orderを変更する）

    // 現在のuuidを見つけたらそれを置き換える
    const index = this.layers_order.indexOf(layer_uuid);
    if (index !== -1) {
      this.layers_order[index] = new_uuid;
    }

    // keyを置き換える
    this.layers[new_uuid] = layer;
    delete this.layers[layer_uuid];
  };

  deleteLayerByUUID = (uuid: string) => {
    const new_layers_order = this.layers_order.filter((n) => n !== uuid);

    const f = delete this.layers[uuid];
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

  clearLayer = () => {
    this.layers = {};
    this.layers_order = [];
    this.layer_length = 0;
  };

  getLayer = (uuid: string) => {
    return this.layers[uuid];
  };
}

export default EditData;
