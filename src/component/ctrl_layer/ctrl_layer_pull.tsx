import * as React from "react";
const { useContext } = React;

import { AppContext } from "./../../app_context";

import { propsCtrlLayerPull } from "./Rapper/helper";

import PullRapperRailroadSection from "./Rapper/railway";
import PullRapperStation from "./Rapper/station";
import PullRapperCoast from "./Rapper/coast";
import PullRapperLake from "./Rapper/lake";
import PullRapperAdministrative from "./Rapper/ad";
import PullRapperAdministrativePref from "./Rapper/adpref";
import PullRapperRiver from "./Rapper/river";

const CtrlLayerPull = (props: propsCtrlLayerPull) => {
  const AppContextValue = useContext(AppContext);
  const layer = AppContextValue.edit_data.getLayer(props.layer_uuid);

  const unit_id = layer.unit_id;
  const unit_type = AppContextValue.gis_info.id_type[unit_id];
  switch (unit_type) {
    case "RailroadSection": {
      return (
        <>
          <PullRapperRailroadSection unit_type={unit_type} layer_uuid={props.layer_uuid} />
        </>
      );
    }
    case "Station": {
      return (
        <>
          <PullRapperStation unit_type={unit_type} layer_uuid={props.layer_uuid} />
        </>
      );
    }
    case "Coast": {
      return <PullRapperCoast unit_type={unit_type} layer_uuid={props.layer_uuid}></PullRapperCoast>;
    }

    case "Lake": {
      return <PullRapperLake unit_type={unit_type} layer_uuid={props.layer_uuid}></PullRapperLake>;
    }

    case "Administrative": {
      return <PullRapperAdministrative unit_type={unit_type} layer_uuid={props.layer_uuid}></PullRapperAdministrative>;
    }

    case "Administrative_pref": {
      return <PullRapperAdministrativePref unit_type={unit_type} layer_uuid={props.layer_uuid}></PullRapperAdministrativePref>;
    }

    case "River": {
      return <PullRapperRiver unit_type={unit_type} layer_uuid={props.layer_uuid}></PullRapperRiver>;
    }

    default:
      return <></>;
  }
};
export default CtrlLayerPull;
