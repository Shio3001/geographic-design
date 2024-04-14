import EditData from "../../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeJsonCoordinates, TypePosition } from "../../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../../gis_scipt/gis_unique_data";

import SvgKit from "../../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../../parser/sgml_kit/svg_kit/svg_node";

import GraphNode from "./graph_node";

import { calcPythagorean } from "../../mathematical/dimension_two";
import * as _ from "lodash"; // lodashをインポート

class GraphCoordinateExpression {
  coordinates: Map<string, TypePosition>;
  type: string; //path or point
  debug_message: Array<string>;
  pos_order: Array<string>;
  coordinate_expression_id: number;

  constructor(type: string) {
    this.coordinates = new Map();
    this.type = type;
    this.debug_message = [];
    this.pos_order = [];
  }

  includePathOrder = (include_path: GraphCoordinateExpression, order_index: number) => {
    const ol = _.cloneDeep(this.pos_order);
    const join_order = include_path.pos_order.filter((element, index) => index >= order_index);
    this.pos_order = this.pos_order.concat(join_order);

    for (let include_path_coordinate_id of include_path.coordinates.keys()) {
      this.coordinates.set(include_path_coordinate_id, include_path.coordinates.get(include_path_coordinate_id));
    }
  };
  includePath = (include_path: GraphCoordinateExpression) => {
    this.pos_order = this.pos_order.concat(include_path.pos_order);

    for (let include_path_coordinate_id of include_path.coordinates.keys()) {
      this.coordinates.set(include_path_coordinate_id, include_path.coordinates.get(include_path_coordinate_id));
    }
  };

  setCoordinateExpressionId = (id: number) => {
    this.coordinate_expression_id = id;
  };

  reversePosOrder = () => {
    this.pos_order = this.pos_order.reverse();
  };

  getDistance = () => {
    let d_sum = 0;

    for (let i = 1; i < this.pos_order.length; i++) {
      const c1 = this.coordinates.get(this.pos_order[i - 1]);
      const c2 = this.coordinates.get(this.pos_order[i]);

      const d = calcPythagorean(c1, c2);
      d_sum += d;
    }

    return d_sum;
  };

  getFirstNodeId = () => {
    return this.pos_order[0];
  };
  getLastNodeId = () => {
    return this.pos_order[this.pos_order.length - 1];
  };

  pushDebugMessage = (text: string, node: GraphNode) => {
    this.debug_message.push(text + " x:" + String(node.x) + " y: " + String(node.y));
  };

  getType = () => {
    return this.type;
  };

  pushPosIdsIndex = (id: string, index: number) => {
    this.pos_order.splice(index, 0, id);
  };
  pushPosIds = (id: string) => {
    this.pos_order.push(id);
  };

  pushCoordinateId = (id: string, x: number, y: number) => {
    this.coordinates.set(id, { x: x, y: y });
    this.pushPosIds(id);
  };

  // hasPosId(id: string) {
  //   return this.pos_ids.has(id);
  // }
}

export default GraphCoordinateExpression;
