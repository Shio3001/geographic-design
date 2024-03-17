import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";
import PulldownMenu from "../../common/PulldownMenu/pulldown_menu";

import { getKeysGisUnitIDs, getNamesGisUnitIDs, getGisUnitIDs } from "./../../gis_scipt/route_setup";
import { searchUniqueKey } from "./../../gis_scipt/gis_unique_data";
type PullRapper = { unit_id: string };
type propsCtrlLayerPull = {
  unit_id: string;
  unit_type: string;
};

const PullRapperUnnecessary = (props: PullRapper) => {
  return <></>;
};

const PullRapperRailroadSection = (props: PullRapper) => {
  const flowUpUnitRailway = (index: number) => {};
  const flowUpUnitLine = (index: number) => {};
  return (
    <>
      <PulldownMenu flowUp={flowUpUnitRailway} view_options={searchUniqueKey(props.unit_id, "N02_004")} />
      <PulldownMenu flowUp={flowUpUnitLine} view_options={searchUniqueKey(props.unit_id, "N02_003")} />
    </>
  );
};

const PullRapperStation = (props: PullRapper) => {
  const flowUpUnitRailway = (index: number) => {};
  const flowUpUnitLine = (index: number) => {};

  return (
    <>
      <PulldownMenu flowUp={flowUpUnitRailway} view_options={searchUniqueKey(props.unit_id, "N02_004")} />
      <PulldownMenu flowUp={flowUpUnitLine} view_options={searchUniqueKey(props.unit_id, "N02_003")} />
    </>
  );
};

const CtrlLayerPull = (props: propsCtrlLayerPull) => {
  switch (props.unit_type) {
    case "Unnecessary": {
      return <PullRapperUnnecessary unit_id={props.unit_id} />;
    }
    case "RailroadSection": {
      return <PullRapperRailroadSection unit_id={props.unit_id} />;
    }
    case "Station": {
      return <PullRapperStation unit_id={props.unit_id} />;
    }
    default:
      break;
  }
};
export default CtrlLayerPull;
