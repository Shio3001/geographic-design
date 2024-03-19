import EditData from "../../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeJsonCoordinates } from "../../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "./../../gis_scipt/gis_unique_data";

import SvgKit from "../sgml_kit/svg_kit/svg_kit";
import SvgNode from "../sgml_kit/svg_kit/svg_node";
import Graph from "./../../graph/graph";
import GraphNode from "./../../graph/graph_node";
import GraphDfs from "./../../graph/graph_dfs";
import GraphCoordinateExpression from "./../../graph/expression/coordinate_expression";

import BigNumber from "bignumber.js";

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

  generatePath = (): Array<GraphCoordinateExpression> => {
    const grah_dfs = new GraphDfs(this.graph);
    grah_dfs.startDfs();
    // grah_dfs.debugNode();

    const paths = grah_dfs.getProcessedPath();

    return paths;
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
    let before_node = "";

    for (let i = 0; i < coordinates.length; i++) {
      const coordinate = coordinates[i];
      const node = new GraphNode();

      const coordinate0 = new BigNumber(coordinate[0]);
      const coordinate1 = new BigNumber(coordinate[1]);

      const c0_100000 = coordinate0.times(100000).toNumber();
      const c1_100000 = coordinate1.times(100000).toNumber();

      const c0_10dp = coordinate0.toString();
      const c1_10dp = coordinate1.toString();
      console.log("c0_10-c1_10", coordinate0, coordinate1, c0_10dp, c1_10dp);

      // const c0_10 = String(coordinate0);
      // const c1_10 = String(coordinate1);

      node.setIdByPos(c1_10dp, c0_10dp);
      node.setPos(c0_100000, c1_100000);

      if (i >= 1) {
        node.pushLinkNode(before_node);
      }

      this.graph.pushNode(node);
      before_node = node.node_id;
    }

    console.log(this.graph);
  };
}

export default ParserRailroadSection;
