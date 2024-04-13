import GraphCoordinateExpression from "./coordinate_expression";
import { TypeGISInfo, TypeJsonCoordinates, TypePosition } from "../../gis_scipt/route_type";

import * as _ from "lodash"; // lodashをインポート

class ProcessPath {
  path: Map<number, GraphCoordinateExpression>;

  constructor() {
    this.path = new Map();
  }

  getJoinPathCoordinateFlag = (coordinate_order1: Array<string>, coordinate_order2: Array<string>) => {
    if (coordinate_order1.length < 2) {
      return [-1, -1];
    }
    if (coordinate_order2.length < 2) {
      return [-1, -1];
    }

    const getPath1FirstNodeId = () => {
      return coordinate_order1[0];
    };
    const getPath1LastNodeId = () => {
      return coordinate_order1[coordinate_order1.length - 1];
    };
    const getPath2FirstNodeId = () => {
      return coordinate_order2[0];
    };
    const getPath2LastNodeId = () => {
      return coordinate_order2[coordinate_order2.length - 1];
    };

    // 継 継
    if (getPath1LastNodeId() == getPath2FirstNodeId()) {
      console.log("includePathFunction 継 継");
      return [0, 0];
    }

    // 継 反
    else if (getPath1LastNodeId() == getPath2LastNodeId()) {
      console.log("includePathFunction 継 反");
      return [0, 1];
    }

    // 反 継
    else if (getPath1FirstNodeId() == getPath2FirstNodeId()) {
      console.log("includePathFunction 反 継");
      return [1, 0];
    }

    // 反 反
    else if (getPath1FirstNodeId() == getPath2LastNodeId()) {
      console.log("includePathFunction 反 反");
      return [1, 1];
    } else {
      console.log("includePathFunction X X ", getPath1FirstNodeId(), getPath1LastNodeId(), getPath2FirstNodeId(), getPath2LastNodeId());
      return [-1, -1];
    }
  };
  getJoinPathFlag = (path_id_1: number, path_id_2: number) => {
    const path_1 = this.path.get(path_id_1);
    const path_2 = this.path.get(path_id_2);
    console.log("includePathFunction 接続(FA)", path_id_1, path_id_2);

    // 継 継
    if (path_1.getLastNodeId() == path_2.getFirstNodeId()) {
      console.log("includePathFunction 継 継");
      return [0, 0];
    }

    // 継 反
    else if (path_1.getLastNodeId() == path_2.getLastNodeId()) {
      console.log("includePathFunction 継 反");
      return [0, 1];
    }

    // 反 継
    else if (path_1.getFirstNodeId() == path_2.getFirstNodeId()) {
      console.log("includePathFunction 反 継");
      return [1, 0];
    }

    // 反 反
    else if (path_1.getFirstNodeId() == path_2.getLastNodeId()) {
      console.log("includePathFunction 反 反");
      return [1, 1];
    } else {
      return [-1, -1];
    }
  };

  joinPath = (path_id_1: number, path_id_2: number) => {
    const path_1 = this.path.get(path_id_1);
    const path_2 = this.path.get(path_id_2);
    console.log("includePathFunction 接続(A)", path_id_1, path_id_2);

    // 継 継
    if (path_1.getLastNodeId() == path_2.getFirstNodeId()) {
      console.log("includePathFunction 継 継");
    }

    // 継 反
    else if (path_1.getLastNodeId() == path_2.getLastNodeId()) {
      console.log("includePathFunction 継 反");
      path_2.reversePosOrder();
    }

    // 反 継
    else if (path_1.getFirstNodeId() == path_2.getFirstNodeId()) {
      console.log("includePathFunction 反 継");
      path_1.reversePosOrder();
    }

    // 反 反
    else if (path_1.getFirstNodeId() == path_2.getLastNodeId()) {
      console.log("includePathFunction 反 反");
      path_1.reversePosOrder();
      path_2.reversePosOrder();
    } else {
      return false;
    }
    console.log("includePathFunction 接続(B)");

    path_1.includePathOrder(path_2, 0);

    // this.path.delete(path_1.coordinate_expression_id);
    this.path.delete(path_2.coordinate_expression_id);
    this.path.set(path_1.coordinate_expression_id, path_1);

    return true;
  };

  isAdjoinProcessed = (path_id: number, node_id_1: string, node_id_2: string) => {
    const c_path = this.path.get(path_id);
    let node_index_1 = -100;
    let node_index_2 = -102;

    for (let i = 0; i < c_path.pos_order.length; i++) {
      if (node_id_1 == c_path.pos_order[i]) {
        node_index_1 = i;
      }
      if (node_id_2 == c_path.pos_order[i]) {
        node_index_2 = i;
      }
    }

    const dif = Math.abs(node_index_1 - node_index_2);
    const ans = dif == 1;

    console.log("termination_point -isAdjoinProcessed", dif, node_index_1, node_index_2, ans, path_id, node_id_1, node_id_2, this.path);

    return ans;
  };

  pushProcessed = () => {
    const g = new GraphCoordinateExpression("path");
    const path_id = this.path.size;
    g.setCoordinateExpressionId(path_id);

    this.path.set(path_id, g);
    return path_id;
  };
  pushProcessedPos = (node_id: string, x: number, y: number) => {
    const path_index = this.pushProcessed();
    const g = this.path.get(path_index);
    g.pushCoordinateId(node_id, x, y);
    this.path.set(path_index, g);
    return path_index;
  };

  pushCoordinateId = (path_index: number, node_id: string, x: number, y: number) => {
    const g = this.path.get(path_index);
    g.pushCoordinateId(node_id, x, y);
    this.path.set(path_index, g);
  };
}

export default ProcessPath;
