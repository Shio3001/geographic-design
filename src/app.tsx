import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";
import { TypeJsonGISRailroadSection, TypeJsonGISStation, TypeGisUnit, TypeGISInfo } from "./gis_scipt/route_type";

import { setupGisInfo } from "./gis_scipt/route_setup";
import CtrlGis from "./component/ctrl_gis";
// import "./gis_scipt/gis_unique_data";

// import PulldownMenu from "./common/PulldownMenu/PulldownMenu";
import CtrlBlock from "./component/ctrl_layer/ctrl_layer";
import EditData from "./component/ctrl_dataflow/edit_data/edit_data";
import { AppContext, TypeAppState, TypeAppReducerAction } from "./app_context";
import LayerData from "./component/ctrl_dataflow/edit_data/layer_data";
import "./component/style/ctrl_gis.css";

const App = () => {
  // const [gis_info, setGisInfo] = useState<TypeGISInfo>(setupGisInfo());
  // const [edit_data, setEditData] = useState<EditData>(new EditData());

  const reducerApp = (state: TypeAppState, action: TypeAppReducerAction) => {
    if (action.action_type == "update_gis_info") {
      console.log("reducerApp [update_gis_info]:", action.update_state, state.edit_data, state.update);
      return { gis_info: action.update_state, edit_data: state.edit_data, update: state.update };
    }
    if (action.action_type == "update_edit_data") {
      console.log("reducerApp [update_edit_data]:", state.gis_info, action.update_state, state.update);
      return { gis_info: state.gis_info, edit_data: action.update_state, update: state.update };
    }
    if (action.action_type == "update_flag") {
      console.log("reducerApp [update_flag]:", state.gis_info, state.gis_info, !state.update);
      return { gis_info: state.gis_info, edit_data: state.gis_info, update: !state.update };
    }
    return state;
  };

  const [app_state, dispatchAppState] = useReducer(reducerApp, {
    gis_info: setupGisInfo(),
    edit_data: new EditData(1),
    update: false,
  });

  const fileExportCommon = (jsonData: any, fileName: string, typeText: string, extension: string) => {
    //typeについてhttps://asahi-net.jp/support/guide/homepage/0017.html
    const blob = new Blob([jsonData], { type: typeText });
    const aTag = document.createElement("a");
    aTag.href = URL.createObjectURL(blob);
    aTag.target = "_blank";
    aTag.download = fileName + "." + extension;
    aTag.click();
    URL.revokeObjectURL(aTag.href);
  };

  const fileExportText = (filename: string, text: string) => {
    fileExportCommon(text, filename, "text/svg", "svg");
  };

  // const fileExportDataCentral = () => {
  //   const jsonDataCentral = JSON.stringify(this.DataCentral, null, "\t");
  //   fileExportCommon(jsonDataCentral, "animation.svg", "application/json", "json");
  // };

  return (
    <>
      <AppContext.Provider
        value={{
          gis_info: app_state.gis_info as TypeGISInfo,
          edit_data: app_state.edit_data as EditData,
          update: app_state.update as boolean,
          dispatchAppState: dispatchAppState,
          fileExportText: fileExportText,
        }}
      >
        <CtrlGis />
      </AppContext.Provider>
    </>
  );
};

export default App;
