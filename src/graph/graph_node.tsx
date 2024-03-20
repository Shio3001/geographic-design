import EditData from "../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo } from "../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../gis_scipt/gis_unique_data";

import SvgKit from "../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../parser/sgml_kit/svg_kit/svg_node";

class GraphNode {
  node_id: string;

  x: number;
  y: number;

  bidirectional_link_id_list: Array<string>;
  constructor() {
    this.node_id = "";
    this.x = 0;
    this.y = 0;
    this.bidirectional_link_id_list = [];
  }

  pushBidirectionalLinkNode = (link_node_id: string) => {
    this.bidirectional_link_id_list.push(link_node_id);
  };

  setId = (id: string) => {
    this.node_id = id;
  };

  setIdByPos = (x: string, y: string) => {
    // const xs = String(x);
    // const ys = String(y);
    const name = x + "p" + y;
    this.node_id = name;
  };

  setX = (x: number) => {
    this.x = x;
  };

  setY = (y: number) => {
    this.y = y;
  };

  setPos = (x: number, y: number) => {
    this.x = x;
    this.y = y;
  };
}

export default GraphNode;
