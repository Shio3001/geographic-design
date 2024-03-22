import EditData from "../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo } from "../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../gis_scipt/gis_unique_data";

import SvgKit from "../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../parser/sgml_kit/svg_kit/svg_node";

import GraphNode from "./graph_node";
import Graph from "./graph";
import GraphCoordinateExpression from "./expression/coordinate_expression";
import GraphCalculationNodePath from "./graph_calculation_node_path";
import PathContact from "./expression/path_contact";

import { TypeGraphRoute, TypeGraphRouteNode } from "./expression/graph_type";

class Route {
  route: TypeGraphRoute;

  constructor() {
    this.route = new Map();
  }

  getTerminal = () => {
    const branch_ids = [];

    for (let outside_node_id of this.route.keys()) {
      const outside_node = this.route.get(outside_node_id);
      if (outside_node.size == 1) {
        branch_ids.push(outside_node_id);
      }
    }

    return branch_ids;
  };

  getBranchNodes = () => {
    const branch_ids = [];

    for (let outside_node_id of this.route.keys()) {
      const outside_node = this.route.get(outside_node_id);
      if (outside_node.size >= 3) {
        branch_ids.push(outside_node_id);
      }
    }

    return branch_ids;
  };

  getNodeKeys = () => {
    return this.route.keys();
  };

  getNodeKeysList = () => {
    return Array.from(this.route.keys());
  };

  getPathContacts = (node_id_1: string, node_id_2: string) => {
    if (!this.route.has(node_id_1)) {
      return [];
    }

    const node_1 = this.route.get(node_id_1);
    if (!node_1.has(node_id_2)) {
      return [];
    }

    return node_1.get(node_id_2);
  };

  hasPathContact = (node_id_1: string, node_id_2: string) => {
    if (!this.route.has(node_id_1)) {
      return false;
    }
    const node_1 = this.route.get(node_id_1);
    if (!node_1.has(node_id_2)) {
      return false;
    }
    const node_1_2 = node_1.get(node_id_2);

    if (node_1_2.length == 0) {
      return false;
    }
    return true;
  };

  getPathContact = (node_id_1: string, node_id_2: string) => {
    const node_1 = this.route.get(node_id_1);
    const path_contacts = node_1.get(node_id_2);
    return path_contacts[0];
  };

  getMinPathContact = (node_id_1: string, node_id_2: string) => {
    const node_1 = this.route.get(node_id_1);
    const path_contacts = node_1.get(node_id_2);

    let min_distance = Number.MAX_SAFE_INTEGER;
    let min_path_contact;
    for (let i = 0; i < path_contacts.length; i++) {
      if (min_distance > path_contacts[i].distance) {
        min_path_contact = path_contacts[i];
      }
    }

    return min_path_contact;
  };

  buildNextPaths = (nodes: Array<string>) => {
    for (let node1_id of nodes) {
      const new_map_a: TypeGraphRouteNode = new Map();
      for (let node2_id of nodes) {
        if (node1_id != node2_id) {
          new_map_a.set(node2_id, []);
        }
      }
      this.route.set(node1_id, new_map_a);
    }
  };

  buildPaths = (nodes: Array<string>) => {
    const nodes_length = nodes.length;
    for (let i = 0; i < nodes_length; i++) {
      const node_id_1 = nodes[i];
      const new_map_a: TypeGraphRouteNode = new Map();
      for (let j = 0; j < nodes_length; j++) {
        const node_id_2 = nodes[j];
        if (i == j) {
          const dummy_path = new PathContact();
          dummy_path.setDistance(-1);
          dummy_path.coordinate_expression_id = -2;
          new_map_a.set(node_id_2, [dummy_path]);
          continue;
        }
        new_map_a.set(node_id_2, []);
      }
      this.route.set(node_id_1, new_map_a);
    }
  };
  pushSemiRoute = (node_id_1: string, node_id_2: string, path_contact: PathContact) => {
    if (!this.route.has(node_id_1)) {
      const new_map: TypeGraphRouteNode = new Map();
      this.route.set(node_id_1, new_map);
    }

    const node_1 = this.route.get(node_id_1);
    if (!node_1.has(node_id_2)) {
      const new_arr: Array<PathContact> = [];
      node_1.set(node_id_2, new_arr);
    }

    const node_1_2 = node_1.get(node_id_2);

    node_1_2.push(path_contact);

    node_1.set(node_id_2, node_1_2);

    this.route.set(node_id_1, node_1);
  };

  pushRoute = (node_id_1: string, node_id_2: string, path_contact: PathContact) => {
    console.log("pushRoute", node_id_1, node_id_2, this.route);

    if (!this.route.has(node_id_1)) {
      const new_map: TypeGraphRouteNode = new Map();
      this.route.set(node_id_1, new_map);
    }
    if (!this.route.has(node_id_2)) {
      const new_map: TypeGraphRouteNode = new Map();
      this.route.set(node_id_2, new_map);
    }

    const node_1 = this.route.get(node_id_1);
    const node_2 = this.route.get(node_id_2);

    if (!node_1.has(node_id_2)) {
      const new_arr: Array<PathContact> = [];
      node_1.set(node_id_2, new_arr);
    }

    if (!node_2.has(node_id_1)) {
      const new_arr: Array<PathContact> = [];
      node_2.set(node_id_1, new_arr);
    }

    const node_1_2 = node_1.get(node_id_2);
    const node_2_2 = node_2.get(node_id_1);

    node_1_2.push(path_contact);
    node_2_2.push(path_contact);

    node_1.set(node_id_2, node_1_2);
    node_2.set(node_id_1, node_2_2);

    this.route.set(node_id_1, node_1);
    this.route.set(node_id_2, node_2);
  };

