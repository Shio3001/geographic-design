import EditData from "../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeJsonCoordinates } from "../gis_scipt/route_type";
import {
  searchGisConditional,
  getGeometry,
} from "../gis_scipt/gis_unique_data";

import SvgKit from "../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../parser/sgml_kit/svg_kit/svg_node";

import GraphNode from "./graph_node";
import Graph from "./graph";
import GraphCoordinateExpression from "./expression/coordinate_expression";
import GraphCalculationNodePath from "./graph_calculation_node_path";
import * as _ from "lodash"; // lodashをインポート
import { caclcAngleByPosition } from "./../mathematical/angle";

class GraphCalculation {
  graph_container: Graph;
  processed_path: Map<number, GraphCoordinateExpression>;

  bfs_que: Array<string>;
  node_path: GraphCalculationNodePath;

  constructor(graph: Graph) {
    this.graph_container = graph;
    this.node_path = new GraphCalculationNodePath();

    this.processed_path = new Map();
    this.bfs_que = [];
  }

  getProcessedPath = () => {
    return this.processed_path;
  };

  debugNode = () => {
    const node_keys = this.graph_container.graph.keys();
    console.log(
      "debugNode ",
      this.graph_container.graph,
      this.graph_container.graph.size
    );
    for (const key of node_keys) {
      const node = this.graph_container.graph.get(key);

      console.log("debugNodeK ", key);

      for (let j = 0; j < node.bidirectional_link_id_list.length; j++) {
        const link_node_id = node.bidirectional_link_id_list[j];
        const link_node = this.graph_container.graph.get(link_node_id);

        const index = this.pushProcessed();
        // this.pushCoordinate(index, node.x, node.y);
        // this.pushCoordinate(index, link_node.x, link_node.y);
      }
    }
  };

  replaceLinkNode = (node_id:string,old_id:string , new_id:string) => {

    const node = this.graph_container.graph.get(node_id);

    for (let i = 0 ; i  < node.bidirectional_link_id_list.length; i++){
      if (node.bidirectional_link_id_list[i] == old_id){
        node.bidirectional_link_id_list[i] = new_id;
      }
    }



    // const branch2_link_node_copy2 = this.graph_container.graph.get(
    //   branch2node.bidirectional_link_id_list[1]
    // );
    
    // const branch2_link_node_copy2 = this.graph_container.graph.get(
    //   branch2node.bidirectional_link_id_list[1]
    // );
    // branch2_link_node_copy2.bidirectional_link_id_list =
    //   branch2_link_node_copy2.bidirectional_link_id_list.filter(
    //     (element, index) => element != old_copy2_id
    //   );
    // branch2_link_node_copy2.bidirectional_link_id_list.push(new_copy2_id);
  }

  intersectionExtraction = () => {
    const extraction = (even_point_index: string) => {
      const even_point_node = this.graph_container.graph.get(even_point_index);
      const b_link_list = even_point_node.bidirectional_link_id_list;

      let max_radian = Number.MIN_SAFE_INTEGER;
      let extraction_id_list: Array<string> = [];

      for (let i = 0; i < b_link_list.length; i++) {
        const b_link_out_id = b_link_list[i];
        const b_link_out_node = this.graph_container.graph.get(b_link_out_id);
        for (let j = i + 1; j < b_link_list.length; j++) {
          const b_link_in_id = b_link_list[j];
          const b_link_in_node = this.graph_container.graph.get(b_link_in_id);

          const c_radian = caclcAngleByPosition(
            { x: even_point_node.x, y: even_point_node.y },
            { x: b_link_out_node.x, y: b_link_out_node.y },
            { x: b_link_in_node.x, y: b_link_in_node.y }
          );

          if (max_radian < c_radian) {
            max_radian = c_radian;
            extraction_id_list = [b_link_out_id, b_link_in_id];
          }
        }
      }

      return extraction_id_list;
    };

    const separation = (
      even_point_id: string,
      extraction_link_id_list: Array<string>
    ) => {
      const even_point_node = this.graph_container.graph.get(even_point_id);

      const event_point_node_copy1 = _.cloneDeep(even_point_node);
      const event_point_node_copy2 = _.cloneDeep(even_point_node);

      event_point_node_copy1.bidirectional_link_id_list =
        even_point_node.bidirectional_link_id_list.filter((element, index) =>
          extraction_link_id_list.includes(element)
        );

      event_point_node_copy2.bidirectional_link_id_list =
      even_point_node.bidirectional_link_id_list.filter((element, index) =>
        !(extraction_link_id_list.includes(element))
      );

      const old_copy1_id = even_point_node.node_id;
      const new_copy1_id = old_copy1_id + "s";
      event_point_node_copy1.node_id = new_copy1_id;

      for (let i = 0 ; i < extraction_link_id_list.length ; i++){
        this.replaceLinkNode(extraction_link_id_list[i] , old_copy1_id , new_copy1_id )
      }

      this.graph_container.graph.set(
        event_point_node_copy1.node_id,
        event_point_node_copy1
      );
      this.graph_container.graph.set(
        event_point_node_copy2.node_id,
        event_point_node_copy2
      );
      

    };

    let even_point_list = this.getEvenBranchPointID();

    while (even_point_list.length > 0) {
      const even_point_id = even_point_list[0];
      const extraction_link_id_list = extraction(even_point_id);
      separation(even_point_id, extraction_link_id_list);

      console.log("even_point_list",even_point_list)

      even_point_list = this.getEvenBranchPointID();
    }
  };

