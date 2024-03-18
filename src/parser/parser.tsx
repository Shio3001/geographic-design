import EditData from "../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo } from "../gis_scipt/route_type";
import ParserRailroadSection from "./parser_unit/railroad_section";
import ParserStation from "./parser_unit/station";
import SvgKit from "./sgml_kit/svg_kit/svg_kit";

class Parser {
  edit_data: EditData;
  gis_info: TypeGISInfo;
  svg_kit: SvgKit;
  constructor(edit_data: EditData, gis_info: TypeGISInfo) {
    this.edit_data = edit_data;
    this.gis_info = gis_info;
    this.svg_kit = new SvgKit();
  }

  parser = () => {
    const layers_order = this.edit_data.layers_order;

    for (let i = 0; i < layers_order.length; i++) {
      this.parserLayer(layers_order[i]);
    }
  };
  parserLayer = (layer_uuid: string) => {
    const current_layer = this.edit_data.layers[layer_uuid];

    const unit_id = current_layer.unit_id;
    const unit_type = this.gis_info.id_type[unit_id];

    this.switchParserLayer(layer_uuid);
  };

  switchParserLayer = (layer_uuid: string) => {
    const current_layer = this.edit_data.layers[layer_uuid];

    const unit_id = current_layer.unit_id;
    const unit_type = this.gis_info.id_type[unit_id];

    console.log("switchParserLayer", unit_id, unit_type);
    switch (unit_type) {
      case "RailroadSection": {
        const paraser_railroad_section = new ParserRailroadSection(this.edit_data, this.gis_info, layer_uuid, unit_id, unit_type);
        paraser_railroad_section.coordinateAggregation();
        return;
      }
      case "Station": {
        const parser_station_section = new ParserStation(this.edit_data, this.gis_info);
        return;
      }
      default:
        break;
    }
  };
}

export default Parser;
