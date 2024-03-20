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

class PathContact {
  distance: number;
  routes: Array<number>;

  constructor() {
    this.distance = -1;
    this.routes = [];
  }

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

      const pc = new PathContact();
      pc.setDistance(d);
      pc.pushRoute(path.coordinate_expression_id);

      this.graph_extraction_container.pushRoute(f_id, l_id, pc);
    }

    console.log("graph_extraction_container-end", this.graph_extraction_container);

    // for (let node_id of this.terminal_node_id_list) {
    //   //   this.extractionDijkstra(node_id);
    //   //   const new_g_node = new GraphNode();
    //   //   this.graph_extraction_container.pushNode(new_g_node);
    // }
  };

  extractionDijkstra = (start_node: string) => {
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
    enqueqe(start_node);
    while (dijkstra_que.length > 0) {
      const v = dequeqe();

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
