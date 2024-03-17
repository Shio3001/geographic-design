import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";

import CtrlLayers from "./ctrl_layer/ctrl_layers";
import Preview from "./preview/preview";
// import CtrlDaraFlow from "./ctrl_dataflow/ctrl_dataflow";
import CtrlDaraFlowContext from "./ctrl_dataflow/ctrl_dataflow_context";

const CtrlGis = () => {
  return (
    <>
      <CtrlDaraFlowContext.Provider value={{}}>
        <Preview />
        <CtrlLayers />
      </CtrlDaraFlowContext.Provider>
    </>
  );
};
export default CtrlGis;
