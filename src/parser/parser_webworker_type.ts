export type TypePostMessage =
  | { type: "complete"; svg: string }
  | {
      type: "progress";
      layer_order_status: TypePostMessageLayerOrderStatus;
      main_status: TypePostMessageMainStatus;
    };

export type TypePostMessageLayerOrderStatus = Record<
  string,
  {
    status: "待機中" | "取得中" | "実行中" | "完了";
    count: number; // ノード数
  }
>;
export type TypePostMessageMainStatus = "レイヤー処理中" | "SVG変換中" | "完了";

//   updateLayerRunning: (layer: string, count: number) => void;
//   updateLayerGetting: (layer: string) => void;
//   updateLayerComplete: (layer: string) => void;

export type TypeFunctionUpdateLayerProgress = (layer: string, count?: number) => void;
