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
import Route from "./expression/route";
import { copyObject } from "./../definition";
import SharpAngleRemoval from "./sharp_angle_removal";
class GraphClosedPath {
  keep_paths: Array<PathContact>;
  sharp_angle_removal_flag: boolean;
  constructor(sharp_angle_removal_flag: boolean) {
    this.keep_paths = [];
    this.sharp_angle_removal_flag = sharp_angle_removal_flag;
  }

  selectionClosedPath = (
    path_contacts: Array<PathContact>,
    longeast: boolean,
    processed_path: ProcessPath
  ): {
    closed: Array<PathContact>;
    keep: Array<PathContact>;
  } => {
    if (path_contacts.length == 0) {
      console.log("delete_path_ids -path_contacts0", path_contacts);
      return { closed: [], keep: [] };
    }

    let keep_path = path_contacts[0];

    if (this.sharp_angle_removal_flag) {
      for (let i = 0; i < path_contacts.length; i++) {
        const c_path = path_contacts[i];
        const sharp_angle_removal = new SharpAngleRemoval();
        let p = sharp_angle_removal.hasProcessSharpAngleRemovalPath(c_path.routes, processed_path);

        if (!p) {
          keep_path = c_path;
          break;
        }
      }
      console.log("delete_path_ids -keep_path", keep_path, path_contacts);
    }

    return { closed: [], keep: [keep_path] };
  };

  //最長距離優先(切り捨て破棄)
  searchDeleteClosedPath = (long: boolean, terminal_nodes: Array<string>, graph_route: Route, processed_path: ProcessPath, i_id: string) => {
    // let delete_candidacy_path_ids: Array<PathContact> = [];
    let keep_path_ids: Array<PathContact> = [];

    // const branch1_flag = false;
    // const terminal_nodes = branch1;

    // if (!terminal_nodes.includes(i_id)) {
    //   return;
    // }

    // for (let i = 0; i < terminal_nodes.length; i++) {
    //   const i_id = terminal_nodes[i];
    for (let j = 0; j < terminal_nodes.length; j++) {
      const j_id = terminal_nodes[j];

      if (i_id == j_id) {
        continue;
      }

      const path_contacts = graph_route.getSortPathContact(long, i_id, j_id);
      const d = this.selectionClosedPath(path_contacts, long, processed_path);
      // delete_candidacy_path_ids = delete_candidacy_path_ids.concat(d.closed);
      keep_path_ids = keep_path_ids.concat(d.keep);
    }
    // }

    console.log("delete_path_ids", terminal_nodes, graph_route, keep_path_ids);

    this.keep_paths = this.keep_paths.concat(keep_path_ids);

    return;
  };
  deleteClosedPath = (processed_path: ProcessPath) => {
    console.log("deleteClosedPath -start", this.keep_paths, copyObject(processed_path));

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
