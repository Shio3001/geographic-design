import EditData from "../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeJsonCoordinates } from "../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../gis_scipt/gis_unique_data";

import SvgKit from "../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../parser/sgml_kit/svg_kit/svg_node";

import GraphNode from "./graph_node";

class Graph {
  graph: Map<string, GraphNode>;

  constructor() {
    this.graph = new Map();
  }

  pushNode = (node: GraphNode) => {
    if (!this.graph.has(node.node_name)) {
      this.graph.set(node.node_name, node);
      console.log("node追加 : 新規追加", node.node_name);
    } else {
      const c_node = this.graph.get(node.node_name);

      for (let i = 0; i < node.link_id_list.length; i++) {
        const link_id = node.link_id_list[i];
        c_node.pushLinkNode(link_id);
      }
      this.graph.set(node.node_name, c_node);

      console.log("node追加 : 既存追加", node.node_name);
    }

    for (let i = 0; i < node.link_id_list.length; i++) {
      const link_id = node.link_id_list[i];
      const link_node = this.graph.get(link_id);
      link_node.pushLinkNode(node.node_name);
      this.graph.set(link_id, link_node);
    }
  };
}

export default Graph;
