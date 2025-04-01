import EditData from "../../component/ctrl_dataflow/edit_data/edit_data";
import { TypeGISInfo, TypeJsonCoordinates, TypeGeometry, TypeGeometry3D } from "../../gis_scipt/route_type";

import SvgNode from "../sgml_kit/svg_kit/svg_node";
import GraphCoordinateExpression from "./../../graph/expression/coordinate_expression";
import { CashGeometry, searchGisConditional, getGeometry } from "./../../gis_scipt/gis_unique_data";
import BigNumber from "bignumber.js";
import * as GEO from "./../../geographic_constant";

import { RemoveLineMap } from "./../remove_line_map";

class ParserAd {
  edit_data: EditData;
  gis_info: TypeGISInfo;
  layer_uuid: string;
  unit_id: string;
  unit_type: string;

  constructor(edit_data: EditData, gis_info: TypeGISInfo, layer_uuid: string, unit_id: string, unit_type: string) {
    this.edit_data = edit_data;
    this.gis_info = gis_info;
    this.layer_uuid = layer_uuid;
    this.unit_id = unit_id;
    this.unit_type = unit_type;
  }

  generatePath = async (remove_line: RemoveLineMap) => {
    const current_layer = this.edit_data.layers[this.layer_uuid];
    const path_join_flag = current_layer.layer_infomation["path_join"] == "ok";
    const threshold = Number(current_layer.layer_infomation["threshold"]);
    const thinoout = Number(current_layer.layer_infomation["thinoout"]);
    const remove_duplicate_lines = current_layer.layer_infomation["remove_duplicate_lines"] == "ok";

    const cg = new CashGeometry();

    const geometry_index = searchGisConditional(this.gis_info, this.unit_id, {
      N03_007: current_layer.layer_infomation["administrative"],
    });

    console.log("generatePath", geometry_index, current_layer.layer_infomation);

    const duplicate = (line: GraphCoordinateExpression): Array<GraphCoordinateExpression> => {
      // lineの重複を削除する。必要に応じて分割する

      const lines: Array<GraphCoordinateExpression> = [];
      let latest = 0;

      for (let i = 0; i < line.pos_order.length - 1; i++) {
        const coordinate_id_0 = line.pos_order[i];
        const coordinate_id_1 = line.pos_order[i + 1];

        if (remove_line.hasRemoveLineMap(coordinate_id_0, coordinate_id_1)) {
          const section_patn = line.getSectionPath(latest, i);
          lines.push(section_patn);
          latest = i + 1;
        }

        remove_line.pushRemoveLineMap(coordinate_id_0, coordinate_id_1);
      }

      const latest_section_patn = line.getSectionPath(latest, line.pos_order.length - 1);
      lines.push(latest_section_patn);

      return lines;
    };

    const joinPath = async () => {
      const sort_paths_array: Array<GraphCoordinateExpression> = []; //長い順にソートされたパス
      for (let i = 0; i < geometry_index.length; i++) {
        const current_geometry = (await getGeometry(cg, this.gis_info, this.unit_id, geometry_index[i])) as TypeGeometry3D;

        const pcd = this.parseCoordinates(current_geometry.coordinates.flat());
        const gced = remove_duplicate_lines ? duplicate(pcd) : [pcd];

        for (let j = 0; j < gced.length; j++) {
          const gce_length = gced[j].pos_order.length;

          //gce_lengthの数が多い順に挿入する
          for (let k = 0; k <= sort_paths_array.length; k++) {
            if (k >= sort_paths_array.length - 1) {
              sort_paths_array.push(gced[j]);
              break;
            }
            if (sort_paths_array[k].pos_order.length <= gce_length) {
              sort_paths_array.splice(k, 0, gced[j]);
              break;
            }
          }
        }
      }
      console.log("ParserCoast", path_join_flag, sort_paths_array);

      for (let i = 0; i < sort_paths_array.length; i++) {
        console.log("sort_paths_array", i, sort_paths_array[i].coordinates, sort_paths_array[i].pos_order.length);
      }

      const concat = () => {
        let cc = 0;

        let i = 0;
        while (i < sort_paths_array.length) {
          let j = i + 1;
          while (j < sort_paths_array.length) {
            const path_1 = sort_paths_array[i];
            const path_2 = sort_paths_array[j];

            // 継 継
            if (path_1.getLastNodeId() == path_2.getFirstNodeId()) {
            }

            // 継 反
            else if (path_1.getLastNodeId() == path_2.getLastNodeId()) {
              path_2.reversePosOrder();
            }

            // 反 継
            else if (path_1.getFirstNodeId() == path_2.getFirstNodeId()) {
              path_1.reversePosOrder();
            }

            // 反 反
            else if (path_1.getFirstNodeId() == path_2.getLastNodeId()) {
              path_1.reversePosOrder();
              path_2.reversePosOrder();
            } else {
              j++;
              continue;
            }
            console.log("concat", i, j, path_1.getFirstNodeId(), path_1.getLastNodeId(), path_2.getFirstNodeId(), path_2.getLastNodeId());
            path_1.includePathOrder(path_2, 0);
            sort_paths_array[i] = path_1;
            sort_paths_array.splice(j, 1);
            cc++;
          }
          i++;
        }
        return cc;
      };

      let concat_count = concat();
      while (concat_count > 0) {
        concat_count = concat();
      }

      let i = 0;
      while (i < sort_paths_array.length) {
        if (sort_paths_array[i].pos_order.length < threshold) {
          sort_paths_array.splice(i, 1);
        } else {
          console.log("sort_paths_array", i, threshold, sort_paths_array[i].pos_order.length);
          i++;
        }
      }

      if (thinoout > 0) {
        for (let i = 0; i < sort_paths_array.length; i++) {
          const last = sort_paths_array[i].pos_order.length - 1;
          sort_paths_array[i].pos_order = sort_paths_array[i].pos_order.filter((element, index) => index % thinoout == 0 || index == last);
        }
      }

      //   for (let i = 0; i < sort_paths_array.length; i++) {
      //     console.log("sort_paths_array", i, sort_paths_array[i].pos_order.length);
      //   }

      return sort_paths_array;
    };

    //パスの結合処理を行う場合
    if (path_join_flag) {
      return await joinPath();
    }

    const paths_array: Array<GraphCoordinateExpression> = [];
    for (let i = 0; i < geometry_index.length; i++) {
      const current_geometry = (await getGeometry(cg, this.gis_info, this.unit_id, geometry_index[i])) as TypeGeometry3D;

      const cord = current_geometry.coordinates.flat();

      if (cord.length < threshold) {
        continue;
      }

      const gce = this.parseCoordinates(cord);
      paths_array.push(gce);
    }
    return paths_array;
  };

