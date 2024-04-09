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
  };

  //ダイクストラ法に基づく、分岐点間の経路探索と各経路の距離決定
  extractionDijkstra = (graph_extraction_container: Graph, graph_next: Route, graph_route: Route, fixed_node_id: string) => {
    const dijkstra_que: Array<string> = [];
    const dijkstra_graph: Map<string, number> = new Map();

    const dequeqe = () => {
      const v = dijkstra_que[0];
      dijkstra_que.shift();
      return v;
    };
    const enqueqe = (d: string) => {
      const length = dijkstra_que.push(d);
      const index = length - 1;
      return index;
    };
    enqueqe(fixed_node_id);

    for (let grah_node_id of graph_extraction_container.graph.keys()) {
      dijkstra_graph.set(grah_node_id, Number.MAX_SAFE_INTEGER);
    }

    dijkstra_graph.set(fixed_node_id, 0);

    console.log("graph_extraction_container-dijkstra-a", fixed_node_id, dijkstra_que, dijkstra_graph);

    while (dijkstra_que.length > 0) {
      const current_id = dequeqe();
      const current_node = graph_extraction_container.graph.get(current_id);
      const link_id_list = current_node.bidirectional_link_id_list;

      for (let link_node_id of link_id_list) {
        if (current_id == link_node_id || fixed_node_id == link_node_id) {
          continue;
        }

        const link_contacts = graph_next.getPathContacts(current_id, link_node_id);

        for (let link_contact of link_contacts) {
          const calc_distance = link_contact.distance + dijkstra_graph.get(current_id);

          const graph_distance = dijkstra_graph.get(link_node_id);

          if (graph_distance > calc_distance) {
            dijkstra_graph.set(link_node_id, calc_distance);
            enqueqe(link_node_id);
          }
          const new_contact = new PathContact();
          new_contact.setDistance(calc_distance);
          new_contact.setCoordinateExpressionId(-3);

          if (graph_route.hasPathContact(fixed_node_id, current_id)) {
            const fixed_contact = graph_route.getMinPathContact(fixed_node_id, current_id);
            new_contact.includeRoute(fixed_contact);
            new_contact.includeArrivedNode(fixed_contact);

            if (fixed_contact.isArrivedNode(link_node_id)) {
              continue;
            }
          }
          new_contact.pushRoute(link_contact.coordinate_expression_id);
          new_contact.pushArrivedNode(link_node_id);

          graph_route.pushSemiRoute(fixed_node_id, link_node_id, new_contact);
        }

        continue;
      }
    }
    console.log("graph_extraction_container-dijkstra-z", fixed_node_id, dijkstra_que, dijkstra_graph, graph_next, graph_route);
    return graph_route;
  };
}

export default GraphOptimization;

//接続先が1もしくは3以上の場所を抽出する。
//抽出データの中でグラフを構築する
//幅優先探索をするその際、経路と距離を保持する
