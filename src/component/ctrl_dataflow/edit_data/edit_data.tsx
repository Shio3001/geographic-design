import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";
import { TypeJsonGISRailroadSection, TypeJsonGISStation, TypeGisUnit, TypeGisUnits, TypeGISInfo } from "../../../gis_scipt/route_type";

class EditData {
  units: TypeGisUnits;
  constructor(units: TypeGisUnits) {
    this.units = units;
  }
}

export default EditData;
