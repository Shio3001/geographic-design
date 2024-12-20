import EditData from "../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypePosition } from "../gis_scipt/route_type";
import { getRandomInt } from "../gis_scipt/route_setup";
import ParserRailroadSection from "./parser_unit/railroad_section";
import ParserStation from "./parser_unit/station";
import ParserCoast from "./parser_unit/coast";
import SvgKit from "./sgml_kit/svg_kit/svg_kit";
import SvgNode from "./sgml_kit/svg_kit/svg_node";
import GraphCoordinateExpression from "./../graph/expression/coordinate_expression";
import path from "path";
import BigNumber from "bignumber.js";

class Parser {
  edit_data: EditData;
  gis_info: TypeGISInfo;
  svg_kit: SvgKit;
  graph_coordinate_list: Array<GraphCoordinateExpression>;
  constructor(edit_data: EditData, gis_info: TypeGISInfo) {
    this.edit_data = edit_data;
    this.gis_info = gis_info;
    this.svg_kit = new SvgKit();
    this.graph_coordinate_list = [];
    const new_svg_node = new SvgNode();
    new_svg_node.setTag("svg");
    new_svg_node.pushAttribute("xmlns", "http://www.w3.org/2000/svg");
    new_svg_node.pushAttributeNum("width", edit_data.width);
    new_svg_node.pushAttributeNum("height", edit_data.height);

    this.svg_kit.pushNode(new_svg_node);
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

    const graph_coordinate_expression = this.switchParserLayer(layer_uuid);

    this.graph_coordinate_list = this.graph_coordinate_list.concat(graph_coordinate_expression);
    console.log("parserLayer", this.edit_data, this.graph_coordinate_list, graph_coordinate_expression);
  };

  toSVGPoint = (gce: GraphCoordinateExpression) => {
    //<circle cx="100" cy="100" r="90" stroke="black" stroke-width="1" fill="blue"></circle>

    const pos_order = gce.pos_order;
    const coordinates = gce.coordinates;
    for (let j = 0; j < pos_order.length; j++) {
      const coordinate = coordinates.get(pos_order[j]);
      const new_svg_node = new SvgNode();
      new_svg_node.setTag("circle");
      new_svg_node.pushAttributeNum("cx", coordinate.x);
      new_svg_node.pushAttributeNum("cy", coordinate.y);
      new_svg_node.pushAttributeNum("r", 4);
      new_svg_node.pushAttribute("stroke", "none");
      new_svg_node.pushAttribute("stroke-width", "0");
      new_svg_node.pushAttribute("fill", "black");
      const new_svg_node_index = this.svg_kit.pushNode(new_svg_node);
      this.svg_kit.pushChild(0, new_svg_node_index);
    }
  };

  toSVGPath = (gce: GraphCoordinateExpression) => {
    const pos_order = gce.pos_order;
    const new_svg_node = new SvgNode();
    const coordinates = gce.coordinates;
    new_svg_node.pushComment(String(gce.coordinate_expression_id));
    new_svg_node.setTag("path");

    const r = String(getRandomInt(50, 200));
    const g = String(getRandomInt(50, 200));
    const b = String(getRandomInt(50, 200));

    const rgb = "rgb(" + r + "," + g + "," + b + ")";

    new_svg_node.pushAttribute("stroke", rgb);
    new_svg_node.pushAttribute("stroke-width", "2");
    new_svg_node.pushAttribute("fill", "none");
    const coordinate0 = coordinates.get(pos_order[0]);
    new_svg_node.pushSvgCommand("M", coordinate0.x, coordinate0.y);

    for (let j = 0; j < pos_order.length; j++) {
      const coordinate = coordinates.get(pos_order[j]);
      new_svg_node.pushSvgCommand("L", coordinate.x, coordinate.y);
    }

    const new_svg_node_index = this.svg_kit.pushNode(new_svg_node);
    this.svg_kit.pushChild(0, new_svg_node_index);
  };

  toSVG = () => {
    for (let i = 0; i < this.graph_coordinate_list.length; i++) {
      const gce = this.graph_coordinate_list[i];
      const coordinates = gce.coordinates;
      const pos_order = gce.pos_order;

      console.log("toSVG", pos_order, coordinates);

      if (pos_order.length == 0) {
        continue;
      }

      if (gce.getType() == "path") {
        this.toSVGPath(gce);
      }
      if (gce.getType() == "point") {
        this.toSVGPoint(gce);
      }
    }

    const svg = this.svg_kit.svg_tree[0].generate(this.svg_kit.svg_tree);
    return svg;
  };

