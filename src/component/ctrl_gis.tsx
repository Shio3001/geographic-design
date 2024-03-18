import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";

import CtrlLayers from "./ctrl_layer/ctrl_layers";
import Preview from "./preview/preview";
// import CtrlDaraFlow from "./ctrl_dataflow/ctrl_dataflow";
// import CtrlDaraFlowContext from "./ctrl_dataflow/ctrl_dataflow_context";
import { CtrlGisContext } from "./ctrl_gis_context";

import Button from "./../common/button/button";
import { AppContext } from "./../app_context";

import EditData from "./ctrl_dataflow/edit_data/edit_data";

const CtrlGis = () => {
  const [update, setUpdata] = useState<boolean>(false);
  const AppContextValue = useContext(AppContext);
  const CtrlGisContextValue = useContext(CtrlGisContext);
  const updateDOM = () => {
    //強制再レンダリング関数
    setUpdata(update ? false : true);
  };

  useEffect(() => {
    console.log("[APPCTR] Update");
  }, [update]);

  const flowUp = () => {};

  return (
    <div className="ctrl_gis">
      <CtrlGisContext.Provider value={{ updateDOM: updateDOM }}>
        <Preview />
        <CtrlLayers />
      </CtrlGisContext.Provider>
    </div>
  );
};
export default CtrlGis;
