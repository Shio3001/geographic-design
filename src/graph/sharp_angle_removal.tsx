import GraphPathJoin from "./graph_join";
import ProcessPath from "./expression/process_path";
import Route from "./expression/route";
import Graph from "./expression/graph";

import GraphNode from "./expression/graph_node";
import { copyObject } from "./../definition";

import { TypePosition } from "./../gis_scipt/route_type";
import * as _ from "lodash"; // lodashをインポート
import { caclcAngleByPosition, calcPythagorean, calcPythagoreanSquare, calcCenterGravity, radian90 } from "../mathematical/dimension_two";

class SharpAngleRemoval {
  graph_route: Route;
  grah_paths: ProcessPath;

  constructor(graph_route: Route, grah_paths: ProcessPath) {
    this.graph_route = graph_route;
    this.grah_paths = grah_paths;
    console.log(
      "sharp_angle_removal_hold -constructor",
      graph_route,
      _.cloneDeep(graph_route),
      this.graph_route,
      grah_paths,
      _.cloneDeep(grah_paths),
      this.grah_paths
    );
  }

  process_sharp_angle_removal = (join: { order: Array<string>; coordinates: Map<string, TypePosition> }) => {
    for (let i = 2; i < join.order.length; i++) {
      const c0_id = join.order[i - 2];
      const c1_id = join.order[i - 1];
      const c2_id = join.order[i];
      const c0 = join.coordinates.get(c0_id);
      const c1 = join.coordinates.get(c1_id);
      const c2 = join.coordinates.get(c2_id);
      const c_angle = caclcAngleByPosition(c1, c0, c2);

      if (c_angle < radian90 / 2) {
        return 0;
      }
    }
    return 1;
  };

  process_sharp_angle_removal_paths = (outside_node_id: string, inside_node_id: string) => {
    const outside_node = this.graph_route.route.get(outside_node_id);
    const inside_node = outside_node.get(inside_node_id);

    const paths_flag: Array<number> = [];

    for (let path of inside_node) {
      const graph_path_join = new GraphPathJoin();
      const join = graph_path_join.getJoinCoordinate(path.routes, this.grah_paths);

      console.log("sharp_angle_removal_hold -sharp_angle_removal_hold -path", path.routes, this.grah_paths, join);
      const has_sharp_angle = this.process_sharp_angle_removal(join);
      paths_flag.push(has_sharp_angle);
    }
    const func_count = (arr: Array<number>) => {
      let c = 0;

      for (let a of arr) {
        c += a;
      }

      return c;
    };

    const count = func_count(paths_flag);
    console.log("sharp_angle_removal_hold -sharp_angle_removal_hold -count", paths_flag, count);

    if (count == 0) {
      return;
    }

    const new_paths = inside_node.filter((element, index) => paths_flag[index] == 1);
    outside_node.set(inside_node_id, new_paths);
    this.graph_route.route.set(outside_node_id, outside_node);
  };

  sharp_angle_removal_hold = () => {
    console.log("sharp_angle_removal_hold -sharp_angle_removal_hold -start", _.cloneDeep(this.grah_paths));

    for (let outside_node_id of this.graph_route.route.keys()) {
      const outside_node = this.graph_route.route.get(outside_node_id);
      for (let inside_node_id of outside_node.keys()) {
        this.process_sharp_angle_removal_paths(outside_node_id, inside_node_id);
      }
    }
    // const join_grah_paths = graph_path_join.joinContinuity(join_routes, grah_paths);
  };
}

export default SharpAngleRemoval;
