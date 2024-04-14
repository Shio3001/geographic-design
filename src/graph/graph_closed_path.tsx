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
import { TypeGraphRoute, TypeGraphRouteNode, TypePathIndex } from "./expression/graph_type";
import PathContact from "./expression/path_contact";
import ProcessPath from "./expression/process_path";
import Route from "./expression/route";
import { copyObject } from "./../definition";
import SharpAngleRemoval from "./sharp_angle_removal";
import _ from "lodash";

class GraphClosedPath {
  keep_paths: Array<PathContact>;
  sharp_angle_removal_flag: boolean;
  long: boolean;
  sharp_angle_cash: Map<number, boolean>;
  constructor(sharp_angle_removal_flag: boolean, long: boolean) {
    this.keep_paths = [];
    this.sharp_angle_removal_flag = sharp_angle_removal_flag;
    this.long = long;
    this.sharp_angle_cash = new Map();
    console.log("GraphClosedPath");
  }

  checkDistance = (a_d: number, b_d: number) => {
    if (this.long) {
      return a_d > b_d;
    }
    return a_d < b_d;
  };

  extractionDetermination = (
    graph_extraction_container: Graph,
    graph_next: Route,
    processed_path: ProcessPath,
    fixed_node_id: string,
    target_node_id: string
  ) => {
    let rv_path: PathContact = null;
    let sharp_path: PathContact = null;

    const getSharpAngleCashKey = (last3: Array<number>) => {
      const key = last3[0] * 100000000 + last3[1] * 10000 + last3[2];
      return key;
    };

    const pushSharpAngleCash = (last3: Array<number>, is_sharp: boolean) => {
      this.sharp_angle_cash.set(getSharpAngleCashKey(last3), is_sharp);
    };
    const hasSharpAngleCash = (last3: Array<number>) => {
      return this.sharp_angle_cash.has(getSharpAngleCashKey(last3));
    };
    const getSharpAngleCash = (last3: Array<number>) => {
      return this.sharp_angle_cash.get(getSharpAngleCashKey(last3));
    };

    const checkSharp = (trace_route: Array<number>) => {
      if (trace_route.length < 3) {
        return false;
      }

      const last3 = [trace_route[trace_route.length - 3], trace_route[trace_route.length - 2], trace_route[trace_route.length - 1]];

      if (hasSharpAngleCash(last3)) {
        return getSharpAngleCash(last3);
      }

      const sharp_angle_removal = new SharpAngleRemoval();
      let p = sharp_angle_removal.hasProcessSharpAngleRemovalPath(last3, processed_path);
      // if (p) {
      //   console.log(last3, this.sharp_angle_cash.size);
      // }

      pushSharpAngleCash(last3, p);
      return p;
    };

    const recursion = (trace_node: Array<string>, trace_route: Array<number>, distance: number, recursion_sharp_angle_removal: boolean) => {
      const recursion_node_id = trace_node[trace_node.length - 1];
      const recursion_node = graph_extraction_container.graph.get(recursion_node_id);
      const b_link_list = recursion_node.bidirectional_link_id_list;

      console.log(trace_route);

      if (trace_node.length < 2) {
        for (let b_link of b_link_list) {
          const first_route_paths = graph_next.getPathContacts(recursion_node_id, b_link);
          for (let first_route_path of first_route_paths) {
            const cp_trace_node = trace_node;
            cp_trace_node.push(b_link);

            const cp_trace_route = trace_route;
            cp_trace_route.push(first_route_path.coordinate_expression_id);

            recursion(cp_trace_node, cp_trace_route, first_route_path.distance, recursion_sharp_angle_removal);

            cp_trace_node.pop();
            cp_trace_route.pop();
          }
        }
        return;
      }

      if (target_node_id == recursion_node_id) {
        if (rv_path == null || this.checkDistance(distance, rv_path.distance)) {
          const new_path = new PathContact();
          new_path.setCoordinateExpressionId(-3);
          new_path.setDistance(distance);
          new_path.pushRoutes(trace_route);

          rv_path = new_path;
        }
        if (recursion_sharp_angle_removal) {
          if (checkSharp(trace_route)) {
            recursion_sharp_angle_removal = false;
          } else {
            if (sharp_path == null || this.checkDistance(distance, sharp_path.distance)) {
              const new_path = new PathContact();
              new_path.setCoordinateExpressionId(-3);
              new_path.setDistance(distance);
              new_path.pushRoutes(trace_route);

              sharp_path = new_path;
            }
          }
        }

        //最短距離経路検索ならこれ以上深くにいく必要はないので、戻る
        if (!this.long) {
          return;
        }
      }

      if (target_node_id != recursion_node_id && recursion_sharp_angle_removal) {
        if (checkSharp(trace_route)) {
          recursion_sharp_angle_removal = false;
        }
      }

      const r = trace_node.filter((element, index) => element == trace_node[trace_node.length - 1] && index < trace_node.length - 1);
      if (r.length > 0) {
        return;
      }

      for (let b_link of b_link_list) {
        const current_route_paths = graph_next.getPathContacts(recursion_node_id, b_link);

        for (let current_route_path of current_route_paths) {
          if (trace_route.includes(current_route_path.coordinate_expression_id)) {
            continue;
          }

          let cp_trace_node = trace_node;
          cp_trace_node.push(b_link);

          let cp_trace_route = trace_route;
          cp_trace_route.push(current_route_path.coordinate_expression_id);

          const new_distance = distance + current_route_path.distance;
          recursion(cp_trace_node, cp_trace_route, new_distance, recursion_sharp_angle_removal);

          cp_trace_node.pop();
          cp_trace_route.pop();
        }
      }
    };

    recursion([fixed_node_id], [], 0, this.sharp_angle_removal_flag);

    console.log("extractionDetermination", fixed_node_id, target_node_id, this.sharp_angle_removal_flag, _.cloneDeep(rv_path), _.cloneDeep(sharp_path));

    // if (this.sharp_angle_removal_flag) {
    //   return sharp_path;
    // }
    if (this.sharp_angle_removal_flag && sharp_path != null) {
      return sharp_path;
    }
    return rv_path;
  };

  //最長距離優先(切り捨て破棄)
  searchDeleteClosedPath = (terminal_nodes: Array<string>, processed_path: ProcessPath, graph_extraction_container: Graph, graph_next: Route) => {
    // let delete_candidacy_path_ids: Array<PathContact> = [];
    let keep_path_ids: Array<PathContact> = [];
    for (let i = 0; i < terminal_nodes.length; i++) {
      const i_id = terminal_nodes[i];
      for (let j = i + 1; j < terminal_nodes.length; j++) {
        const j_id = terminal_nodes[j];
        const path = this.extractionDetermination(graph_extraction_container, graph_next, processed_path, i_id, j_id);

        if (path == null) {
          continue;
        }

        keep_path_ids.push(path);
      }

      this.keep_paths = this.keep_paths.concat(keep_path_ids);
    }
  };
  deleteClosedPath = (processed_path: ProcessPath) => {
    const getKeepRoutes = () => {
      let arr: Array<number> = [];

      for (let keep_path of this.keep_paths) {
        arr = arr.concat(keep_path.routes);
      }

      return arr;
    };
    const keep_routes = getKeepRoutes();

    for (let delete_path of processed_path.path.values()) {
      if (keep_routes.includes(delete_path.coordinate_expression_id)) {
        continue;
      }

      processed_path.path.delete(delete_path.coordinate_expression_id);
    }

    return processed_path;

    // const new_processed_path = this.graph_optimization.processed_path.filter((element, index) => !delete_path_ids.includes(index));
  };
}

export default GraphClosedPath;
