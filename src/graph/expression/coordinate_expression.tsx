import EditData from "../../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeJsonCoordinates, TypePosition } from "../../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../../gis_scipt/gis_unique_data";

import SvgKit from "../../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../../parser/sgml_kit/svg_kit/svg_node";

import GraphNode from "../graph_node";

class GraphCoordinateExpression {
  coordinates: Array<TypePosition>;
  type: string; //path or point
  pos_ids: Map<string, Array<number>>;
  debug_message: Array<string>;

  constructor(type: string) {
    this.coordinates = [];
    this.pos_ids = new Map();
    this.type = type;
    this.debug_message = [];
  }

  pushDebugMessage = (text: string, node: GraphNode) => {
    this.debug_message.push(text + " x:" + String(node.x) + " y: " + String(node.y));
  };

  getType = () => {
    return this.type;
  };

  pushPosIds = (id: string, index: number) => {
    if (this.pos_ids.has(id)) {
      const p = this.pos_ids.get(id);
      p.push(index);
      this.pos_ids.set(id, p);
    } else {
      this.pos_ids.set(id, [index]);
    }
  };

  pushCoordinate = (x: number, y: number) => {
    const xs = String(x);
    const ys = String(y);
    const id = xs + "g" + ys;

    const index = this.coordinates.push({ x: x, y: y });
    this.pushPosIds(id, index);
  };

  pushCoordinateId = (id: string, x: number, y: number) => {
    const index = this.coordinates.push({ x: x, y: y });
    this.pushPosIds(id, index);
  };

  hasPosId(id: string) {
    return this.pos_ids.has(id);
  }
}

export default GraphCoordinateExpression;
