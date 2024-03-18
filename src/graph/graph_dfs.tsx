import EditData from "../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeJsonCoordinates } from "../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../gis_scipt/gis_unique_data";

import SvgKit from "../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../parser/sgml_kit/svg_kit/svg_node";

import GraphNode from "./graph_node";
import Graph from "./graph";
import GraphCoordinateExpression from "./expression/coordinate_expression";

class GraphDfs {
  graph_container: Graph;
  termination_point: Array<string>;
  is_searched_nodes: Map<string, boolean>;

  processed_path: Array<GraphCoordinateExpression>;
  processing_path: Array<GraphCoordinateExpression>;
  is_searched_count: number;

  constructor(graph: Graph) {
    this.graph_container = graph;
    this.is_searched_nodes = new Map();
    this.is_searched_count = 0;
    this.termination_point = [];
    this.processed_path = [];
    this.processing_path = [];
  }

  getProcessedPath = () => {
    return this.processed_path;
  };

  startDfs = () => {
    const node_keys = this.graph_container.graph.keys();

    for (let key in node_keys) {
      this.is_searched_nodes.set(key, false);
    }

    this.termination_point = this.getTerminationPointID();

    this.pushProcessing();
    const start_node_id = this.termination_point[0];
    this.dfs(start_node_id);
    this.popProcessing();

    console.log("処理済みパス", this.processed_path.length, this.processed_path);
  };

  pushProcessing = () => {
    this.processing_path.push(new GraphCoordinateExpression("path"));
  };
  popProcessing = () => {
    this.processed_path.push(this.processing_path[this.processing_path.length - 1]);
    this.processing_path.pop();
  };
  pushCoordinate = (x: number, y: number) => {
    this.processing_path[this.processing_path.length - 1].pushCoordinate(x, y);
  };

  dfs = (current_node_id: string): boolean => {
    console.log("深さ優先探索", current_node_id, this.is_searched_count, this.graph_container.graph.size);
    if (this.is_searched_nodes.get(current_node_id)) {
      return false;
    }

    const current_nodet = this.graph_container.graph.get(current_node_id);
    this.is_searched_nodes.set(current_node_id, true);
    this.is_searched_count++;
    const link_id_list = current_nodet!.link_id_list;

    let branch_flag = link_id_list.length >= 3;

    this.pushCoordinate(current_nodet.x, current_nodet.y);

    if (branch_flag) {
      this.dfsBranch(current_node_id);
      return true;
    }

    link_id_list.forEach((link_id) => {
      this.dfs(link_id);
    });

    return true;
  };

  dfsBranch = (current_node_id: string) => {
    let new_link_count = 0;

    const current_nodet = this.graph_container.graph.get(current_node_id);
    this.is_searched_nodes.set(current_node_id, true);
    const link_id_list = current_nodet!.link_id_list;

    for (let i = 0; i < link_id_list.length; i++) {
      const link_id = link_id_list[i];

      const lc1_flag = new_link_count >= 1;
      if (lc1_flag) {
        this.pushProcessing();
      }
      if (this.dfs(link_id)) {
        new_link_count++;
      }
      if (lc1_flag) {
        this.popProcessing();
      }
    }
  };

  getTerminationPointID = (): Array<string> => {
    const t_id: Array<string> = [];
    let loop_candidacy = ""; //ループ状になってた時は循環してしまう。そのため起点が存在しない。その場合用の候補

    this.graph_container.graph.forEach(function (node, key) {
      if (node.link_id_list.length == 2 && !loop_candidacy) {
        loop_candidacy = key;
      }
      if (node.link_id_list.length == 1) {
        t_id.push(key);
      }
    });

    if (t_id.length == 0) {
      t_id.push(loop_candidacy);
    }

    return t_id;
  };
}

export default GraphDfs;
