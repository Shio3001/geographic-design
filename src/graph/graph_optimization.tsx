import EditData from "../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo } from "../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../gis_scipt/gis_unique_data";

import SvgKit from "../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../parser/sgml_kit/svg_kit/svg_node";

import GraphNode from "./graph_node";
import Graph from "./graph";
import GraphCoordinateExpression from "./expression/coordinate_expression";
import GraphCalculationNodePath from "./graph_calculation_node_path";

class GraphOptimization {
  graph_container: Graph;
  graph_extraction_container: Graph;

  processed_path: Array<GraphCoordinateExpression>;

  constructor(graph_container: Graph, processed_path: Array<GraphCoordinateExpression>) {
    this.graph_container = graph_container;
    this.processed_path = processed_path;
    this.graph_extraction_container = new Graph();
  }

  getTerminalNode = () => {
    const keys = this.graph_container.graph.keys();
    const nodes = [];

    for (let node_id of keys) {
      const graph_node = this.graph_container.graph.get(node_id);

      const link_list = graph_node.bidirectional_link_id_list;

      if (link_list.length == 1 || link_list.length >= 3) {
        nodes.push(node_id);
      }
    }
    return nodes;
  };

  generateGraphExtraction = () => {
    const node_id_list = this.getTerminalNode();

    for (let node_id in node_id_list) {
      const new_g_node = new GraphNode();
      this.graph_extraction_container.pushNode(new_g_node);
    }
  };
}

export default GraphOptimization;

//接続先が1もしくは3以上の場所を抽出する。
//抽出データの中でグラフを構築する
//幅優先探索をするその際、経路と距離を保持する
