import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;

import CtrlLayer from "./ctrl_layer";
import { AppContext } from "./../../app_context";
import { CtrlGisContext } from "./../ctrl_gis_context";

//parser_webworker_type
import { TypePostMessageLayerOrderStatus, TypePostMessageMainStatus } from "../../parser/parser_webworker_type";

type Props = {
  layer_order_status?: TypePostMessageLayerOrderStatus;
  main_status: TypePostMessageMainStatus;
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
      component.push(
        <CtrlLayer key={i} layer_uuid={layers_order[i]} main_status={props.main_status} layer_status={props.layer_order_status[layers_order[i]]} />
      );
    }

    return component;
  };

  return <div className="ctrl_layers">{buildComponent()}</div>;
};
export default CtrlLayers;
