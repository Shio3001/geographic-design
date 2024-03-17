import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";
import { TypeJsonGISRailroadSection, TypeJsonGISStation, TypeGisUnit, TypeGISInfo } from "./gis_scipt/route_type";

import { setupGisInfo } from "./gis_scipt/route_setup";
import CtrlGis from "./component/ctrl_gis";
// import "./gis_scipt/gis_unique_data";

// import PulldownMenu from "./common/PulldownMenu/PulldownMenu";
import CtrlBlock from "./component/ctrl_layer/ctrl_layer";

type AppContextValue = {
  gis_info: TypeGISInfo;

  updateDOM: Function;
};

export const AppContext = createContext<AppContextValue>({} as AppContextValue);

const App = () => {
  const [update, setUpdata] = useState<boolean>(false);
  const [gis_info, setGisInfo] = useState<TypeGISInfo>();

  const updateDOM = () => {
    //強制再レンダリング関数
    setUpdata(update ? false : true);
  };

  useEffect(() => {
    console.log("[APP---] Update");
  }, [update]);

  useEffect(() => {
    setGisInfo(setupGisInfo());
  }, []);

  return (
    <>
      <AppContext.Provider
        value={{
          updateDOM: updateDOM,
          gis_info: gis_info,
        }}
      >
        <CtrlGis />
      </AppContext.Provider>
    </>
  );
};

export default App;
