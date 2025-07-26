import EditData from "../../component/ctrl_dataflow/edit_data/edit_data";
import { TypeGISInfo, TypeJsonCoordinates } from "../../gis_scipt/route_type";

import GraphCoordinateExpression from "./../../graph/expression/coordinate_expression";
import BigNumber from "bignumber.js";
import * as GEO from "./../../geographic_constant";

class Parser {
  edit_data: EditData;
  gis_info: TypeGISInfo;
  layer_uuid: string;
  unit_id: string;
  unit_type: string;

  constructor(edit_data: EditData, gis_info: TypeGISInfo, layer_uuid: string, unit_id: string, unit_type: string) {
    this.edit_data = edit_data;
    this.gis_info = gis_info;
    this.layer_uuid = layer_uuid;
    this.unit_id = unit_id;
    this.unit_type = unit_type;
  }

  parseCoordinates = (coordinates: TypeJsonCoordinates) => {
    const gce = new GraphCoordinateExpression("path");

    for (let i = 0; i < coordinates.length; i++) {
      const coordinate = coordinates[i];

      const coordinate0 = new BigNumber(coordinate[0]);
      const coordinate1 = new BigNumber(coordinate[1]);

      const c0_exp = coordinate0.times(GEO.EXPANSION_CONSTANT_BIGNUMBER).div(GEO.LONGITUDE_KM1_BIGNUMBER).toNumber();
      const c1_exp = coordinate1.times(GEO.EXPANSION_CONSTANT_BIGNUMBER).div(GEO.LATITUDE_KM1_BIGNUMBER).toNumber();

      const c0_exp_dp = coordinate0.times(GEO.EXPANSION_CONSTANT_BIGNUMBER).dp(0).toString();
      const c1_exp_dp = coordinate1.times(GEO.EXPANSION_CONSTANT_BIGNUMBER).dp(0).toString();

      const id = c0_exp_dp + "p" + c1_exp_dp;
      gce.pushPosIds(id);
      gce.pushCoordinateId(id, c0_exp, c1_exp);
    }

    return gce;
  };
}

export default Parser;
