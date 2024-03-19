import EditData from "../../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeJsonCoordinates, TypePosition } from "../../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "./../../gis_scipt/gis_unique_data";

import SvgKit from "../sgml_kit/svg_kit/svg_kit";
import SvgNode from "../sgml_kit/svg_kit/svg_node";
import { toNumber } from "lodash";
import GraphCoordinateExpression from "./../../graph/expression/coordinate_expression";
import BigNumber from "bignumber.js";

class ParserStation {
  edit_data: EditData;
  gis_info: TypeGISInfo;
  svg_node: SvgNode;
  layer_uuid: string;
  unit_id: string;
  unit_type: string;
  points: Array<GraphCoordinateExpression>;

  constructor(edit_data: EditData, gis_info: TypeGISInfo, layer_uuid: string, unit_id: string, unit_type: string) {
    this.edit_data = edit_data;
    this.gis_info = gis_info;
    this.svg_node = new SvgNode();
    this.layer_uuid = layer_uuid;
    this.unit_id = unit_id;
    this.unit_type = unit_type;
    this.points = [];
  }

  generatePoint = () => {
    return this.points;
  };

  coordinateAggregation = () => {
    const current_layer = this.edit_data.layers[this.layer_uuid];
    const geometry_index = searchGisConditional(this.unit_id, {
      N02_004: current_layer.layer_infomation["railway"],
      N02_003: current_layer.layer_infomation["line"],
    });
    console.log("coordinateAggregation", geometry_index, current_layer.layer_infomation);
    for (let i = 0; i < geometry_index.length; i++) {
      const current_geometry = getGeometry(this.unit_id, geometry_index[i]);
      console.log("current_geometry", current_geometry);

      const cord = current_geometry.coordinates;
      this.parseCoordinates(cord);
    }
  };

  parseCoordinates = (coordinates: TypeJsonCoordinates) => {
    for (let i = 0; i < coordinates.length; i++) {
      const coordinate = coordinates[i];
      const coordinate0 = new BigNumber(coordinate[0]);
      const coordinate1 = new BigNumber(coordinate[1]);

      const c0_100000 = coordinate0.times(100000).toNumber();
      const c1_100000 = coordinate1.times(100000).toNumber();

      const p: GraphCoordinateExpression = new GraphCoordinateExpression("point");
      p.pushCoordinate(c0_100000, c1_100000);
      this.points.push(p);
    }
  };
}

export default ParserStation;