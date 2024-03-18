import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;

import CtrlLayer from "./ctrl_layer";
import { AppContext } from "./../../app_context";
import { CtrlGisContext } from "./../ctrl_gis_context";

const Ctest = () => {
  return <div className="test-C"></div>;
};

const CtrlLayers = () => {
  const AppContextValue = useContext(AppContext);
  const CtrlGisContextValue = useContext(CtrlGisContext);

  useEffect(() => {
    console.log("ctrl", AppContextValue.edit_data.layers_order);
  }, [AppContextValue.update]);

  const layers_order = AppContextValue.edit_data.layers_order;

  console.log("layers_order", layers_order);

  const buildComponent = () => {
    // const layers_order = AppContextValue.app_state.edit_data.layers_order;
    console.log("layers_order", layers_order);

    const component = [];

    for (let i = 0; i < layers_order.length; i++) {
      component.push(<CtrlLayer key={i} layer_uuid={layers_order[i]} />);
    }

    return component;
  };

  return (
    <div className="ctrl_layers">{buildComponent()}</div>

    // <div className="ctrl_layers">
    //   <>
    //     {AppContextValue.app_state.edit_data.layers_order.map((layer_uuid, index) => {
    //       //   <CtrlLayer key={index} layer_uuid={layer_uuid} />;
    //       <div className="test"></div>;
    //     })}
    //   </>
    // </div>
  );
};
export default CtrlLayers;
