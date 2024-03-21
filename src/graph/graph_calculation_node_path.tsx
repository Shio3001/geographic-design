import EditData from "../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeJsonCoordinates } from "../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../gis_scipt/gis_unique_data";

import SvgKit from "../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../parser/sgml_kit/svg_kit/svg_node";

import GraphNode from "./graph_node";
import Graph from "./graph";
import GraphCoordinateExpression from "./expression/coordinate_expression";

class GraphCalculationNodePath {
  node_paths: Map<string, Array<number>>;

  constructor() {
    this.node_paths = new Map();
  }

  getPaths = (node_id: string) => {
    if (!this.node_paths.has(node_id)) {
      return [];
    }

    const paths = this.node_paths.get(node_id);
    return paths;
  };

  isValidNode = (node_id: string) => {
    if (!this.node_paths.has(node_id)) {
      return false;
    }

    const paths = this.node_paths.get(node_id);

    for (let path of paths) {
      if (path >= 0) {
        return true;
      }
    }
    return false;
  };

  otheGroupPath = (node_id_1: string, node_id_2: string) => {
    if (!this.node_paths.has(node_id_1)) {
      return false;
    }
    if (!this.node_paths.has(node_id_2)) {
      return false;
    }
    const paths_1 = this.node_paths.get(node_id_1);
    const paths_2 = this.node_paths.get(node_id_2);

    for (let p1 of paths_1) {
      for (let p2 of paths_2) {
        if (p1 == p2) {
          return true;
        }
      }
    }
    return false;
  };

  pushNode = (node_id: string, path_id: number) => {
    if (this.node_paths.has(node_id)) {
      const node = this.node_paths.get(node_id);
      node.push(path_id);
      this.node_paths.set(node_id, node);
    } else {
      this.node_paths.set(node_id, [path_id]);
    }
  };
}

export default GraphCalculationNodePath;
