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
import { link } from "fs";

class PathContact {
  distance: number;
  routes: Array<number>;
  coordinate_expression_id: number;

  constructor() {
    this.distance = -1;
    this.routes = [];
    this.coordinate_expression_id = -1; //基本的に-1 ただし、デフォルトパスはcoordinate_expression_idが挿入
  }

  setCoordinateExpressionId = (id: number) => {
    this.coordinate_expression_id = id;
  };

  getCoordinateExpressionId = () => {
    return this.coordinate_expression_id;
  };
  hasCoordinateExpressionId = () => {
    return this.coordinate_expression_id >= 0;
  };

  includeRoute = (include_path_contact: PathContact) => {
    this.routes = include_path_contact.routes.concat(this.routes);
  };

  pushRoute = (route: number) => {
    this.routes.push(route);
  };
  setDistance = (dis: number) => {
    this.distance = dis;
  };
}

type TypeGraphRouteNode = Map<string, Array<PathContact>>;
type TypeGraphRoute = Map<string, TypeGraphRouteNode>;
class GraphRoute extends Graph {
  route: TypeGraphRoute;

  constructor() {
    super();
    this.route = new Map();
  }

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

  getMinPathContact = (node_id_1: string, node_id_2: string) => {
    const node_1 = this.route.get(node_id_1);
    const path_contacts = node_1.get(node_id_2);

    let min_path_contact = path_contacts[0];
    for (let i = 1; i < path_contacts.length; i++) {
      if (min_path_contact.distance > path_contacts[i].distance) {
        min_path_contact = path_contacts[i];
      }
    }

    return min_path_contact;
  };

  buildPaths = (nodes: Array<string>) => {
    const nodes_length = nodes.length;
    for (let i = 0; i < nodes_length; i++) {
      const node_id_1 = nodes[i];
      const new_map_a: TypeGraphRouteNode = new Map();
      for (let j = 0; j < nodes_length; j++) {
        if (i == j) {
          continue;
        }

        const node_id_2 = nodes[j];
        new_map_a.set(node_id_2, []);
      }
      this.route.set(node_id_1, new_map_a);
    }
  };
  pushSemiRoute = (node_id_1: string, node_id_2: string, path_contact: PathContact) => {
    const node_1 = this.route.get(node_id_1);
    const node_1_2 = node_1.get(node_id_2);

    node_1_2.push(path_contact);

    node_1.set(node_id_2, node_1_2);

    this.route.set(node_id_1, node_1);
  };

  pushRoute = (node_id_1: string, node_id_2: string, path_contact: PathContact) => {
    console.log("pushRoute", node_id_1, node_id_2, this.route);

    const node_1 = this.route.get(node_id_1);
    const node_1_2 = node_1.get(node_id_2);
    const node_2 = this.route.get(node_id_2);
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
  graph_extraction_container: GraphRoute;
  processed_path: Array<GraphCoordinateExpression>;
  terminal_node_id_list: Array<string>;

  constructor(graph_container: Graph, processed_path: Array<GraphCoordinateExpression>) {
    this.graph_container = graph_container;
    this.processed_path = processed_path;
    this.graph_extraction_container = new GraphRoute();
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

    for (let path of this.processed_path) {
      const f_id = path.getFirstNodeId();
      const l_id = path.getLastNodeId();

      pushNode(f_id);
      pushNode(l_id);
    }
    return nodes;
  };

  generateGraphExtraction = () => {
    this.graph_extraction_container.buildPaths(this.terminal_node_id_list);
    console.log("graph_extraction_container-sta", this.graph_extraction_container, this.processed_path);

    for (let path of this.processed_path) {
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

      this.graph_extraction_container.pushRoute(f_id, l_id, pc);
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

    const fixed_node = this.graph_extraction_container.graph.get(fixed_node_id);

    // for (let fixed_node_link_id of fixed_node.bidirectional_link_id_list) {
    //   enqueqe(fixed_node_link_id);
    // }

    enqueqe(fixed_node_id);

    // const fixed_node = this.graph_extraction_container.route.get(fixed_node_id);
    console.log("graph_extraction_container-dijkstra-a", fixed_node_id, dijkstra_que);

    while (dijkstra_que.length > 0) {
      const current_id = dequeqe();
      const current_node = this.graph_extraction_container.graph.get(current_id);
      const link_id_list = current_node.bidirectional_link_id_list;

      console.log("graph_extraction_container-dijkstra-b", fixed_node_id, current_id);

      if (fixed_node_id == current_id) {
        for (let link_node_id of link_id_list) {
          enqueqe(link_node_id);
        }
        continue;
      }

      const current_route_node = this.graph_extraction_container.getMinPathContact(fixed_node_id, current_id);

      for (let link_node_id of link_id_list) {
        if (fixed_node_id == link_node_id) {
          continue;
        }

        // const link_node = this.graph_extraction_container.graph.get(link_node_id);
        const paths_fixed_link = this.graph_extraction_container.getPathContacts(fixed_node_id, link_node_id);
        const path_current_link = this.graph_extraction_container.getMinPathContact(current_id, link_node_id);

        const distance = current_route_node.distance + path_current_link.distance;
        console.log("graph_extraction_container-dijkstra-c", fixed_node_id, current_id, link_node_id);

        //次の場所がまだ未探索
        if (paths_fixed_link.length == 0) {
          const new_path_contact = new PathContact();
          new_path_contact.setDistance(distance);
          new_path_contact.pushRoute(path_current_link.getCoordinateExpressionId());

          new_path_contact.includeRoute(current_route_node);

          this.graph_extraction_container.pushSemiRoute(fixed_node_id, link_node_id, new_path_contact);
          enqueqe(link_node_id);
          continue;
        }
        const path_min_fixed_link = this.graph_extraction_container.getMinPathContact(fixed_node_id, link_node_id);

        if (path_min_fixed_link.distance < distance) {
          const new_path_contact = new PathContact();
          new_path_contact.setDistance(distance);
          new_path_contact.pushRoute(path_current_link.getCoordinateExpressionId());
          new_path_contact.includeRoute(current_route_node);

          this.graph_extraction_container.pushSemiRoute(fixed_node_id, link_node_id, new_path_contact);
          continue;
        }

        if (path_min_fixed_link.distance >= distance) {
          const new_path_contact = new PathContact();
          new_path_contact.setDistance(distance);
          new_path_contact.pushRoute(path_current_link.getCoordinateExpressionId());

          new_path_contact.includeRoute(current_route_node);

          this.graph_extraction_container.pushSemiRoute(fixed_node_id, link_node_id, new_path_contact);
          enqueqe(link_node_id);
          continue;
        }
      }

      //   if (this.terminal_node_id_list.includes(v)) {
      //     const np = new PathContact();
      //     np.distance();
      //     path_contacts.push();
      //   } else {
      //     grah_distance.set();
      //   }
    }
  };
}

export default GraphOptimization;

//接続先が1もしくは3以上の場所を抽出する。
//抽出データの中でグラフを構築する
//幅優先探索をするその際、経路と距離を保持する
