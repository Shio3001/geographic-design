import EditData from "../../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeJsonCoordinates, TypePosition } from "../../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../../gis_scipt/gis_unique_data";

import SvgKit from "../../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../../parser/sgml_kit/svg_kit/svg_node";

import GraphNode from "../graph_node";

class GraphCoordinateExpression {
  coordinates: Map<string,TypePosition>;
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

  setCoordinateExpressionId = (id: number) => {
    this.coordinate_expression_id = id;
  };

  pythagorean = (ap: TypePosition, bp: TypePosition) => {
    const x = bp.x - ap.x;
    const y = bp.y - ap.y;
    const t = x ** 2 + y ** 2;
    const r = Math.sqrt(t);
    return r;
  };

  getDistance = () => {
    let d_sum = 0;
    console.log("get-distance-all", this.pos_order, this.coordinates);

    for (let i = 1; i < this.pos_order.length; i++) {
      const c1 = this.coordinates.get(this.pos_order[i - 1]);
      const c2 = this.coordinates.get(this.pos_order[i]);

      const d = this.pythagorean(c1, c2);
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
    this.pos_order.splice(index , 0 , id)
  };
  pushPosIds = (id: string) => {
    this.pos_order.push(id);
  };

  pushCoordinateId = (id: string, x: number, y: number) => {
    this.coordinates.set(id,{ x: x, y: y });
    this.pushPosIds(id);
  };

  // hasPosId(id: string) {
  //   return this.pos_ids.has(id);
  // }
}

export default GraphCoordinateExpression;
