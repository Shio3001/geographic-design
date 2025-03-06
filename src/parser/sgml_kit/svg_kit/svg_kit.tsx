import EditData from "../../../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../../../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo } from "../../../gis_scipt/route_type";
import SvgNode from "./svg_node";

class SvgKit {
  svg_tree: Array<SvgNode>;
  constructor() {
    this.svg_tree = [];
  }

  pushNode = (node: SvgNode): number => {
    this.svg_tree.push(node);
    const p_index = this.svg_tree.length - 1;
    return p_index;
  };

  pushChild = (parent_index: number, child_node: number) => {
    // this.svg_tree[parent_index].children.push(child_node);
    this.svg_tree[parent_index].linkChild(child_node);
  };
}

export default SvgKit;
