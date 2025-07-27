import EditData from "../../component/ctrl_dataflow/edit_data/edit_data";
import { TypeGISInfo, TypeJsonCoordinates } from "../../gis_scipt/route_type";

import GraphCoordinateExpression from "./../../graph/expression/coordinate_expression";
import BigNumber from "bignumber.js";
import * as GEO from "./../../geographic_constant";
import { RemoveLineMap } from "./../remove_line_map";

import { TypeFunctionUpdateLayerProgress } from "./../parser_webworker_type";

class Parser {
  edit_data: EditData;
  gis_info: TypeGISInfo;
  layer_uuid: string;
  unit_id: string;
  unit_type: string;
  updateLayerRunning?: TypeFunctionUpdateLayerProgress;
  updateLayerRunningCount?: TypeFunctionUpdateLayerProgress;

  constructor(
    edit_data: EditData,
    gis_info: TypeGISInfo,
    layer_uuid: string,
    unit_id: string,
    unit_type: string,
    updateLayerRunning?: TypeFunctionUpdateLayerProgress,
    updateLayerRunningCount?: TypeFunctionUpdateLayerProgress
  ) {
    this.edit_data = edit_data;
    this.gis_info = gis_info;
    this.layer_uuid = layer_uuid;
    this.unit_id = unit_id;
    this.unit_type = unit_type;
    this.updateLayerRunning = updateLayerRunning;
    this.updateLayerRunningCount = updateLayerRunningCount;
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
      // 直前の座標と同じ座標は無視する
      // if (gce.getLastNodeId() == id) {
      //   continue;
      // }

      // gce.pushPosIds(id);
      gce.pushCoordinateId(id, c0_exp, c1_exp);
    }

    return gce;
  };

  duplicate = (line: GraphCoordinateExpression, remove_line: RemoveLineMap): Array<GraphCoordinateExpression> => {
    // lineの重複を削除する。必要に応じて分割する

    const lines: Array<GraphCoordinateExpression> = [];
    let latest = 0;

    let asCount = 0;

    for (let i = 0; i < line.pos_order.length - 1; i++) {
      const coordinate_id_0 = line.pos_order[i];
      const coordinate_id_1 = line.pos_order[i + 1];

      if (remove_line.hasRemoveLineMap(coordinate_id_0, coordinate_id_1, this.layer_uuid)) {
        const section_patn = line.getSectionPath(latest, i);
        lines.push(section_patn);
        latest = i + 1;

        continue;
      }

      remove_line.pushRemoveLineMap(coordinate_id_0, coordinate_id_1, this.layer_uuid);
    }

    const latest_section_patn = line.getSectionPath(latest, line.pos_order.length - 1);
    lines.push(latest_section_patn);

    return lines;
  };
}

export default Parser;
