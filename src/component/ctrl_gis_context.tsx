import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;

import EditData from "./ctrl_dataflow/edit_data/edit_data";

type CtrlGisContextValue = {
  updateDOM: Function;
};

export const CtrlGisContext = createContext<CtrlGisContextValue>({} as CtrlGisContextValue);
