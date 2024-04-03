import GraphCoordinateExpression from "./coordinate_expression";
import * as _ from "lodash"; // lodashをインポート

class ProcessPath {
  path: Map<number, GraphCoordinateExpression>;

  constructor() {
    this.path = new Map();
  }

  joinPath = (path_id_1: number, path_id_2: number) => {
    const path_1 = _.cloneDeep(this.path.get(path_id_1));
    const path_2 = _.cloneDeep(this.path.get(path_id_2));

    // 継 継
    if (path_1.getLastNodeId() == path_2.getFirstNodeId()) {
    }

    // 継 反
    else if (path_1.getLastNodeId() == path_2.getLastNodeId()) {
      path_2.reversePosOrder();
    }

    // 反 継
    else if (path_1.getFirstNodeId() == path_2.getFirstNodeId()) {
      path_1.reversePosOrder();
    }

    // 反 反
    else if (path_1.getFirstNodeId() == path_2.getLastNodeId()) {
      path_1.reversePosOrder();
      path_2.reversePosOrder();
    } else {
      return false;
    }

    path_1.includePathOrder(path_2, 1);

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
