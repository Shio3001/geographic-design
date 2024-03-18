import EditData from "../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo } from "../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../gis_scipt/gis_unique_data";

import SvgKit from "../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../parser/sgml_kit/svg_kit/svg_node";

class GraphNode {
  node_name: string;
  node_id: number;

  x: number;
  y: number;

  link_id_list: Array<string>;
  constructor() {
    this.node_name = "";
    this.node_id = 0;
    this.x = 0;
    this.y = 0;
    this.link_id_list = [];
  }

  pushLinkNode = (link_node_name: string) => {
    this.link_id_list.push(link_node_name);
  };

  setName = (name: string) => {
    this.node_name = name;
  };

  setNameByPos = (x: number, y: number) => {
    const xs = String(x);
    const ys = String(y);

    const name = xs + "p" + ys;
    this.node_name = name;
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