  parseCoordinates = (coordinates: TypeJsonCoordinates) => {
    const gce = new GraphCoordinateExpression("path");

    for (let i = 0; i < coordinates.length; i++) {
      const coordinate = coordinates[i];

      const coordinate0 = new BigNumber(coordinate[0]);
      const coordinate1 = new BigNumber(coordinate[1]);

      const c0_exp = coordinate0.times(GEO.EXPANSION_CONSTANT_BIGNUMBER).div(GEO.LONGITUDE_KM1_BIGNUMBER).toNumber();
      const c1_exp = coordinate1.times(GEO.EXPANSION_CONSTANT_BIGNUMBER).div(GEO.LATITUDE_KM1_BIGNUMBER).toNumber();

      const c0_exp_dp = coordinate0.times(GEO.EXPANSION_CONSTANT_BIGNUMBER).dp(0).toString();
      const c1_exp_dp = coordinate1.times(GEO.EXPANSION_CONSTANT_BIGNUMBER).dp(0).toString();

      const id = c0_exp_dp + "p" + c1_exp_dp;
      gce.pushPosIds(id);
      gce.pushCoordinateId(id, c0_exp, c1_exp);

      console.log("parseCoordinates", id, c0_exp, c1_exp, coordinate);
    }

    return gce;
  };
}

export default ParserAd;
