import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";

import PulldownMenu from "../../common/pulldown_menu/pulldown_menu";
import SelectBox from "../../common/selectbox/selectbox";
import Button from "../../common/button/button";

import CtrlLayerPull from "./ctrl_layer_pull";

import { AppContext } from "./../../app_context";
import { CtrlGisContext } from "./../ctrl_gis_context";
import { searchUniqueKey, getArrayIndexNum, getArrayIndexStr } from "./../../gis_scipt/gis_unique_data";

import { getGisInfo, getKeysGisUnitIDs, getNamesGisUnitIDs, getGisUnitIDs } from "./../../gis_scipt/route_setup";

//parser_webworker_type
import { TypePostMessageLayerOrderStatus, TypePostMessageMainStatus } from "../../parser/parser_webworker_type";

type props = {
  layer_uuid: string;
  // progress_status : TypePostMessageLayerOrderStatus[string];
  layer_status: TypePostMessageLayerOrderStatus[string];

  main_status: TypePostMessageMainStatus;
};

const CtrlLayerStatus = (props: { layer_status?: TypePostMessageLayerOrderStatus[string] }) => {
  const backgroundColor = (() => {
    switch (props.layer_status.status) {
      case "待機中":
        return "#f0f0f0"; // グレー
      case "実行中":
        return "#ffcc00"; // 黄色
      case "取得中":
        return "#00ccff"; // 青色
      case "完了":
        return "#00cc00"; // 緑色
      case "実行失敗":
        return "#e61f1fff"; // 赤色
      default:
        return "#f0f0f0"; // デフォルトはグレー
    }
  })();

  // レイヤーの進捗状況を表示
  return (
    <div
      className="ctrl_layer_status"
      style={{
        // Buttonのデザインに合わせる
        backgroundColor: backgroundColor,

        // 上下左右中央
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        borderRadius: "6px",
        padding: "4px",
        margin: "2px",
        width: "100%",
      }}
    >
      {props.layer_status?.status} {/* デフォルトは「待機中」 */}
    </div>
  );
};

const CtrlLayer = (props: props) => {
  const AppContextValue = useContext(AppContext);
  const CtrlGisContextValue = useContext(CtrlGisContext);

  // const flowUpAdd = () => {
  //   const nlayer: LayerData = new LayerData();
  //   const edit_data = AppContextValue.edit_data;
  //   nlayer.setUnit("2022_rail");
  //   edit_data.addLayer(nlayer);
  //   AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  // };
  const flowUpDelete = () => {
    const edit_data = AppContextValue.edit_data;
    edit_data.deleteLayerByUUID(props.layer_uuid);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };
  const flowUpUnitName = (pull_index: number) => {
    const unit_id_c = getKeysGisUnitIDs()[pull_index];
    const edit_data = AppContextValue.edit_data;
    const layer = edit_data.getLayer(props.layer_uuid);
    layer.clearLayerElement();
    layer.setUnit(unit_id_c);
    edit_data.setLayer(layer);
    edit_data.updateUUID(props.layer_uuid);

    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  const flowUpUnitCopy = () => {
    const edit_data = AppContextValue.edit_data;
    edit_data.copyLayer(props.layer_uuid);
    AppContextValue.dispatchAppState({ action_type: "update_edit_data", update_state: edit_data });
  };

  useEffect(() => {}, [AppContextValue.update]);

  return (
    <div
      className="ctrl_layer"
      style={{
        padding: "4px",
        margin: "2px",
        minHeight: "36px",
      }}
    >
      <div className="ctrl_layer_pull_down_lateral">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
          }}
        >
          {/* <Button flowUp={flowUpAdd} text={"下に追加"}></Button> */}
          <div
            style={{
              width: "128px",
              height: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "start",
              justifyContent: "space-between",
              marginLeft: "8px",
              marginRight: "8px",
            }}
          >
            {(() => {
              if (props.layer_status && props.layer_status.status && props.main_status !== "編集中") {
                return <CtrlLayerStatus layer_status={props.layer_status} />;
              } else
                return (
                  <>
                    <Button flowUp={flowUpDelete} text={"削除"}></Button>
                    <Button flowUp={flowUpUnitCopy} text={"複製"}></Button>
                  </>
                );
            })()}
          </div>

          {/* // 子要素が入りきらない場合は折り返す
              // justifyContent: "flex-end",
              // flexWrap: "wrap",

              // 子要素が入りきる場合は
              // justifyContent: "space-between", */}

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <SelectBox
              flowUp={flowUpUnitName}
              view_options={getNamesGisUnitIDs()}
              selected={getArrayIndexStr(getKeysGisUnitIDs(), AppContextValue.edit_data.layers[props.layer_uuid].unit_id)}
            />
            <CtrlLayerPull layer_uuid={props.layer_uuid} />
          </div>
        </div>
        <div>
          {
            // レイヤーの進捗状況を表示
            props.layer_status && props.layer_status.message ? (
              <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "center" }}>
                <div style={{}}>
                  {props.layer_status.status === "実行失敗" ? (
                    <span
                      style={{
                        backgroundColor: "#e61f1fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        borderRadius: "6px",
                        padding: "4px",
                        margin: "2px",
                        fontSize: "14px",
                        minWidth: "60px",
                      }}
                    >
                      エラー
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
                <p>
                  <label>
                    {/* クリップボードにコピーするボタン */}
                    <button
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "#007bff",
                        textDecoration: "underline",
                        marginRight: "4px",
                        fontSize: "14px",
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(props.layer_status.message);
                      }}
                    >
                      クリップボードにコピー
                    </button>
                  </label>
                  {props.layer_status.message}
                </p>
              </div>
            ) : (
              <></>
            )
          }
        </div>
      </div>
    </div>
  );
};
export default CtrlLayer;
