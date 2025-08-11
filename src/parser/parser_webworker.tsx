import ParserController from "./parser_controller";
import { TypePostMessage, TypePostMessageLayerOrderStatus, TypeFunctionUpdateLayerProgress } from "./parser_webworker_type";

import EditData from "./../component/ctrl_dataflow/edit_data/edit_data";

import { TypeGISInfo } from "./../gis_scipt/route_type";
self.addEventListener(
  "message",
  async (e: {
    data: {
      edit_data: EditData;
      gis_info: TypeGISInfo;
      mode: "all" | "layer";
    };
  }) => {
    console.log("webworker");
    const edit_data = e.data.edit_data as EditData;

    const layer_order = edit_data.layers_order;

    // layerid : statusのあらかじめ全IDで初期化 , 待機中にする
    const layer_order_status: TypePostMessageLayerOrderStatus = layer_order.reduce((acc, layer) => {
      acc[layer] = { status: "待機中", count: 0 }; // ノード数は初期化時は0
      return acc;
    }, {} as TypePostMessageLayerOrderStatus);

    const postUpdateLayerProgress = (layer: string, status: string, message?: string, count?: number) => {
      //TypePostMessageLayerOrderStatus の型に合わせて更新
      //TypePostMessageLayerOrderStatusのstatusのところをasで指定
      layer_order_status[layer] = {
        status: status as TypePostMessageLayerOrderStatus[string]["status"],
        count: count || layer_order_status[layer].count,
        message: message || layer_order_status[layer].message,
      };
      console.log("postUpdateLayerProgress", layer_order_status);

      // 更新する
      self.postMessage({
        type: "progress",
        layer_order_status: layer_order_status,
        main_status: "レイヤー処理中",
      } as TypePostMessage);
    };

    const updateLayerRunningCount: TypeFunctionUpdateLayerProgress = (layer: string) => {
      postUpdateLayerProgress(layer, "実行中", undefined, layer_order_status[layer].count + 1);
    };

    const updateLayerRunning: TypeFunctionUpdateLayerProgress = (layer: string) => {
      postUpdateLayerProgress(layer, "実行中");
    };

    const updateLayerComplete: TypeFunctionUpdateLayerProgress = (layer: string) => {
      postUpdateLayerProgress(layer, "完了");
    };

    // 取得中に変更する
    const updateLayerGetting: TypeFunctionUpdateLayerProgress = (layer: string) => {
      postUpdateLayerProgress(layer, "取得中");
    };

    const updateLayerError: TypeFunctionUpdateLayerProgress = (layer: string, message?: string) => {
      layer_order_status[layer] = { status: "実行失敗", count: layer_order_status[layer].count || 0, message: message };
      postUpdateLayerProgress(layer, "実行失敗", message);
    };

    self.postMessage({
      type: "progress",
      layer_order_status: layer_order_status,
      main_status: "レイヤー処理中",
    } as TypePostMessage);

    const parser: ParserController = new ParserController(
      e.data.edit_data,
      e.data.gis_info,
      updateLayerRunning,
      updateLayerRunningCount,
      updateLayerGetting,
      updateLayerComplete,
      updateLayerError
    );
    await parser.parser();

    self.postMessage({
      type: "progress",
      layer_order_status: layer_order_status,
      main_status: "SVG変換中",
    } as TypePostMessage);
    parser.scaling();

    // allと同等の内容を小出しに行う
    if (e.data.mode === "layer") {
      const layer_svgs: Array<{ layer_name: string; svg: string }> = [];
      for (const layer of layer_order) {
        const svg = parser.toSVGLayer(layer);
        if (svg) {
          console.log("toSVGLayer", layer, parser.getLayerName(layer));
          layer_svgs.push({ layer_name: parser.getLayerName(layer), svg });
          // self.postMessage({ type: "complete_layer", svg, layer_name: parser.getLayerName(layer) } as TypePostMessage);
        } else {
          console.warn("toSVGLayer returned empty for layer:", layer);
        }
      }

      self.postMessage({
        type: "progress",
        layer_order_status: layer_order_status,
        main_status: "編集中",
      } as TypePostMessage);

      self.postMessage({
        type: "complete_layer",
        svgs: layer_svgs,
      } as TypePostMessage);

      return;
    }

    const svg = parser.toSVG();

    self.postMessage({
      type: "progress",
      layer_order_status: layer_order_status,
      main_status: "編集中",
    } as TypePostMessage);

    self.postMessage({ type: "complete", svg });
  },
  false
);
// export default url;
