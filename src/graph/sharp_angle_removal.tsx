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
  constructor() {}

  processSharpAngleRemoval = (join: { order: Array<string>; coordinates: Map<string, TypePosition>; joint_index: Array<number> }) => {
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
        console.log(c_angle, (c_angle * 180) / 3.1415, c0_id, c1_id, c2_id);
        return true;
      }
    }
    return false;
  };

  hasProcessSharpAngleRemovalPath = (path_routes: Array<number>, grah_paths: ProcessPath) => {
    const graph_path_join = new GraphPathJoin();
    const join = graph_path_join.getJoinCoordinate(path_routes, grah_paths);
    const has_sharp_angle = this.processSharpAngleRemoval(join);
    return has_sharp_angle;
  };
}

export default SharpAngleRemoval;
