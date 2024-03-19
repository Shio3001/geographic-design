import EditData from "../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo } from "../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../gis_scipt/gis_unique_data";

import SvgKit from "../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../parser/sgml_kit/svg_kit/svg_node";
import GraphCoordinateExpression from "./expression/coordinate_expression";

class GraphOptimization {
  path: Array<GraphCoordinateExpression>;
  constructor(path: Array<GraphCoordinateExpression>) {
    this.path = path;
  }

  graphBranchPointSplit = () => {
    const path_length = this.path.length;

    for (let i = 0; i < path_length; i++) {
      for (let j = i + 1; j < path_length; j++) {
        console.log(i, j);
      }
    }
  };
}

export default GraphOptimization;
