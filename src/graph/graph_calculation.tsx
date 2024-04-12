import EditData from "../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeJsonCoordinates } from "../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../gis_scipt/gis_unique_data";

import SvgKit from "../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../parser/sgml_kit/svg_kit/svg_node";

import GraphNode from "./expression/graph_node";
import Graph from "./expression/graph";
import GraphCoordinateExpression from "./expression/coordinate_expression";
import GraphCalculationNodePath from "./graph_calculation_node_path";
import { calcAngleByPosition, calcPythagorean, calcPythagoreanSquare, calcCenterGravity } from "../mathematical/dimension_two";
import GraphOptimization from "./optimization/graph_optimization";
import ProcessPath from "./expression/process_path";
import { copyObject } from "../definition";

class GraphCalculation {
  graph_container: Graph;
  processed_path: ProcessPath;

  bfs_que: Array<string>;
  node_path: GraphCalculationNodePath;

  original_data_coordinate_correction_flag: boolean;

  constructor(graph: Graph, original_data_coordinate_correction_flag: boolean) {
    this.graph_container = graph;
    this.node_path = new GraphCalculationNodePath();
    this.processed_path = new ProcessPath();
    this.bfs_que = [];
    this.original_data_coordinate_correction_flag = original_data_coordinate_correction_flag;
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

      for (let j = 0; j < node.bidirectional_link_id_list.length; j++) {
        const link_node_id = node.bidirectional_link_id_list[j];
        const link_node = this.graph_container.graph.get(link_node_id);

        const index = this.processed_path.pushProcessed();
        // this.pushCoordinate(index, node.x, node.y);
        // this.pushCoordinate(index, link_node.x, link_node.y);
      }
    }
  };

  startCalc = () => {
    this.graph_container.intersectionExtraction();

    const node_keys = this.graph_container.graph.keys();
    const termination_point_branch_1 = this.graph_container.getPointID(1);
    const termination_point_branch_2 = this.graph_container.getPointID(2);

    //大阪環状線のように、単一データでループする路線に終起点を強制的に生成する処理
    if (termination_point_branch_1.length == 0 && termination_point_branch_2.length > 0) {
      this.graph_container.loopLinePoint(termination_point_branch_1, termination_point_branch_2);
    }

    // const termination_even_point = this.getTerminationEvenPointID();

    this.graph_container.graph.forEach(function (node, key) {
      console.log("termination_point -alllinks", key, node.bidirectional_link_id_list);
    });
    this.graph_container.graph.forEach(function (node, key) {
      if (node.bidirectional_link_id_list.length == 1) {
        console.log("termination_point -graph1", key, node.bidirectional_link_id_list);
      }
    });
    this.graph_container.graph.forEach(function (node, key) {
      if (node.bidirectional_link_id_list.length >= 3) {
        console.log("termination_point -graph3", key, node.bidirectional_link_id_list);
      }
    });

    // for (const key of node_keys) {
    //   this.node_path.pushNode(key, -1);
    // }

    this.calcTerminationPoint();

    console.log("dfs", this.processed_path.path.size, copyObject(this.processed_path), this.node_path);

    if (this.original_data_coordinate_correction_flag) {
      const relief_separate_count = this.reliefSeparate();

      if (relief_separate_count > 0) {
        console.log("始点間距離計測(D) -relief_separate_count", relief_separate_count);
        this.node_path = new GraphCalculationNodePath();
        this.processed_path = new ProcessPath();
        this.bfs_que = [];
        this.calcTerminationPoint();
      }
    }
    if (true) {
      const graph_optimization = new GraphOptimization();
      let gec = graph_optimization.generateGraphExtraction(this.graph_container, this.processed_path);

      const getBranch2List = () => {
        const gp2 = gec.getPointID(2);
        const fgp2 = gp2.filter(
          (element, index) => gec.graph.get(element).bidirectional_link_id_list[0] == gec.graph.get(element).bidirectional_link_id_list[1]
        );
        return fgp2;
      };

      const getBranch2OtherList = () => {
        const gp2 = gec.getPointID(2);
        const fgp2 = gp2.filter(
          (element, index) => gec.graph.get(element).bidirectional_link_id_list[0] != gec.graph.get(element).bidirectional_link_id_list[1]
        );
        return fgp2;
      };

      let branch2_list = getBranch2List();

      while (branch2_list.length > 0) {
        const branch2_id = branch2_list[0];
        const branch2_link_id = gec.graph.get(branch2_id).bidirectional_link_id_list[0];

        const brnach_2_g_node = this.graph_container.graph.get(branch2_id);
        const brnach_2_g_link_node = this.graph_container.graph.get(branch2_link_id);
        const brnach_2_g_link_copy_node = brnach_2_g_link_node.copyGraphNode();
        const new_id = brnach_2_g_link_copy_node.node_id + "d";

        brnach_2_g_link_copy_node.node_id = new_id;
        brnach_2_g_link_copy_node.bidirectional_link_id_list = [branch2_id];

        this.graph_container.graph.set(new_id, brnach_2_g_link_copy_node);
        this.graph_container.deleteLinkNode(branch2_link_id, branch2_id);
        this.graph_container.replaceLinkNode(branch2_id, branch2_link_id, new_id);

        this.calcReStart();

        gec = graph_optimization.generateGraphExtraction(this.graph_container, this.processed_path);
        branch2_list = getBranch2List();
      }
    }
  };

  calcReStart = () => {
    this.node_path = new GraphCalculationNodePath();
    this.processed_path = new ProcessPath();
    this.bfs_que = [];
    this.calcTerminationPoint();
  };

  calcTerminationPoint = () => {
    const termination_point = this.graph_container.getTerminationPointID();
    console.log("termination_point -start", termination_point);
    for (let i = 0; i < termination_point.length; i++) {
      const termination_point_node_id = termination_point[i];
      const termination_point_node = this.graph_container.graph.get(termination_point_node_id);
      if (this.isValidNodePath(termination_point_node_id)) {
        continue;
      }
      const p_index = this.processed_path.pushProcessedPos(termination_point_node_id, termination_point_node.x, termination_point_node.y);
      this.node_path.pushNode(termination_point_node_id, p_index);
      this.dfs(termination_point_node_id);
    }
  };

  popDfsStack = () => {
    const v = this.bfs_que[this.bfs_que.length - 1];
    this.bfs_que.pop();
    // const v = this.bfs_que[0];
    // this.bfs_que.shift();
    return v;
  };

  isValidNodePath = (node_id: string) => {
    return this.node_path.isValidNode(node_id);
  };

  dfs = (start_node_id: string) => {
    console.log("深さ優先探索", start_node_id, this.node_path, this.graph_container.graph);
    this.bfs_que = [];
    this.bfs_que.push(start_node_id);

    const start_node = this.graph_container.graph.get(start_node_id);
    const start_node_paths = this.node_path.getPaths(start_node_id);

    for (let start_node_path of start_node_paths) {
      this.processed_path.pushCoordinateId(start_node_path, start_node_id, start_node.x, start_node.y);
    }

    console.log("termination_point -search start", start_node_id);

    while (this.bfs_que.length > 0) {
      const que_length = this.bfs_que.length;

      const current_node_id = this.popDfsStack();
      const current_node = this.graph_container.graph.get(current_node_id);
      const link_id_list = current_node.bidirectional_link_id_list;
      const link_id_list_length = link_id_list.length;
      const current_node_paths = this.node_path.getPaths(current_node_id);

      console.log("termination_point -search", link_id_list_length, current_node_id, link_id_list);

      for (let j = 0; j < link_id_list_length; j++) {
        const nv_id = link_id_list[j];
        const nv_node = this.graph_container.graph.get(nv_id);

        const group = this.node_path.otheGroupPath(current_node_id, nv_id);

        //接続先がすでに通っているノードであれば許容しない
        if (group >= 0) {
          continue;
        }

        //分岐点であれば区切る
        if (link_id_list_length >= 3) {
          const path_index = this.processed_path.pushProcessedPos(current_node_id, current_node.x, current_node.y);
          this.processed_path.pushCoordinateId(path_index, nv_id, nv_node.x, nv_node.y);
          this.node_path.pushNode(current_node_id, path_index);
          this.node_path.pushNode(nv_id, path_index);
        }

        //区切らない
        else {
          for (let current_node_path of current_node_paths) {
            this.processed_path.pushCoordinateId(current_node_path, nv_id, nv_node.x, nv_node.y);
            this.node_path.pushNode(nv_id, current_node_path);
          }
        }

        this.bfs_que.push(nv_id);
      }
    }
  };

  reliefSeparateTerminalPoint = (terminal_point_id: string) => {
    let count = 0;

    const terminal_point = this.graph_container.graph.get(terminal_point_id);
    for (const path of this.processed_path.path.values()) {
      console.log("始点間距離計測(J)", terminal_point, path, terminal_point.bidirectional_link_id_list.length);

      if (path.coordinates.has(terminal_point_id)) {
        continue;
      }

      for (let k = 2; k < path.pos_order.length - 1; k++) {
        const pos1_id = path.pos_order[k - 1];
        const pos2_id = path.pos_order[k];
        const pos1 = path.coordinates.get(pos1_id);
        const pos2 = path.coordinates.get(pos2_id);
        const posd = calcPythagoreanSquare(pos1, pos2);
        const d = calcPythagoreanSquare(pos1, { x: terminal_point.x, y: terminal_point.y });

        console.log("始点間距離計測(K)", terminal_point, pos1, pos2);

        if (d <= posd) {
          const ol = copyObject(this.graph_container.graph.get(terminal_point_id));

          if (!terminal_point.bidirectional_link_id_list.includes(pos1_id)) {
            terminal_point.bidirectional_link_id_list.push(pos1_id);
          }
          if (!terminal_point.bidirectional_link_id_list.includes(pos2_id)) {
            terminal_point.bidirectional_link_id_list.push(pos2_id);
          }

          const cg = calcCenterGravity(terminal_point.getPos(), pos1, pos2);
          terminal_point.setPos(cg.x, cg.y);
          this.graph_container.replaceLinkNode(pos1_id, pos2_id, terminal_point_id);
          this.graph_container.replaceLinkNode(pos2_id, pos1_id, terminal_point_id);

          console.log(
            "始点間距離計測(D)",
            terminal_point,
            ol,
            copyObject(this.graph_container.graph.get(terminal_point_id)),
            pos1,
            copyObject(this.graph_container.graph.get(pos1_id)),
            pos2,
            copyObject(this.graph_container.graph.get(pos2_id)),
            count
          );

          count++;
          return count;
        }
      }
    }
    return count;
  };

  reliefSeparate = () => {
    const terminal_points = this.graph_container.getPointID(1);

    let count = 0;

    for (const terminal_point_id of terminal_points) {
      const rv_count = this.reliefSeparateTerminalPoint(terminal_point_id);
      count += rv_count;
    }

    return count;
  };
}

export default GraphCalculation;
