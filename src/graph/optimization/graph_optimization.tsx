import EditData from "../../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo } from "../../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../../gis_scipt/gis_unique_data";

import SvgKit from "../../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../../parser/sgml_kit/svg_kit/svg_node";

import GraphNode from "../expression/graph_node";
import Graph from "../expression/graph";
import GraphCoordinateExpression from "../expression/coordinate_expression";
import GraphCalculationNodePath from "../graph_calculation_node_path";
import PathContact from "../expression/path_contact";

import { TypeGraphRoute, TypeGraphRouteNode } from "../expression/graph_type";
import ProcessPath from "../expression/process_path";
import Route from "../expression/route";

class GraphOptimization {
  // graph_container: Graph;
  // graph_extraction_container: Graph;

  //複数ルート構築用データ格納場所
  // graph_next: Route;

  //複数ルート決定後データ格納場所
  // graph_route: Route;

  // processed_path: ProcessPath;

  constructor() {
    // this.graph_container = graph_container;
    // this.processed_path = processed_path;
    // this.graph_extraction_container = new Graph();
    // this.graph_next = new Route();
    // this.graph_route = new Route();
  }

  generateNext = (processed_path: ProcessPath) => {
    const graph_next = new Route();
    console.log("graph_route-start", processed_path);
    for (let path of processed_path.path.values()) {
      const d = path.getDistance();
      const f_id = path.getFirstNodeId();
      const l_id = path.getLastNodeId();

      const pc = new PathContact();
      pc.setDistance(d);
      pc.pushRoute(path.coordinate_expression_id);
      pc.setCoordinateExpressionId(path.coordinate_expression_id);

      graph_next.pushRoute(f_id, l_id, pc);
    }
    console.log("generate_graph - generateNext", processed_path, graph_next);

    return graph_next;
  };

  generateRouteHalf = (graph_extraction_container: Graph, graph_next: Route, node_key: string) => {
    let graph_route = new Route();
    // for (let node_key of graph_extraction_container.graph.keys()) {
    graph_route = this.extractionDijkstra(graph_extraction_container, graph_next, graph_route, node_key);
    // }

    console.log("generate_graph - generateRouteHalf", graph_route);
    return graph_route;
  };

  generateRoute = (graph_extraction_container: Graph, graph_next: Route) => {
    let graph_route = new Route();
    for (let node_key of graph_extraction_container.graph.keys()) {
      graph_route = this.extractionDijkstra(graph_extraction_container, graph_next, graph_route, node_key);
    }

    console.log("generate_graph - generateRoute", graph_route);
    return graph_route;
  };

  generateGraphExtraction = (graph_container: Graph, processed_path: ProcessPath) => {
    const graph_extraction_container = new Graph();
    // this.graph_route.buildNextPaths(this.terminal_node_id_list);
    console.log("graph_extraction_container-sta", graph_extraction_container, processed_path);

    for (let path of processed_path.path.values()) {
      const d = path.getDistance();
      const f_id = path.getFirstNodeId();
      const l_id = path.getLastNodeId();

      const f_node = graph_container.graph.get(f_id);
      const l_node = graph_container.graph.get(l_id);

      const new_f_node = new GraphNode();
      new_f_node.setPos(f_node.x, f_node.y);
      new_f_node.setId(f_id);
      graph_extraction_container.pushNode(new_f_node);

      const new_l_node = new GraphNode();
      new_l_node.setPos(l_node.x, l_node.y);
      new_l_node.setId(l_id);

      new_l_node.pushBidirectionalLinkNode(f_id);
      graph_extraction_container.pushNode(new_l_node);
    }
    console.log("generate_graph - generateGraphExtraction", graph_extraction_container);

    return graph_extraction_container;
  }; //ダイクストラ法に基づく、分岐点間の経路探索と各経路の距離決定

  //ダイクストラ法に基づく、分岐点間の経路探索と各経路の距離決定
  extractionDijkstra = (graph_extraction_container: Graph, graph_next: Route, graph_route: Route, fixed_node_id: string) => {
    const recursion = (trace_node: Array<string>, trace_route: Array<number>, distance: number) => {
      const recursion_node_id = trace_node[trace_node.length - 1];
      const recursion_node = graph_extraction_container.graph.get(recursion_node_id);
      const b_link_list = recursion_node.bidirectional_link_id_list;

      if (trace_node.length < 2) {
        for (let b_link of b_link_list) {
          const first_route_paths = graph_next.getPathContacts(recursion_node_id, b_link);
          for (let first_route_path of first_route_paths) {
            const cp_trace_node = trace_node;
            cp_trace_node.push(b_link);

            const cp_trace_route = trace_route;
            cp_trace_route.push(first_route_path.coordinate_expression_id);

            recursion(cp_trace_node, cp_trace_route, first_route_path.distance);

            cp_trace_node.pop();
            cp_trace_route.pop();
          }
        }
        return;
      }

      const last_trace_node = trace_node[trace_node.length - 2];

      const new_path = new PathContact();
      new_path.setCoordinateExpressionId(-3);
      new_path.setDistance(distance);
      new_path.pushRoutes(trace_route);
      graph_route.pushSemiRoute(fixed_node_id, recursion_node_id, new_path);

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
          recursion(cp_trace_node, cp_trace_route, new_distance);

          cp_trace_node.pop();
          cp_trace_route.pop();
        }
      }
    };

    recursion([fixed_node_id], [], 0);

    return graph_route;
  };
}

export default GraphOptimization;

//接続先が1もしくは3以上の場所を抽出する。
//抽出データの中でグラフを構築する
//幅優先探索をするその際、経路と距離を保持する
