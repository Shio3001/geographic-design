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
import TextBox from "./../common/textbox/textbox";
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

  const rendering = () => {
    const parser: Parser = new Parser(AppContextValue.edit_data, AppContextValue.gis_info);
    parser.parser();
    parser.scaling();
    const svg = parser.toSVG();
    return svg;
  };

  const flowUpRendering = async () => {
    const svg = await rendering();
    setPreview(svg);
    console.log("svg", svg);
  };

  const flowUpOutputSVG = async () => {
    const svg = await rendering();
    setPreview(svg);
    AppContextValue.fileExportText(AppContextValue.edit_data.filename, svg);
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

  const flowUpFileName = (value: string) => {
    const edit_data = AppContextValue.edit_data;
    edit_data.setFileName(value);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  const flowUpDecimalPlace = (value: string) => {
    const edit_data = AppContextValue.edit_data;
    edit_data.decimal_place = Number(value);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  return (
    <div className="ctrl_gis">
      <CtrlGisContext.Provider value={{ updateDOM: updateDOM }}>
        <Preview preview_width={AppContextValue.edit_data.width} preview_height={AppContextValue.edit_data.height} svg_data={preview} />

        <div className="ctrl_gis_options">
          <Button flowUp={flowUpRendering} text={"描画"} />
          <Button flowUp={flowUpOutputSVG} text={"SVG出力"} />
          <TextBox flowUp={flowUpFileName} text={"output_animation"} label_text="svg出力ファイル名" />
          <NumberBox flowUp={flowUpWidth} number={AppContextValue.edit_data.width} label_text="出力サイズ 幅" />
          <NumberBox flowUp={flowUpHeight} number={AppContextValue.edit_data.height} label_text="出力サイズ 高さ" />
          <NumberBox flowUp={flowUpDecimalPlace} number={AppContextValue.edit_data.decimal_place} label_text="精度(少数桁数)" />
        </div>

        <CtrlLayers />
        <CtrlLayerAdd />
        <p>{preview}</p>
      </CtrlGisContext.Provider>
    </div>
  );
};
export default CtrlGis;
