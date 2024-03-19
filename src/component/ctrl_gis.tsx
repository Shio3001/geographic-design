import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";

import CtrlLayers from "./ctrl_layer/ctrl_layers";
import CtrlLayerAdd from "./ctrl_layer/ctrl_layer_add";

import Preview from "./preview/preview";
// import CtrlDaraFlow from "./ctrl_dataflow/ctrl_dataflow";
// import CtrlDaraFlowContext from "./ctrl_dataflow/ctrl_dataflow_context";
import { CtrlGisContext } from "./ctrl_gis_context";

import Button from "./../common/button/button";
import NumberBox from "./../common/numberbox/numberbox";
import { AppContext } from "./../app_context";

import EditData from "./ctrl_dataflow/edit_data/edit_data";

import Parser from "./../parser/parser";

const CtrlGis = () => {
  const [update, setUpdata] = useState<boolean>(false);

  const [preview, setPreview] = useState<string>("<div></div>");

  const AppContextValue = useContext(AppContext);
  const CtrlGisContextValue = useContext(CtrlGisContext);
  const updateDOM = () => {
    //強制再レンダリング関数
    setUpdata(update ? false : true);
  };

  useEffect(() => {
    console.log("[APPCTR] Update");
  }, [update]);

  const flowUpRendering = () => {
    const parser: Parser = new Parser(AppContextValue.edit_data, AppContextValue.gis_info);
    parser.parser();
    parser.scaling();
    const svg = parser.toSVG();
    setPreview(svg);

    console.log("svg", svg);
  };

  const flowUpWidth = (value: number) => {
    const edit_data = AppContextValue.edit_data;
    edit_data.width = value;
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };
  const flowUpHeight = (value: number) => {
    const edit_data = AppContextValue.edit_data;
    edit_data.height = value;
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  return (
    <div className="ctrl_gis">
      <CtrlGisContext.Provider value={{ updateDOM: updateDOM }}>
        <Preview preview_width={AppContextValue.edit_data.width} preview_height={AppContextValue.edit_data.height} svg_data={preview} />
        <Button flowUp={flowUpRendering} text={"描画"} />
        <NumberBox flowUp={flowUpWidth} number={AppContextValue.edit_data.width} />
        <NumberBox flowUp={flowUpHeight} number={AppContextValue.edit_data.height} />
        <CtrlLayers />
        <CtrlLayerAdd />
        <p>{preview}</p>
      </CtrlGisContext.Provider>
    </div>
  );
};
export default CtrlGis;