  pushRoutes = (node_id_1: string, node_id_2: string, path_contacts: Array<PathContact>) => {
    for (let path_contact of path_contacts) {
      this.pushRoute(node_id_1, node_id_2, path_contact);
    }
  };
}

class GraphOptimization {
  graph_container: Graph;
  graph_extraction_container: Graph;
  graph_next: Route;
  graph_route: Route;
  processed_path: Map<number, GraphCoordinateExpression>;
  terminal_node_id_list: Array<string>;

  constructor(graph_container: Graph, processed_path: Map<number, GraphCoordinateExpression>) {
    this.graph_container = graph_container;
    this.processed_path = processed_path;
    this.graph_extraction_container = new Graph();
    this.graph_next = new Route();
    this.graph_route = new Route();
    this.terminal_node_id_list = this.getTerminalNode();
  }

  getTerminalNode = () => {
    const keys = this.graph_container.graph.keys();
    const nodes: Array<string> = [];

    const pushNode = (n_id: string) => {
      if (nodes.includes(n_id)) {
        return;
      }
      nodes.push(n_id);
    };

    for (let path of this.processed_path.values()) {
      const f_id = path.getFirstNodeId();
      const l_id = path.getLastNodeId();

      pushNode(f_id);
      pushNode(l_id);
    }
    return nodes;
  };

  generateGraphExtraction = () => {
    // this.graph_route.buildNextPaths(this.terminal_node_id_list);
    console.log("graph_extraction_container-sta", this.graph_extraction_container, this.processed_path);

    for (let path of this.processed_path.values()) {
      const d = path.getDistance();
      const f_id = path.getFirstNodeId();
      const l_id = path.getLastNodeId();

      const f_node = this.graph_container.graph.get(f_id);
      const l_node = this.graph_container.graph.get(l_id);

      const pc = new PathContact();
      pc.setDistance(d);
      pc.pushRoute(path.coordinate_expression_id);
      pc.setCoordinateExpressionId(path.coordinate_expression_id);

      const new_f_node = new GraphNode();
      new_f_node.setPos(f_node.x, f_node.y);
      new_f_node.setId(f_id);
      this.graph_extraction_container.pushNode(new_f_node);

      const new_l_node = new GraphNode();
      new_l_node.setPos(l_node.x, l_node.y);
      new_l_node.setId(l_id);

      new_l_node.pushBidirectionalLinkNode(f_id);
      this.graph_extraction_container.pushNode(new_l_node);

      this.graph_next.pushRoute(f_id, l_id, pc);
    }

    console.log("graph_extraction_container-setup", this.graph_extraction_container);

    for (let node_key of this.graph_extraction_container.graph.keys()) {
      console.log("graph_extraction_container-s", node_key, this.graph_extraction_container.graph);
      this.extractionDijkstra(node_key);
    }

    console.log("graph_extraction_container-end", this.graph_extraction_container);
  };

  //ダイクストラ法に基づく、分岐点間の経路探索と各経路の距離決定
  extractionDijkstra = (fixed_node_id: string) => {
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

    for (let grah_node_id of this.graph_extraction_container.graph.keys()) {
      dijkstra_graph.set(grah_node_id, Number.MAX_SAFE_INTEGER);
    }

    dijkstra_graph.set(fixed_node_id, 0);

    const fixed_node = this.graph_extraction_container.graph.get(fixed_node_id);
    console.log("graph_extraction_container-dijkstra-a", fixed_node_id, dijkstra_que, dijkstra_graph);

    while (dijkstra_que.length > 0) {
      const current_id = dequeqe();
      const current_node = this.graph_extraction_container.graph.get(current_id);
      const link_id_list = current_node.bidirectional_link_id_list;

      for (let link_node_id of link_id_list) {
        if (current_id == link_node_id || fixed_node_id == link_node_id) {
          continue;
        }

        const link_node = this.graph_extraction_container.graph.get(link_node_id);
        const link_contact = this.graph_next.getPathContact(current_id, link_node_id);

        const calc_distance = link_contact.distance + dijkstra_graph.get(current_id);

        const graph_distance = dijkstra_graph.get(link_node_id);

        if (graph_distance >= calc_distance) {
          dijkstra_graph.set(link_node_id, calc_distance);
          enqueqe(link_node_id);
        }
        const new_contact = new PathContact();
        new_contact.setDistance(calc_distance);
        new_contact.setCoordinateExpressionId(-3);

        if (this.graph_route.hasPathContact(fixed_node_id, current_id)) {
          const fixed_contact = this.graph_route.getMinPathContact(fixed_node_id, current_id);
          new_contact.includeRoute(fixed_contact);
          new_contact.includeArrivedNode(fixed_contact);

          if (fixed_contact.isArrivedNode(link_node_id)) {
            continue;
          }
        }
        new_contact.pushRoute(link_contact.coordinate_expression_id);
        new_contact.pushArrivedNode(link_node_id);

        this.graph_route.pushSemiRoute(fixed_node_id, link_node_id, new_contact);
        continue;
      }
    }
    console.log("graph_extraction_container-dijkstra-z", fixed_node_id, dijkstra_que, dijkstra_graph, this.graph_next, this.graph_route);
  };
}

export default GraphOptimization;

//接続先が1もしくは3以上の場所を抽出する。
//抽出データの中でグラフを構築する
//幅優先探索をするその際、経路と距離を保持する
