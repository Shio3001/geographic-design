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

  constructor(type: string) {
    this.coordinates = [];
    this.type = type;
  }

  getType = () => {
    return this.type;
  };

  pushCoordinate = (x: number, y: number) => {
    this.coordinates.push({ x: x, y: y });
  };
}

export default GraphCoordinateExpression;
