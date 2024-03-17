import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";

type CtrlDataFlowContextValue = {};

const CtrlDataFlowContext = createContext<CtrlDataFlowContextValue>({} as CtrlDataFlowContextValue);
export default CtrlDataFlowContext;
