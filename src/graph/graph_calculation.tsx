import EditData from "../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeJsonCoordinates } from "../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../gis_scipt/gis_unique_data";

import SvgKit from "../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../parser/sgml_kit/svg_kit/svg_node";

import GraphNode from "./graph_node";
import Graph from "./graph";
import GraphCoordinateExpression from "./expression/coordinate_expression";

type TypeProcessingPathStack = {
  path: GraphCoordinateExpression;
  route_node: Map<string, boolean>;
};

class GraphCalculation {
  graph_container: Graph;

  processed_path: Array<GraphCoordinateExpression>;

  node_path: Map<string, number>;
  bfs_que: Array<string>;

  constructor(graph: Graph) {
    this.graph_container = graph;
    this.node_path = new Map();

    this.processed_path = [];
    this.bfs_que = [];
  }

  getProcessedPath = () => {
    return this.processed_path;
  };

  debugNode = () => {
    const node_keys = this.graph_container.graph.keys();
    console.log("debugNode ", this.graph_container.graph, this.graph_container.graph.size);
    for (const key of node_keys) {
      const node = this.graph_container.graph.get(key);

      console.log("debugNodeK ", key);

      for (let j = 0; j < node.link_id_list.length; j++) {
        const link_node_id = node.link_id_list[j];
        const link_node = this.graph_container.graph.get(link_node_id);

        // this.pushProcessing();
        // this.pushCoordinate(node.x, node.y);
        // this.pushCoordinate(link_node.x, link_node.y);
        // this.popProcessing();
      }
    }
  };

  startCalc = () => {
    const node_keys = this.graph_container.graph.keys();

    const termination_point = this.getTerminationPointID();
    // const termination_even_point = this.getTerminationEvenPointID();

    console.log("termination_point", termination_point);

    this.graph_container.graph.forEach(function (node, key) {
      console.log("termination_point -alllinks", key, node.link_id_list);
    });
    this.graph_container.graph.forEach(function (node, key) {
      if (node.link_id_list.length == 1 || node.link_id_list.length >= 3) {
        console.log("termination_point -graph", key, node.link_id_list);
      }
    });

    for (const key of node_keys) {
      this.node_path.set(key, -1);
    }

    console.log("termination_point", termination_point);
    for (let i = 0; i < termination_point.length; i++) {
      const termination_point_node_id = termination_point[i];
      if (this.isValidNodePath(termination_point_node_id)) {
        continue;
      }
      const p_index = this.pushProcessed();
      this.node_path.set(termination_point_node_id, p_index);
      this.dfs(termination_point_node_id);
    }

    console.log("処理済みパス", this.processed_path.length, this.processed_path);
  };

  pushProcessed = () => {
    const g = new GraphCoordinateExpression("path");
    this.processed_path.push(g);
    return this.processed_path.length - 1;
  };

  pushCoordinate = (path_index: number, x: number, y: number) => {
    this.processed_path[path_index].pushCoordinate(x, y);
  };
  pushCoordinateId = (path_index: number, node_id: string, x: number, y: number) => {
    this.processed_path[path_index].pushCoordinateId(node_id, x, y);
  };
  hasCoordinateId = (path_index: number, node_id: string) => {
    return this.processed_path[path_index].hasPosId(node_id);
  };
  popDfsStack = () => {
    const v = this.bfs_que[this.bfs_que.length - 1];
    this.bfs_que.pop();
    return v;
  };

  isValidNodePath = (node_id: string) => {
    return this.node_path.get(node_id) >= 0;
  };

  dfs = (start_node_id: string) => {
    console.log("幅優先探索", start_node_id, this.graph_container.graph.size);
    this.bfs_que = [];
    this.bfs_que.push(start_node_id);

    console.log("termination_point -search start", start_node_id, this.graph_container.graph.get(start_node_id).link_id_list);

    while (this.bfs_que.length > 0) {
      const que_length = this.bfs_que.length;

      const current_node_id = this.popDfsStack();
      const current_node = this.graph_container.graph.get(current_node_id);
      const link_id_list = current_node.link_id_list;
      const link_id_list_length = link_id_list.length;
      const current_node_path = this.node_path.get(current_node_id);
      this.pushCoordinateId(current_node_path, current_node_id, current_node.x, current_node.y);
      console.log("termination_point -search", current_node_id, link_id_list);

      let link_count = 0;

      for (let j = 0; j < link_id_list_length; j++) {
        const nv_id = link_id_list[j];
        const nv_node = this.graph_container.graph.get(nv_id);

        if (nv_id == current_node_id) {
          continue;
        }

        const next_node_path = link_count >= 1 ? this.pushProcessed() : current_node_path;

        if (this.isValidNodePath(nv_id) && !this.hasCoordinateId(current_node_path, nv_id)) {
          this.pushCoordinateId(current_node_path, nv_id, nv_node.x, nv_node.y);
          continue;
        }
        if (this.isValidNodePath(nv_id)) {
          continue;
        }
        link_count++;

        this.node_path.set(nv_id, next_node_path);
        this.bfs_que.push(nv_id);
      }
    }
  };

  getTerminationEvenPointID = (): Array<string> => {
    const t_id: Array<string> = [];

    this.graph_container.graph.forEach(function (node, key) {
      if (node.link_id_list.length != 2 && node.link_id_list.length % 2 == 0) {
        t_id.push(key);
      }
    });

    return t_id;
  };

  getTerminationPointID = (): Array<string> => {
    const t_id: Array<string> = [];
    let loop_candidacy = ""; //ループ状になってた時は循環してしまう。そのため起点が存在しない。その場合用の候補

    this.graph_container.graph.forEach(function (node, key) {
      if (node.link_id_list.length == 2 && !loop_candidacy) {
        loop_candidacy = key;
      }
      if (node.link_id_list.length == 1 || node.link_id_list.length >= 3) {
        t_id.push(key);
      }
    });

    if (t_id.length == 0) {
      t_id.push(loop_candidacy);
    }

    return t_id;
  };
}

export default GraphCalculation;
