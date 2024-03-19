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

  processed_path: Array<GraphCoordinateExpression>;
  processing_path_stack: Array<{ depth: number; path: GraphCoordinateExpression; route_node: Map<string, boolean> }>;

  is_searched_nodes: Map<string, boolean>;
  dfs_stack: Array<string>;

  constructor(graph: Graph) {
    this.graph_container = graph;
    this.is_searched_nodes = new Map();
    this.termination_point = [];
    this.processed_path = [];
    this.processing_path_stack = [];
    this.dfs_stack = [];
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

    for (let i = 0; i < this.termination_point.length; i++) {
      const start_node_id = this.termination_point[i];

      if (this.is_searched_nodes.get(start_node_id)) {
        continue;
      }

      this.pushProcessing(0);

      this.dfs(start_node_id);
      this.popProcessing();
    }

    console.log("処理済みパス", this.processed_path.length, this.processed_path);
  };

  pushProcessing = (depth: number) => {
    this.processing_path_stack.push({ depth: depth, path: new GraphCoordinateExpression("path"), route_node: new Map() });
  };

  pushProcessingRouteNode = (node_id: string) => {
    this.processing_path_stack[this.processing_path_stack.length - 1].route_node.set(node_id, true);
  };

  hasProcessingRouteNode = (node_id: string) => {
    return this.processing_path_stack[this.processing_path_stack.length - 1].route_node.has(node_id);
  };

  popProcessing = () => {
    this.processed_path.push(this.processing_path_stack[this.processing_path_stack.length - 1].path);
    this.processing_path_stack.pop();
  };
  popDepthProcessing = (depth: number) => {
    const length = this.processing_path_stack.length;

    for (let i = 0; i < length; i++) {
      const lasti = length - i - 1;
      const processing_path = this.processing_path_stack[lasti];

      if (processing_path.depth >= depth) {
        this.popProcessing();
      } else {
        break;
      }
    }
  };
  pushCoordinate = (x: number, y: number) => {
    this.processing_path_stack[this.processing_path_stack.length - 1].path.pushCoordinate(x, y);
  };

  popDfsStack = () => {
    const v = this.dfs_stack[this.dfs_stack.length - 1];
    this.dfs_stack.pop();
    return v;
  };

  dfs = (start_node_id: string) => {
    console.log("深さ優先探索", start_node_id, this.graph_container.graph.size);

    this.dfs_stack.push(start_node_id);
    this.is_searched_nodes.set(start_node_id, true);

    while (this.dfs_stack.length > 0) {
      const depth = this.dfs_stack.length;
      this.popDepthProcessing(depth);
      console.log(
        "DFS | ",
        depth,
        "dfs-stack:",
        this.dfs_stack,
        "processing_path_stack:",
        this.processing_path_stack,
        this.graph_container.graph.get(this.dfs_stack[this.dfs_stack.length - 1])
      );

      const current_node_id = this.popDfsStack();
      const current_node = this.graph_container.graph.get(current_node_id);
      this.is_searched_nodes.set(current_node_id, true);
      this.pushProcessingRouteNode(current_node_id);
      const link_id_list = current_node.link_id_list;
      const link_id_list_length = link_id_list.length;

      this.pushCoordinate(current_node.x, current_node.y);

      let new_search_count = 0;

      for (let j = 0; j < link_id_list_length; j++) {
        const nv = link_id_list[j];

        if (this.is_searched_nodes.get(nv) && !this.hasProcessingRouteNode(nv)) {
          const nv_node = this.graph_container.graph.get(nv);
          this.pushCoordinate(nv_node.x, nv_node.y);
          continue;
        }

        if (this.is_searched_nodes.get(nv)) {
          continue;
        }
        if (new_search_count >= 1) {
          this.pushProcessing(depth);
        }

        this.dfs_stack.push(nv);
        new_search_count++;
      }
    }

    // // BFS 開始 (キューが空になるまで探索を行う)
    // while (!que.empty()) {
    //     int v = que.front(); // キューから先頭頂点を取り出す
    //     que.pop();

    //     // v から辿れる頂点をすべて調べる
    //     for (int nv : G[v]) {
    //         if (dist[nv] != -1) continue; // すでに発見済みの頂点は探索しない

    //         // 新たな白色頂点 nv について距離情報を更新してキューに追加する
    //         dist[nv] = dist[v] + 1;
    //         que.push(nv);
    //     }
    // }

    // if (this.is_searched_nodes.get(current_node_id)) {
    //   return false;
    // }

    // const current_nodet = this.graph_container.graph.get(current_node_id);
    // this.is_searched_nodes.set(current_node_id, true);
    // this.is_searched_count++;
    // const link_id_list = current_nodet!.link_id_list;

    // let branch_flag = link_id_list.length >= 3;

    // this.pushCoordinate(current_nodet.x, current_nodet.y);

    // if (branch_flag) {
    //   this.dfsBranch(current_node_id);
    //   return true;
    // }

    // link_id_list.forEach((link_id) => {
    //   this.dfs(link_id);
    // });

    // return true;
  };

  dfsBranch = (current_node_id: string) => {
    // let new_link_count = 0;
    // const current_nodet = this.graph_container.graph.get(current_node_id);
    // this.is_searched_nodes.set(current_node_id, true);
    // const link_id_list = current_nodet!.link_id_list;
    // for (let i = 0; i < link_id_list.length; i++) {
    //   const link_id = link_id_list[i];
    //   const lc1_flag = new_link_count >= 1;
    //   if (lc1_flag) {
    //     this.pushProcessing();
    //   }
    //   if (this.dfs(link_id)) {
    //     new_link_count++;
    //   }
    //   if (lc1_flag) {
    //     this.popProcessing();
    //   }
    // }
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
