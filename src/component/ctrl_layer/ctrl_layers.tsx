import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;

import CtrlLayer from "./ctrl_layer";
import { AppContext } from "./../../app_context";
import { CtrlGisContext } from "./../ctrl_gis_context";

//parser_webworker_type
import { TypePostMessageLayerOrderStatus } from "../../parser/parser_webworker_type";

type Props = {
  layers_progress_status?: TypePostMessageLayerOrderStatus;
};

const CtrlLayers = (props: Props) => {
  const AppContextValue = useContext(AppContext);
  const CtrlGisContextValue = useContext(CtrlGisContext);

  useEffect(() => {
    console.log("ctrl", AppContextValue.edit_data.layers_order);
  }, [AppContextValue.update]);

  const layers_order = AppContextValue.edit_data.layers_order;

  console.log("layers_order", layers_order);

  const buildComponent = () => {
    const component = [];

    for (let i = 0; i < layers_order.length; i++) {
      component.push(<CtrlLayer key={i} layer_uuid={layers_order[i]} layer_progress_status={props.layers_progress_status[layers_order[i]]} />);
    }

    return component;
  };

  return <div className="ctrl_layers">{buildComponent()}</div>;
};
export default CtrlLayers;
