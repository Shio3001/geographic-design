import EditData from "../../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeJsonCoordinates } from "../../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "./../../gis_scipt/gis_unique_data";

import SvgKit from "../sgml_kit/svg_kit/svg_kit";
import SvgNode from "../sgml_kit/svg_kit/svg_node";
import Graph from "../../graph/expression/graph";
import GraphNode from "../../graph/expression/graph_node";
import GraphCalculation from "../../graph/graph_calculation";
import GraphCoordinateExpression from "./../../graph/expression/coordinate_expression";
import GraphOptimization from "../../graph/optimization/graph_optimization";
import GraphClosedPath from "./../../graph/graph_closed_path";
import GraphPathJoin from "./../../graph/graph_join";
import SharpAngleRemoval from "./../../graph/sharp_angle_removal";
import ProcessPath from "./../../graph/expression/process_path";
import BigNumber from "bignumber.js";

import * as GEO from "./../../geographic_constant";
import { findLastKey } from "lodash";

class ParserRailroadSection {
  edit_data: EditData;
  gis_info: TypeGISInfo;
  svg_node: SvgNode;
  layer_uuid: string;
  unit_id: string;
  unit_type: string;

  graph: Graph;

  constructor(edit_data: EditData, gis_info: TypeGISInfo, layer_uuid: string, unit_id: string, unit_type: string) {
    this.edit_data = edit_data;
    this.gis_info = gis_info;
    this.svg_node = new SvgNode();
    this.layer_uuid = layer_uuid;
    this.unit_id = unit_id;
    this.unit_type = unit_type;
    this.graph = new Graph();
  }

  pathOptimizeLoop = (long_mode: number, sharp_angle_removal_flag: boolean, grah_paths: ProcessPath, graph_extraction_container: Graph) => {
    let graph_optimization = new GraphOptimization();
    let graph_next = graph_optimization.generateNext(grah_paths);
    graph_optimization = null;

    let long = false;

    if (long_mode == 2) {
      long = true;
    }

    let graph_close_path_process = new GraphClosedPath(sharp_angle_removal_flag, long);

    const branch1 = graph_next.getBranch(1);
    const branch1_flag = branch1.length == 1;
    const terminal_nodes = branch1_flag ? graph_next.getOddBranch() : branch1;

    graph_close_path_process.searchDeleteClosedPath(terminal_nodes, grah_paths, graph_extraction_container, graph_next);

    grah_paths = graph_close_path_process.deleteClosedPath(grah_paths);

    graph_next = null;
    graph_close_path_process = null;
    // graph_route = null;

    // const branch1_flag = branch1_flag_count > 0;

    return { branch1_flag: branch1_flag, grah_paths: grah_paths };
  };
  pathOptimize = (long_mode: number, sharp_angle_removal_flag: boolean, grah_paths: ProcessPath, graph_extraction_container: Graph) => {
    let branch1_count = 10;

    while (branch1_count > 0) {
      const rv = this.pathOptimizeLoop(long_mode, sharp_angle_removal_flag, grah_paths, graph_extraction_container);
      grah_paths = rv.grah_paths;
      if (rv.branch1_flag) {
        branch1_count--;
      } else {
        branch1_count = -1;
      }
    }

    return grah_paths;
  };
  pathJoin = (grah_paths: ProcessPath, graph_extraction_container: Graph) => {
    let graph_path_join = new GraphPathJoin();
    let graph_optimization = new GraphOptimization();
    let graph_next = graph_optimization.generateNext(grah_paths);
    let graph_route = graph_optimization.generateRoute(graph_extraction_container, graph_next);
    let join_routes = graph_path_join.joinLong(graph_route);
    grah_paths = graph_path_join.joinContinuity(join_routes, grah_paths);

    graph_path_join = null;
    graph_optimization = null;
    graph_next = null;
    graph_route = null;
    join_routes = null;

    return grah_paths;
  };

  generatePath = (): Array<GraphCoordinateExpression> => {
    const current_layer = this.edit_data.layers[this.layer_uuid];
    const path_optimize_flag = current_layer.layer_infomation["path_optimize"] == "ok";
    const path_join_flag = current_layer.layer_infomation["path_join"] == "ok";
    const sharp_angle_removal_flag = current_layer.layer_infomation["sharp_angle_removal"] == "ok";
    const original_data_coordinate_correction_flag = current_layer.layer_infomation["original_data_coordinate_correction"] == "ok";
    const long_mode = Number(current_layer.layer_infomation["path_optimize_closed_type"]);
    const grah_calc = new GraphCalculation(this.graph, original_data_coordinate_correction_flag); // grah_dfs.debugNode();

    grah_calc.startCalc();
    // grah_calc.debugNode();
    let grah_paths = grah_calc.getProcessedPath();

    const graph_optimization = new GraphOptimization();

    const graph_extraction_container = graph_optimization.generateGraphExtraction(this.graph, grah_paths);

    if (path_optimize_flag) {
      grah_paths = this.pathOptimize(long_mode, sharp_angle_removal_flag, grah_paths, graph_extraction_container);
    }

    if (path_join_flag) {
      grah_paths = this.pathJoin(grah_paths, graph_extraction_container);
    }

    const paths_array = Array.from(grah_paths.path.values());
    return paths_array;
  };

  coordinateAggregation = () => {
    const current_layer = this.edit_data.layers[this.layer_uuid];
    const geometry_index = searchGisConditional(this.unit_id, {
      N02_004: current_layer.layer_infomation["railway"],
      N02_003: current_layer.layer_infomation["line"],
    });
    console.log("coordinateAggregation", geometry_index, current_layer.layer_infomation);
    for (let i = 0; i < geometry_index.length; i++) {
      const current_geometry = getGeometry(this.unit_id, geometry_index[i]);
      console.log("current_geometry", current_geometry);

      const cord = current_geometry.coordinates;
      this.parseCoordinatesToGraph(cord);
    }
  };

  parseCoordinatesToGraph = (coordinates: TypeJsonCoordinates) => {
    let before_node_id = "";

    for (let i = 0; i < coordinates.length; i++) {
      const coordinate = coordinates[i];
      const node = new GraphNode();

      const coordinate0 = new BigNumber(coordinate[0]);
      const coordinate1 = new BigNumber(coordinate[1]);

      const c0_exp = coordinate0.times(GEO.EXPANSION_CONSTANT_BIGNUMBER).div(GEO.LONGITUDE_KM1_BIGNUMBER).toNumber();
      const c1_exp = coordinate1.times(GEO.EXPANSION_CONSTANT_BIGNUMBER).div(GEO.LATITUDE_KM1_BIGNUMBER).toNumber();

      const c0_exp_dp = coordinate0.times(GEO.EXPANSION_CONSTANT_BIGNUMBER).dp(0).toString();
      const c1_exp_dp = coordinate1.times(GEO.EXPANSION_CONSTANT_BIGNUMBER).dp(0).toString();
      console.log("c0_10-c1_10", coordinate0, coordinate1, c0_exp_dp, c1_exp_dp);

      // const c0_10 = String(coordinate0);
      // const c1_10 = String(coordinate1);

      node.setIdByPos(c1_exp_dp, c0_exp_dp);
      node.setPos(c0_exp, c1_exp);

      if (i >= 1) {
        node.pushBidirectionalLinkNode(before_node_id);
      }

      this.graph.pushNode(node);
      before_node_id = node.node_id;
    }

    console.log(this.graph);
  };
}

export default ParserRailroadSection;