  loopLinePoint = (
    termination_point_branch_1: Array<string>,
    termination_point_branch_2: Array<string>
  ) => {
    const branch2node_id = termination_point_branch_2[0];
    const branch2node = this.graph_container.graph.get(branch2node_id);

    const branch2node_copy1 = _.cloneDeep(branch2node);
    const branch2node_copy2 = _.cloneDeep(branch2node);

    branch2node_copy1.bidirectional_link_id_list = [
      branch2node.bidirectional_link_id_list[0],
    ];
    branch2node_copy2.bidirectional_link_id_list = [
      branch2node.bidirectional_link_id_list[1],
    ];
    const old_copy2_id = branch2node_copy2.node_id;
    const new_copy2_id = old_copy2_id + "c";
    branch2node_copy2.node_id = new_copy2_id;

    this.graph_container.graph.set(
      branch2node_copy1.node_id,
      branch2node_copy1
    );
    this.graph_container.graph.set(
      branch2node_copy2.node_id,
      branch2node_copy2
    );

    this.replaceLinkNode(branch2node.bidirectional_link_id_list[1] , old_copy2_id,new_copy2_id )


    console.log(
      "環状閉路分割",
      branch2node_copy1,
      branch2node_copy2,
      old_copy2_id,
      new_copy2_id
    );
  };

  startCalc = () => {
    const node_keys = this.graph_container.graph.keys();
    const termination_point_branch_1 = this.getPointID(1);
    const termination_point_branch_2 = this.getPointID(2);

    this.intersectionExtraction()

    //大阪環状線のように、単一データでループする路線に終起点を強制的に生成する処理
    if (
      termination_point_branch_1.length == 0 &&
      termination_point_branch_2.length > 0
    ) {
      this.loopLinePoint(
        termination_point_branch_1,
        termination_point_branch_2
      );
    }

    const termination_point = this.getTerminationPointID();

    // const termination_even_point = this.getTerminationEvenPointID();

    console.log("termination_point", termination_point);

    this.graph_container.graph.forEach(function (node, key) {
      console.log(
        "termination_point -alllinks",
        key,
        node.bidirectional_link_id_list
      );
    });
    this.graph_container.graph.forEach(function (node, key) {
      if (node.bidirectional_link_id_list.length == 1) {
        console.log(
          "termination_point -graph1",
          key,
          node.bidirectional_link_id_list
        );
      }
    });
    this.graph_container.graph.forEach(function (node, key) {
      if (node.bidirectional_link_id_list.length >= 3) {
        console.log(
          "termination_point -graph3",
          key,
          node.bidirectional_link_id_list
        );
      }
    });

    // for (const key of node_keys) {
    //   this.node_path.pushNode(key, -1);
    // }

    console.log("termination_point", termination_point);
    for (let i = 0; i < termination_point.length; i++) {
      const termination_point_node_id = termination_point[i];
      const termination_point_node = this.graph_container.graph.get(
        termination_point_node_id
      );
      if (this.isValidNodePath(termination_point_node_id)) {
        continue;
      }
      const p_index = this.pushProcessedPos(
        termination_point_node_id,
        termination_point_node.x,
        termination_point_node.y
      );
      this.node_path.pushNode(termination_point_node_id, p_index);
      this.dfs(termination_point_node_id);
    }

    console.log("処理済みパス", this.processed_path.size, this.processed_path);
  };

  pushProcessed = () => {
    const g = new GraphCoordinateExpression("path");
    const path_id = this.processed_path.size;
    g.setCoordinateExpressionId(path_id);

    this.processed_path.set(path_id, g);
    return path_id;
  };
  pushProcessedPos = (node_id: string, x: number, y: number) => {
    const path_index = this.pushProcessed();
    const g = this.processed_path.get(path_index);
    g.pushCoordinateId(node_id, x, y);
    this.processed_path.set(path_index, g);
    return path_index;
  };

  pushCoordinateId = (
    path_index: number,
    node_id: string,
    x: number,
    y: number
  ) => {
    const g = this.processed_path.get(path_index);
    g.pushCoordinateId(node_id, x, y);
    this.processed_path.set(path_index, g);
  };

  popDfsStack = () => {
    const v = this.bfs_que[this.bfs_que.length - 1];
    this.bfs_que.pop();
    return v;
  };

  isValidNodePath = (node_id: string) => {
    return this.node_path.isValidNode(node_id);
  };

