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

const App = () => {
  // const [gis_info, setGisInfo] = useState<TypeGISInfo>(setupGisInfo());
  // const [edit_data, setEditData] = useState<EditData>(new EditData());

  const reducerApp = (state: TypeAppState, action: TypeAppReducerAction) => {
    if (action.action_type == "update") {
      console.log("reducerApp", state, action.update_state);
      action.update_state.update = !action.update_state.update;
      return action.update_state;
    }
    if (action.action_type == "render") {
    }
    state.update = !state.update;
    return state;
  };

  const [app_state, dispatchAppState] = useReducer(reducerApp, {
    gis_info: setupGisInfo(),
    edit_data: new EditData(5),
    update: false,
  });

  useEffect(() => {}, []);

  return (
    <>
      <AppContext.Provider
        value={{
          app_state: app_state,
          dispatchAppState: dispatchAppState,
        }}
      >
        <CtrlGis />
      </AppContext.Provider>
    </>
  );
};

export default App;
