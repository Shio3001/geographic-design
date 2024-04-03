import EditData from "../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeJsonCoordinates } from "../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../gis_scipt/gis_unique_data";

import SvgKit from "../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../parser/sgml_kit/svg_kit/svg_node";

import GraphNode from "./expression/graph_node";
import Graph from "./expression/graph";
import GraphCoordinateExpression from "./expression/coordinate_expression";
import GraphOptimization from "./optimization/graph_optimization";
import { TypeGraphRoute, TypeGraphRouteNode } from "./expression/graph_type";
import PathContact from "./expression/path_contact";
import * as _ from "lodash"; // lodashをインポート

class GraphPathJoin {
  graph_optimization: GraphOptimization;
  constructor(graph_optimization: GraphOptimization) {
    this.graph_optimization = graph_optimization;
    // graph_optimization.processed_path.path.get(1).
  }

  joinContinuity = () => {};

  join = () => {};
}

export default GraphPathJoin;
