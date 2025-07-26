import EditData from "../../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeJsonCoordinates, TypeGeometry } from "../../gis_scipt/route_type";
import { CashGeometry, searchGisConditional, getGeometry, getProperties } from "./../../gis_scipt/gis_unique_data";

import SvgKit from "../sgml_kit/svg_kit/svg_kit";
import SvgNode from "../sgml_kit/svg_kit/svg_node";
import { over, toNumber } from "lodash";
import GraphCoordinateExpression from "./../../graph/expression/coordinate_expression";
import BigNumber from "bignumber.js";
import * as GEO from "./../../geographic_constant";

import Parser from "./parser";
class ParserStation extends Parser {
  svg_node: SvgNode;
  points: { [key: string]: GraphCoordinateExpression };

  constructor(edit_data: EditData, gis_info: TypeGISInfo, layer_uuid: string, unit_id: string, unit_type: string) {
    super(edit_data, gis_info, layer_uuid, unit_id, unit_type);
    this.svg_node = new SvgNode();
    this.points = {};
  }

  generatePoint = () => {
    const current_layer = this.edit_data.layers[this.layer_uuid];
    const station_average_flag = current_layer.layer_infomation["station_average"] == "ok";
    return station_average_flag
      ? Object.values(this.points).map((element) => {
          return element.getAverage();
        })
      : Object.values(this.points);
  };

  coordinateAggregation = async () => {
    const cg = new CashGeometry();

    const current_layer = this.edit_data.layers[this.layer_uuid];
    const geometry_index = searchGisConditional(this.gis_info, this.unit_id, {
      N02_004: current_layer.layer_infomation["railway"],
      N02_003: current_layer.layer_infomation["line"],
    });
    console.log("coordinateAggregation", geometry_index, current_layer.layer_infomation);
    for (let i = 0; i < geometry_index.length; i++) {
      const current_properties = getProperties(this.gis_info, this.unit_id, geometry_index[i]);
      const current_geometry = (await getGeometry(cg, this.gis_info, this.unit_id, geometry_index[i])) as TypeGeometry;
      console.log("current_geometry", current_geometry);

      const cord = current_geometry.coordinates;

      this.parseCoordinatesByStation(cord, current_properties["N02_005"]);
    }
  };

  parseCoordinatesByStation = (coordinates: TypeJsonCoordinates, station_name: string) => {
    for (let i = 0; i < coordinates.length; i++) {
      const coordinate = coordinates[i];
      const coordinate0 = new BigNumber(coordinate[0]);
      const coordinate1 = new BigNumber(coordinate[1]);

      const c0_exp = coordinate0.times(GEO.EXPANSION_CONSTANT_BIGNUMBER).div(GEO.LONGITUDE_KM1_BIGNUMBER).toNumber();
      const c1_exp = coordinate1.times(GEO.EXPANSION_CONSTANT_BIGNUMBER).div(GEO.LATITUDE_KM1_BIGNUMBER).toNumber();

      const c0_exp_dp = coordinate0.times(GEO.EXPANSION_CONSTANT_BIGNUMBER).dp(0).toString();
      const c1_exp_dp = coordinate1.times(GEO.EXPANSION_CONSTANT_BIGNUMBER).dp(0).toString();

      const id = c0_exp_dp + "p" + c1_exp_dp;

      const p: GraphCoordinateExpression = new GraphCoordinateExpression("point", station_name);
      p.pushCoordinateId(id, c0_exp, c1_exp);

      if (!(station_name in this.points)) {
        this.points[station_name] = p;
      } else {
        this.points[station_name].includePath(p);
      }
    }
  };
}

export default ParserStation;
