import exp from "constants";

class PathContact {
  distance: number;
  routes: Array<number>;
  coordinate_expression_id: number;
  arrived_nodes: Array<string>;

  constructor() {
    this.distance = -1;
    this.routes = [];
    this.coordinate_expression_id = -1; //基本的に-1 ただし、デフォルトパスはcoordinate_expression_idが挿入
    this.arrived_nodes = [];
  }

  pushArrivedNode = (node: string) => {
    this.arrived_nodes.push(node);
  };

  isArrivedNode = (node: string) => {
    return this.arrived_nodes.includes(node);
  };

  includeArrivedNode = (pc: PathContact) => {
    let arr: Array<string> = [];
    arr = arr.concat(this.arrived_nodes);
    arr = arr.concat(pc.arrived_nodes);
    this.arrived_nodes = arr;
  };

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
    let arr: Array<number> = [];
    arr = arr.concat(this.routes);
    arr = arr.concat(include_path_contact.routes);

    this.routes = arr;
  };

  replaceRoute = (routes: Array<number>) => {
    this.routes = [];
    this.routes = this.routes.concat(routes);
  };

  pushRoute = (route: number) => {
    this.routes.push(route);
  };
  pushRoutes = (routes: Array<number>) => {
    for (let route of routes) {
      this.routes.push(route);
    }
  };
  setDistance = (dis: number) => {
    this.distance = dis;
  };
}

export default PathContact;