  dfs = (start_node_id: string) => {
    console.log(
      "幅優先探索",
      start_node_id,
      this.node_path,
      this.graph_container.graph
    );
    this.bfs_que = [];
    this.bfs_que.push(start_node_id);

    const start_node = this.graph_container.graph.get(start_node_id);
    const start_node_paths = this.node_path.getPaths(start_node_id);

    for (let start_node_path of start_node_paths) {
      this.pushCoordinateId(
        start_node_path,
        start_node_id,
        start_node.x,
        start_node.y
      );
    }

    console.log("termination_point -search start", start_node_id);

    while (this.bfs_que.length > 0) {
      const que_length = this.bfs_que.length;

      const current_node_id = this.popDfsStack();
      const current_node = this.graph_container.graph.get(current_node_id);
      const link_id_list = current_node.bidirectional_link_id_list;
      const link_id_list_length = link_id_list.length;
      const current_node_paths = this.node_path.getPaths(current_node_id);

      console.log(
        "termination_point -search",
        link_id_list_length,
        current_node_id,
        link_id_list
      );

      for (let j = 0; j < link_id_list_length; j++) {
        const nv_id = link_id_list[j];
        const nv_node = this.graph_container.graph.get(nv_id);

        if (this.node_path.otheGroupPath(current_node_id, nv_id)) {
          continue;
        }

        if (link_id_list_length >= 3) {
          const path_index = this.pushProcessedPos(
            current_node_id,
            current_node.x,
            current_node.y
          );
          this.pushCoordinateId(path_index, nv_id, nv_node.x, nv_node.y);
          this.node_path.pushNode(current_node_id, path_index);
          this.node_path.pushNode(nv_id, path_index);
        } else {
          for (let current_node_path of current_node_paths) {
            this.pushCoordinateId(
              current_node_path,
              nv_id,
              nv_node.x,
              nv_node.y
            );
            this.node_path.pushNode(nv_id, current_node_path);
          }
        }
        this.bfs_que.push(nv_id);
      }
    }
  };
  getTerminationPointID = (): Array<string> => {
    if (this.graph_container.graph.size == 0) {
      return;
    }

    let bn: Array<string> = [];
    let branch = 1;

    while (bn.length == 0) {
      bn = this.getPointID(branch);
      branch++;
    }

    return bn;
  };

  getOddBranchPointID = (): Array<string> => {
    const t_id: Array<string> = [];

    const itr_node_keys = this.graph_container.graph.keys();
    const node_keys = Array.from(itr_node_keys);

    for (let i = 0; i < node_keys.length; i++) {
      const node_key = node_keys[i];
      const node = this.graph_container.graph.get(node_key);
      if (
        node.bidirectional_link_id_list.length % 2 == 1 &&
        node.bidirectional_link_id_list.length >= 3
      ) {
        t_id.push(node_key);
        continue;
      }
    }

    return t_id;
  };

  getEvenBranchPointID = (): Array<string> => {
    const t_id: Array<string> = [];

    const itr_node_keys = this.graph_container.graph.keys();
    const node_keys = Array.from(itr_node_keys);

    for (let i = 0; i < node_keys.length; i++) {
      const node_key = node_keys[i];
      const node = this.graph_container.graph.get(node_key);
      if (
        node.bidirectional_link_id_list.length % 2 == 0 &&
        node.bidirectional_link_id_list.length >= 4
      ) {
        t_id.push(node_key);
        continue;
      }
    }

    return t_id;
  };

  getOddPointID = (): Array<string> => {
    const t_id: Array<string> = [];

    const itr_node_keys = this.graph_container.graph.keys();
    const node_keys = Array.from(itr_node_keys);

    for (let i = 0; i < node_keys.length; i++) {
      const node_key = node_keys[i];
      const node = this.graph_container.graph.get(node_key);
      if (node.bidirectional_link_id_list.length % 2 == 1) {
        t_id.push(node_key);
        continue;
      }
    }

    return t_id;
  };

  getEvenPointID = (): Array<string> => {
    const t_id: Array<string> = [];

    const itr_node_keys = this.graph_container.graph.keys();
    const node_keys = Array.from(itr_node_keys);

    for (let i = 0; i < node_keys.length; i++) {
      const node_key = node_keys[i];
      const node = this.graph_container.graph.get(node_key);
      if (node.bidirectional_link_id_list.length % 2 == 0) {
        t_id.push(node_key);
        continue;
      }
    }

    return t_id;
  };

  getPointID = (branch: number): Array<string> => {
    const t_id: Array<string> = [];

    const itr_node_keys = this.graph_container.graph.keys();
    const node_keys = Array.from(itr_node_keys);

    for (let i = 0; i < node_keys.length; i++) {
      const node_key = node_keys[i];
      const node = this.graph_container.graph.get(node_key);
      if (node.bidirectional_link_id_list.length == branch) {
        t_id.push(node_key);
        continue;
      }
    }

    return t_id;
  };
}

export default GraphCalculation;
