import GraphPathJoin from "./graph_join";
import ProcessPath from "./expression/process_path";
import PathContact from "./expression/path_contact";
import Route from "./expression/route";
import Graph from "./expression/graph";

import GraphNode from "./expression/graph_node";
import { copyObject } from "./../definition";

import { TypePosition } from "./../gis_scipt/route_type";
import * as _ from "lodash"; // lodashをインポート
import { calcAngleByPosition, calcPythagorean, calcPythagoreanSquare, calcCenterGravity, radian90 } from "../mathematical/dimension_two";

class SharpAngleRemoval {
  // graph_route: Route;
  // grah_paths: ProcessPath;
  // graph_container: Graph;

  constructor() {
    // this.graph_route = graph_route;
    // this.grah_paths = grah_paths;
    // this.graph_container = graph_container;
    console.log("sharp_angle_removal_hold -constructor");
  }

  processSharpAngleRemoval = (join: { order: Array<string>; coordinates: Map<string, TypePosition>; joint_index: Array<number> }) => {
    console.log("sharp_angle_removal_hold -process_sharp_angle_removal", join.joint_index, join.order);

    for (let i = 0; i < join.joint_index.length; i++) {
      const joint_index = join.joint_index[i];
      const c0_id = join.order[joint_index - 1];
      const c1_id = join.order[joint_index];
      const c2_id = join.order[joint_index + 1];

      const c0 = join.coordinates.get(c0_id);
      const c1 = join.coordinates.get(c1_id);
      const c2 = join.coordinates.get(c2_id);
      const c_angle = calcAngleByPosition(c1, c0, c2);

      if (c_angle < radian90) {
        console.log("sharp_angle_removal_hold -sharp_angle_removal_hold -process_sharp_angle_removal", c_angle, radian90, radian90 / 2, c0_id, c1_id, c2_id);
        return 0;
      }
    }
    return 1;
  };

  hasProcessSharpAngleRemovalPath = (path_routes: Array<number>, grah_paths: ProcessPath) => {
    const graph_path_join = new GraphPathJoin();
    const join = graph_path_join.getJoinCoordinate(path_routes, grah_paths);
    const has_sharp_angle = this.processSharpAngleRemoval(join);
    return has_sharp_angle == 0;
  };

  // processSharpAngleRemovalPaths = (outside_node_id: string, inside_node_id: string) => {
  //   const outside_node = this.graph_route.route.get(outside_node_id);
  //   const inside_node = outside_node.get(inside_node_id);

  //   const paths_flag: Array<number> = [];

  //   for (let path of inside_node) {
  //     const graph_path_join = new GraphPathJoin();
  //     const join = graph_path_join.getJoinCoordinate(path.routes, this.grah_paths);

  //     console.log("sharp_angle_removal_hold -sharp_angle_removal_hold -path", path.routes, this.grah_paths, join);
  //     const has_sharp_angle = this.processSharpAngleRemoval(join);
  //     paths_flag.push(has_sharp_angle);
  //   }
  //   const funcCount = (arr: Array<number>) => {
  //     let c = 0;

  //     for (let a of arr) {
  //       c += a;
  //     }

  //     return c;
  //   };

  //   const count = funcCount(paths_flag);
  //   console.log("sharp_angle_removal_hold -sharp_angle_removal_hold -count", paths_flag, count);

  //   if (count == 0) {
  //     return;
  //   }

  //   const new_paths = inside_node.filter((element, index) => paths_flag[index] == 1);
  //   outside_node.set(inside_node_id, new_paths);
  //   this.graph_route.route.set(outside_node_id, outside_node);
  // };

  // sharpAngleRemovalHold = () => {
  //   console.log("sharp_angle_removal_hold -sharp_angle_removal_hold -start", _.cloneDeep(this.grah_paths));

  //   for (let outside_node_id of this.graph_route.route.keys()) {
  //     const outside_node = this.graph_route.route.get(outside_node_id);
  //     for (let inside_node_id of outside_node.keys()) {
  //       this.processSharpAngleRemovalPaths(outside_node_id, inside_node_id);
  //     }
  //   }

  //   return this.graph_route;
  //   // const join_grah_paths = graph_path_join.joinContinuity(join_routes, grah_paths);
  // };
}

export default SharpAngleRemoval;
