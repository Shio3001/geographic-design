import EditData from "../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeJsonCoordinates } from "../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../gis_scipt/gis_unique_data";

import SvgKit from "../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../parser/sgml_kit/svg_kit/svg_node";

import GraphNode from "./expression/graph_node";
import Graph from "./expression/graph";
import GraphCoordinateExpression from "./expression/coordinate_expression";
import GraphOptimization from "./optimization/graph_optimization";
import { TypeGraphRoute, TypeGraphRouteNode, TypePathIndex } from "./expression/graph_type";
import PathContact from "./expression/path_contact";
import ProcessPath from "./expression/process_path";
import * as _ from "lodash"; // lodashをインポート
import Route from "./expression/route";

class GraphClosedPath {
  keep_paths: Array<PathContact>;
  constructor() {
    this.keep_paths = [];
  }

  selectionClosedPath = (
    path_contacts: Array<PathContact>,
    longeast: boolean
  ): {
    closed: Array<PathContact>;
    keep: Array<PathContact>;
  } => {
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

    if (path_contacts.length == 0) {
      return { closed: [], keep: [] };
    }

    const keep_path = longeast ? getLongestPath() : getShortestPath();
    const delete_paths = getOtherPath(keep_path);

    const closed: Array<PathContact> = [];

    // for (let i = 0; i < delete_paths.length; i++) {
    //   const delete_path = delete_paths[i];
    //   closed.push(delete_path);
    // }

    // console.log("deleteClosedPathLong", closed);
    return { closed: [], keep: [keep_path.path] };
  };

  //最長距離優先(切り捨て破棄)
  searchDeleteClosedPath = (long: boolean, graph_next: Route, graph_route: Route) => {
    let delete_candidacy_path_ids: Array<PathContact> = [];
    let keep_path_ids: Array<PathContact> = [];
    const terminal_nodes = graph_next.getTerminal();
    for (let i = 0; i < terminal_nodes.length; i++) {
      const i_id = terminal_nodes[i];
      for (let j = i + 1; j < terminal_nodes.length; j++) {
        const j_id = terminal_nodes[j];
        const path_contacts = graph_route.getPathContacts(i_id, j_id);
        const d = this.selectionClosedPath(path_contacts, long);
        delete_candidacy_path_ids = delete_candidacy_path_ids.concat(d.closed);
        keep_path_ids = keep_path_ids.concat(d.keep);
      }
    }

    console.log("delete_path_ids", delete_candidacy_path_ids, keep_path_ids);

    this.keep_paths = keep_path_ids;
  };
  deleteClosedPath = (processed_path: ProcessPath) => {
    console.log("deleteClosedPath -start", this.keep_paths);

    const getKeepRoutes = () => {
      let arr: Array<number> = [];

      for (let keep_path of this.keep_paths) {
        console.log("deleteClosedPath -getKeepRoutes loop", keep_path, arr);

        arr = arr.concat(keep_path.routes);
      }

      return arr;
    };
    const keep_routes = getKeepRoutes();
    console.log("deleteClosedPath -getKeepRoutes", keep_routes);

    for (let delete_path of processed_path.path.values()) {
      console.log("deleteClosedPath -delete", delete_path, keep_routes, this.keep_paths);

      if (keep_routes.includes(delete_path.coordinate_expression_id)) {
        continue;
      }

      processed_path.path.delete(delete_path.coordinate_expression_id);
    }

    return processed_path;

    // const new_processed_path = this.graph_optimization.processed_path.filter((element, index) => !delete_path_ids.includes(index));
  };
}

export default GraphClosedPath;
