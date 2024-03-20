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
    if (!this.graph.has(node.node_id)) {
      this.graph.set(node.node_id, node);
    } else {
      const c_node = this.graph.get(node.node_id);

      for (let i = 0; i < node.bidirectional_link_id_list.length; i++) {
        const bidirectional_link_id = node.bidirectional_link_id_list[i];
        c_node.pushBidirectionalLinkNode(bidirectional_link_id);
      }
      this.graph.set(node.node_id, c_node);
    }
    for (let i = 0; i < node.bidirectional_link_id_list.length; i++) {
      const link_id = node.bidirectional_link_id_list[i];
      const link_node = this.graph.get(link_id);
      link_node.pushBidirectionalLinkNode(node.node_id);
      this.graph.set(link_id, link_node);
    }
  };
}

export default Graph;
