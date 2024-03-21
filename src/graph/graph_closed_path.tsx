import EditData from "../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeJsonCoordinates } from "../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../gis_scipt/gis_unique_data";

import SvgKit from "../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../parser/sgml_kit/svg_kit/svg_node";

import GraphNode from "./graph_node";
import Graph from "./graph";
import GraphCoordinateExpression from "./expression/coordinate_expression";
import GraphOptimization from "./graph_optimization";
import { TypeGraphRoute, TypeGraphRouteNode } from "./expression/graph_type";
import PathContact from "./expression/path_contact";
import { table } from "console";

type TypePathIndex = {
  path: PathContact;
  index: number;
};

class GraphClosedPath {
  graph_optimization: GraphOptimization;
  constructor(graph_optimization: GraphOptimization) {
    this.graph_optimization = graph_optimization;
  }

  selectionClosedPath = (path_contacts: Array<PathContact>, longeast: boolean) => {
    const getLengthMax = () => {
      let length_max = 0;
      for (let path_contact of path_contacts) {
        length_max = Math.max(path_contact.routes.length, length_max);
      }
      return length_max;
    };
    const getLengthMin = () => {
      let length_min = Number.MAX_SAFE_INTEGER;
      for (let path_contact of path_contacts) {
        length_min = Math.min(path_contact.routes.length, length_min);
      }
      return length_min;
    };
    const getLongestPath = (): TypePathIndex => {
      let distance_max_path = path_contacts[0];
      let index = 0;
      for (let i = 1; i < path_contacts.length; i++) {
        if (distance_max_path.distance < path_contacts[i].distance) {
          distance_max_path = path_contacts[i];
          index = i;
        }
      }
      return { path: distance_max_path, index: index };
    };
    const getShortestPath = (): TypePathIndex => {
      let distance_min_path = path_contacts[0];
      let index = 0;

      for (let i = 1; i < path_contacts.length; i++) {
        if (distance_min_path.distance > path_contacts[i].distance) {
          distance_min_path = path_contacts[i];
          index = i;
        }
      }
      return { path: distance_min_path, index: index };
    };

    const getOtherPath = (target_path: TypePathIndex) => {
      const result = path_contacts.filter((element, index) => index != target_path.index);
      return result;
    };

    const length_min = getLengthMin();
    const length_max = getLengthMax();

    const getBranch = () => {
      for (let i = 0; i < length_min; i++) {
        const base = path_contacts[0].routes[i];
        for (let path_index = 1; path_index < path_contacts.length; path_index++) {
          const current = path_contacts[path_index].routes[i];

          if (base != current) {
            return i;
          }
        }
      }
      return path_contacts.length;
    };

    const branch = getBranch();
    if (branch == length_max) {
      return [];
    }

    const delete_path = longeast ? getOtherPath(getLongestPath()) : getOtherPath(getShortestPath());

    const closed = delete_path.filter((element, index) => index >= branch);
    console.log("deleteClosedPathLong", delete_path, closed, branch);
    return closed;
  };

  //最長距離優先(切り捨て破棄)
  searchDeleteClosedPath = (long: boolean) => {
    let delete_path_ids: Array<number> = [];
    const branch_nodes = this.graph_optimization.graph_next.getBranchNodes();
    for (let i = 0; i < branch_nodes.length; i++) {
      const i_id = branch_nodes[i];
      for (let j = i + 1; j < branch_nodes.length; j++) {
        const j_id = branch_nodes[j];
        const path_contacts = this.graph_optimization.graph_route.getPathContacts(i_id, j_id);
        const d = this.selectionClosedPath(path_contacts, long);
        // delete_path_ids = delete_path_ids.concat(d);
      }
    }
    console.log("delete_path_ids", delete_path_ids);
    return delete_path_ids;
  };
  deleteClosedPath = (delete_path_ids: Array<PathContact>) => {
    // const new_processed_path = this.graph_optimization.processed_path.filter((element, index) => !delete_path_ids.includes(index));
  };
}

export default GraphClosedPath;
