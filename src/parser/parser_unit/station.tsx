import EditData from "../../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo } from "../../gis_scipt/route_type";

import SvgKit from "../sgml_kit/svg_kit/svg_kit";
import SvgNode from "../sgml_kit/svg_kit/svg_node";

class ParserStation {
  edit_data: EditData;
  gis_info: TypeGISInfo;
  svg_kit: SvgKit;
  constructor(edit_data: EditData, gis_info: TypeGISInfo) {
    this.edit_data = edit_data;
    this.gis_info = gis_info;
  }
}

export default ParserStation;
