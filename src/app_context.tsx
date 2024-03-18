import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";
import { TypeJsonGISRailroadSection, TypeJsonGISStation, TypeGisUnit, TypeGISInfo } from "./gis_scipt/route_type";

import EditData from "./component/ctrl_dataflow/edit_data/edit_data";

export type AppContextValue = {
  gis_info: TypeGISInfo;
  edit_data: EditData;
  update: boolean;
  dispatchAppState: Function;
};

export type TypeAppState = {
  gis_info: TypeGISInfo;
  edit_data: EditData;
  update: boolean;
};

export type TypeAppReducerAction = {
  action_type: string;
  update_state?: TypeGISInfo | EditData | boolean;
};

export const AppContext = createContext<AppContextValue>({} as AppContextValue);
