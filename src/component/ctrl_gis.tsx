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
import CheckBox from "./../common/checkbox/checkbox";
import { AppContext } from "./../app_context";

import EditData from "./ctrl_dataflow/edit_data/edit_data";

import Parser from "./../parser/parser";
// import ParserWebWorker from "./../parser/parser_webworker";

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

  const rendering = (file_output: boolean) => {
    const worker = new Worker(new URL("./../parser/parser_webworker.tsx", import.meta.url));
    worker.addEventListener(
      "message",
      (e) => {
        console.log("Workerから受け取ったデータは: ", e.data);
        const svg = e.data;
        setPreview(svg);
        worker.terminate();

        if (file_output) {
          AppContextValue.fileExportText(AppContextValue.edit_data.filename, svg);
        }
      },

      false
    );
    worker.postMessage({ edit_data: AppContextValue.edit_data.getLawData(), gis_info: AppContextValue.gis_info });

    console.log("rendering");

    // const parser: Parser = new Parser(AppContextValue.edit_data, AppContextValue.gis_info);
    // parser.parser();
    // parser.scaling();
    // const svg = parser.toSVG();
    // return svg;
  };

  const flowUpRendering = () => {
    const edit_data = AppContextValue.edit_data;
    if (edit_data.use_thread) {
      rendering(false);
    } else {
      const parser: Parser = new Parser(AppContextValue.edit_data, AppContextValue.gis_info);
      parser.parser();
      parser.scaling();
      const svg = parser.toSVG();
      setPreview(svg);
    }
  };

  const flowUpOutputSVG = () => {
    const edit_data = AppContextValue.edit_data;
    if (edit_data.use_thread) {
      rendering(true);
    } else {
      const parser: Parser = new Parser(AppContextValue.edit_data, AppContextValue.gis_info);
      parser.parser();
      parser.scaling();
      const svg = parser.toSVG();
      setPreview(svg);
      AppContextValue.fileExportText(AppContextValue.edit_data.filename, svg);
    }
    // const svg = rendering();
    // setPreview(svg);
    // AppContextValue.fileExportText(AppContextValue.edit_data.filename, svg);
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

  const flowUpUseThread = (check: boolean) => {
    const edit_data = AppContextValue.edit_data;
    edit_data.use_thread = check;
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  const getCheckedUseThread = () => {
    if (window.Worker) {
      const edit_data = AppContextValue.edit_data;
      return edit_data.use_thread;
    } else {
      return false;
    }
  };

  useEffect(() => {
    const edit_data = AppContextValue.edit_data;
    if (window.Worker) {
      edit_data.use_thread = true;
    } else {
      edit_data.use_thread = false;
    }
  }, []);

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
          <CheckBox flowUp={flowUpUseThread} label_text={"スレッド処理"} checked={getCheckedUseThread()} />
        </div>

        <CtrlLayers />
        <CtrlLayerAdd />

        <h3>使う前に、README 読んでね！</h3>
        <a href="https://github.com/Shio3001/RouteAnimation/blob/main/README.md"> README </a>
        <p>
          スレッド処理 <br />
          ・JavaScript WebWorker を用いて、別スレッドに処理を分離します。 <br />
          ・別スレッドに処理を分離することで、処理中でも、画面が固まらないようになります。 <br />
          ・OFF にすると、JavaScript がシングルスレッドという都合上、描画ボタンを押してから処理が終了するまで、画面が固まったり真っ白になったります。
          <br />
          ・JavaScript WebWorker が利用できる環境でのみ、チェックボックスを ON にできます。（JavaScript WebWorker
          が利用できる環境であれば、初めから、ONになっています）
          <br />
          <br />
          パスの最適化 <br />
          ・パスの最適化を行います。 <br />
          ・本ソフトウェアの存在意義 <br />
          <br />
          パスの結合 <br />
          ・パスをできる限り連結します。 <br />
          ・パスの最適化との併用を推奨します。（パスの最適化を行わない状態でこれを適用すると、計算量が爆発する場合あり）
          <br />
          <br /> 座標補正 <br />
          ・元データに意図せず袋小路が発生しているとき、袋小路を適切な形に処理します。 <br />
          ・座標を変更するため、正確さは失われます。 <br />
          ・すべての袋小路が修正されるわけではありません。用途に合わせて、手動 SVG ファイルを変更するか、Adobe illustrator などで加工を行ってください。 <br />
          <br />
          鋭角除去 <br />
          ・閉路処理方式で「最長経路優先モード」を選択しているときに使用することを推奨します。
          <br />
          ・パスの最適化が適用されているとき、鋭角があるルートを極力避けます。
          <br />
          ・「最長経路優先モード」では、その特性から、閉路処理時に鋭角が発生してしまうことがあり、その対策を行う処理です。 <br />
          ・計算量多め <br />
          <br />
          閉路処理方式 <br />
          ＞最短経路優先 <br />
          ＞・最短経路を取得します。推奨 <br />
          <br />
          ＞最長経路優先 <br />
          ＞・北陸線敦賀ループや、都営地下鉄大江戸線など、閉路（輪になっているところ）をあえて残したいときに使用するモードです
          <br />
          ＞・計算量が多いので、使用は要注意 <br />
          ＞・東北本線に適用すると計算量が多くなりすぎて終わらないことを確認しています
        </p>
        <p>{preview}</p>
      </CtrlGisContext.Provider>
    </div>
  );
};
export default CtrlGis;