  scaling = () => {
    const left_top = this.searchCoordinateLeftTop();
    const right_bottom = this.searchCoordinateRightBottom();
    this.moveCoordinateOrigin(left_top);
    const new_left_top = { x: 0, y: 0 };
    const new_right_bottom = {
      x: right_bottom.x - left_top.x,
      y: right_bottom.y - left_top.y,
    };
    const reduction_rate_x = BigNumber(this.edit_data.width).div(BigNumber(new_right_bottom.x)).toNumber();
    const reduction_rate_y = BigNumber(this.edit_data.height).div(BigNumber(new_right_bottom.y)).toNumber();
    const reduction_rate_min = Math.min(reduction_rate_x, reduction_rate_y);

    console.log(
      "縮小率",
      reduction_rate_min,
      reduction_rate_x,
      reduction_rate_y,
      this.edit_data.width,
      this.edit_data.height,
      left_top,
      right_bottom,
      this.graph_coordinate_list
    );

    this.moveCoordinateReduction(reduction_rate_min);
    this.invertedCoordinate();
    this.moveCoordinateOrigin(this.searchCoordinateLeftTop());
    this.decimalPlaceRound();
    console.log("scaling", this.graph_coordinate_list);
  };

  //すべて指定桁数で四捨五入
  decimalPlaceRound = () => {
    for (let i = 0; i < this.graph_coordinate_list.length; i++) {
      const gce = this.graph_coordinate_list[i];
      const coordinates = gce.coordinates;
      const pos_order = gce.pos_order;

      for (let coordinate of coordinates.values()) {
        coordinate.x = BigNumber(coordinate.x).dp(this.edit_data.decimal_place).toNumber();
        coordinate.y = BigNumber(coordinate.y).dp(this.edit_data.decimal_place).toNumber();
      }
    }
  };

  //上下反転
  invertedCoordinate = () => {
    for (let i = 0; i < this.graph_coordinate_list.length; i++) {
      const gce = this.graph_coordinate_list[i];
      const coordinates = gce.coordinates;
      const pos_order = gce.pos_order;

      for (let coordinate of coordinates.values()) {
        // const coordinate = coordinates.get(pos_order[j]);

        coordinate.y = BigNumber(this.edit_data.height).minus(BigNumber(coordinate.y)).toNumber();
      }
    }
  };

  //縮尺調整
  moveCoordinateReduction = (reduction_rate: number) => {
    for (let i = 0; i < this.graph_coordinate_list.length; i++) {
      const gce = this.graph_coordinate_list[i];
      const coordinates = gce.coordinates;
      const pos_order = gce.pos_order;

      for (let coordinate of coordinates.values()) {
        coordinate.x = BigNumber(coordinate.x).times(BigNumber(reduction_rate)).toNumber();
        coordinate.y = BigNumber(coordinate.y).times(BigNumber(reduction_rate)).toNumber();
      }
    }
  };

  //起点調整
  moveCoordinateOrigin = (left_top: TypePosition) => {
    for (let i = 0; i < this.graph_coordinate_list.length; i++) {
      const gce = this.graph_coordinate_list[i];
      const coordinates = gce.coordinates;
      const pos_order = gce.pos_order;
      for (let coordinate of coordinates.values()) {
        coordinate.x = coordinate.x - left_top.x;
        coordinate.y = coordinate.y - left_top.y;
      }
    }
  };

  searchCoordinateLeftTop = (): TypePosition => {
    let x_min = Number.MAX_SAFE_INTEGER;
    let y_min = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < this.graph_coordinate_list.length; i++) {
      const gce = this.graph_coordinate_list[i];
      const coordinates = gce.coordinates;
      const pos_order = gce.pos_order;

      for (let coordinate of coordinates.values()) {
        if (x_min > coordinate.x) {
          x_min = coordinate.x;
        }
        if (y_min > coordinate.y) {
          y_min = coordinate.y;
        }
      }
    }

    return { x: x_min, y: y_min };
  };
  searchCoordinateRightBottom = (): TypePosition => {
    let x_max = Number.MIN_SAFE_INTEGER;
    let y_max = Number.MIN_SAFE_INTEGER;

    for (let i = 0; i < this.graph_coordinate_list.length; i++) {
      const gce = this.graph_coordinate_list[i];
      const coordinates = gce.coordinates;
      const pos_order = gce.pos_order;

      for (let coordinate of coordinates.values()) {
        if (x_max < coordinate.x) {
          x_max = coordinate.x;
        }
        if (y_max < coordinate.y) {
          y_max = coordinate.y;
        }
      }
    }

    return { x: x_max, y: y_max };
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
        const paths = paraser_railroad_section.generatePath();

        return paths;
      }
      case "Station": {
        const parser_station_section = new ParserStation(this.edit_data, this.gis_info, layer_uuid, unit_id, unit_type);
        parser_station_section.coordinateAggregation();
        const points = parser_station_section.generatePoint();
        return points;
      }
      case "Coast": {
        const paraser_railroad_section = new ParserCoast(this.edit_data, this.gis_info, layer_uuid, unit_id, unit_type);
        const paths = paraser_railroad_section.generatePath();
        return paths;
      }
      default:
        break;
    }
  };
}

export default Parser;
