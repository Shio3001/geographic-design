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
import { TypeGraphRoute, TypeGraphRouteNode } from "./expression/graph_type";
import PathContact from "./expression/path_contact";
import ProcessPath from "./expression/process_path";

import Route from "./expression/route";

class GraphPathJoin {
  constructor() {
    // graph_optimization.processed_path.path.get(1).
  }

  //二次元配列の接続状況を返す。重複しないように接続状況を処理する
  //一次限目：二次限目の列挙
  //二次限目：ProcessPathの列挙
  joinLong = (graph_route: Route) => {
    const join_routes: Array<Array<number>> = [];
    let queqe: Array<number> = [];

    const enqueqe = (eq: Array<number>) => {
      queqe = queqe.concat(eq);
    };
    const hasQueque = (eq: Array<number>) => {
      for (let e of eq) {
        if (queqe.includes(e)) {
          return true;
        }
      }
      return false;
    };

    const path_contacts = graph_route.getAllSortPathContact(true);

    if (path_contacts.length == 0) {
      return [];
    }

    for (const path_contact of path_contacts) {
      const has_que = hasQueque(path_contact.routes);

      if (has_que) {
        continue;
      }

      enqueqe(path_contact.routes);
      join_routes.push(path_contact.routes);
    }

    console.log("join_routes", join_routes);

    return join_routes;
  };

  joinContinuity = (join_routes: Array<Array<number>>, process_path: ProcessPath) => {
    console.log("includePathFunction -join_routes", join_routes, process_path);

    for (let join_route of join_routes) {
      const p0_id = join_route[0];
      //   const p0 = process_path.path.get(p0_id);

      for (let r = 1; r < join_route.length; r++) {
        const r_id = join_route[r];
        process_path.joinPath(p0_id, r_id);
        // process_path.path.delete(r);
      }
    }

    return process_path;
  };
}

export default GraphPathJoin;
