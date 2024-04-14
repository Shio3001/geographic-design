import { TypeGraphRoute, TypeGraphRouteNode } from "./../expression/graph_type";

import PathContact from "./path_contact";

class Route {
  route: TypeGraphRoute;

  constructor() {
    this.route = new Map();
  }

  getOddBranch = () => {
    const branch_ids = [];

    for (let outside_node_id of this.route.keys()) {
      const outside_node = this.route.get(outside_node_id);
      if (outside_node.size % 2 == 1) {
        branch_ids.push(outside_node_id);
      }
    }

    return branch_ids;
  };

  getBranch = (branch: number) => {
    const branch_ids = [];

    for (let outside_node_id of this.route.keys()) {
      const outside_node = this.route.get(outside_node_id);
      if (outside_node.size == branch) {
        branch_ids.push(outside_node_id);
      }
    }

    return branch_ids;
  };

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

  getSortPathContact = (sortMode: boolean, node_id_1: string, node_id_2: string) => {
    //sortMode
    //  falseになると昇順ソート
    //  trueにすると降順ソート

    if (!this.route.has(node_id_1)) {
      return [];
    }

    const node_1 = this.route.get(node_id_1);
    if (!node_1.has(node_id_2)) {
      return [];
    }

    let A: number;
    let B: number;

    const path_contacts = node_1.get(node_id_2);

    if (sortMode) {
      //降順ソート
      A = -1;
      B = 1;
    } else {
      //昇順ソート
      A = 1;
      B = -1;
    }

    path_contacts.sort(function (first, second) {
      const Fn = first;
      const Sn = second;
      if (Fn.distance > Sn.distance) {
        return A;
      } else if (Fn.distance < Sn.distance) {
        return B;
      } else {
        return 0;
      }
    });

    console.log("getAllSortPathContact", path_contacts);
    return path_contacts;
  };

  getAllSortPathContact = (sortMode: boolean) => {
    //sortMode
    //  falseになると昇順ソート
    //  trueにすると降順ソート

    let A: number;
    let B: number;

    const path_contacts = this.getAllPathContact();

    if (sortMode) {
      //降順ソート
      A = -1;
      B = 1;
    } else {
      //昇順ソート
      A = 1;
      B = -1;
    }

    path_contacts.sort(function (first, second) {
      const Fn = first;
      const Sn = second;
      if (Fn.distance > Sn.distance) {
        return A;
      } else if (Fn.distance < Sn.distance) {
        return B;
      } else {
        return 0;
      }
    });

    return path_contacts;
  };

  getAllPathContact = () => {
    let path_contacts: Array<PathContact> = [];

    for (let outside_node_id of this.route.keys()) {
      const outside_node = this.route.get(outside_node_id);
      for (let inside_node_id of outside_node.keys()) {
        const path_c = outside_node.get(inside_node_id);
        path_contacts = path_contacts.concat(path_c);
      }
    }

    return path_contacts;
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

export default Route;
