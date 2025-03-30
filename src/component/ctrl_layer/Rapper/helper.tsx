import React from "react";

export type PullRapper = { layer_uuid: string; unit_type: string };

export type propsCtrlLayerPull = {
  layer_uuid: string;
};

export const PullRapperUnnecessary = (props: PullRapper) => {
  return <></>;
};
