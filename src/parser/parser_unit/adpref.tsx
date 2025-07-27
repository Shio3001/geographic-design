import EditData from "../../component/ctrl_dataflow/edit_data/edit_data";
import { TypeGISInfo, TypeJsonCoordinates, TypeGeometry, TypeGeometry3D } from "../../gis_scipt/route_type";

import SvgNode from "../sgml_kit/svg_kit/svg_node";
import GraphCoordinateExpression from "../../graph/expression/coordinate_expression";
import { CashGeometry, searchGisConditional, getGeometry } from "../../gis_scipt/gis_unique_data";
import BigNumber from "bignumber.js";
import * as GEO from "../../geographic_constant";
import { RemoveLineMap } from "./../remove_line_map";
import Parser from "./parser";

class ParserAdPref extends Parser {
  generatePath = async (remove_line: RemoveLineMap) => {
    const current_layer = this.edit_data.layers[this.layer_uuid];
    const path_join_flag = current_layer.layer_infomation["path_join"] == "ok";
    const threshold = Number(current_layer.layer_infomation["threshold"]);
    const thinoout = Number(current_layer.layer_infomation["thinoout"]);
    const remove_duplicate_lines = current_layer.layer_infomation["remove_duplicate_lines"] == "ok";

    const cg = new CashGeometry();

    const geometry_index = searchGisConditional(this.gis_info, this.unit_id, {
      N03_001: current_layer.layer_infomation["pref"],
    });

    const joinPath = async () => {
      const sort_paths_array: Array<GraphCoordinateExpression> = []; //長い順にソートされたパス
      for (let i = 0; i < geometry_index.length; i++) {
        const current_geometry = (await getGeometry(cg, this.gis_info, this.unit_id, geometry_index[i])) as TypeGeometry3D;

        for (let j = 0; j < current_geometry.coordinates.length; j++) {
          const pcd = this.parseCoordinates(current_geometry.coordinates[j]);
          this.updateLayerRunningCount(this.layer_uuid);
          const gced = remove_duplicate_lines ? this.duplicate(pcd, remove_line) : [pcd];

          for (let k = 0; k < gced.length; k++) {
            const gce_length = gced[k].pos_order.length;

            //gce_lengthの数が多い順に挿入する
            for (let l = 0; l <= sort_paths_array.length; l++) {
              if (l >= sort_paths_array.length - 1) {
                sort_paths_array.push(gced[k]);
                break;
              }
              if (sort_paths_array[l].pos_order.length <= gce_length) {
                sort_paths_array.splice(l, 0, gced[k]);
                break;
              }
            }
          }
        }
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
          i++;
        }
      }

      if (thinoout > 0) {
        for (let i = 0; i < sort_paths_array.length; i++) {
          const last = sort_paths_array[i].pos_order.length - 1;
          sort_paths_array[i].pos_order = sort_paths_array[i].pos_order.filter((element, index) => index % thinoout == 0 || index == last);
        }
      }

      console.log("sort_paths_array", sort_paths_array.length);
      return sort_paths_array;
    };

    //パスの結合処理を行う場合
    if (path_join_flag) {
      return await joinPath();
    }

    const paths_array: Array<GraphCoordinateExpression> = [];
    for (let i = 0; i < geometry_index.length; i++) {
      const current_geometry = (await getGeometry(cg, this.gis_info, this.unit_id, geometry_index[i])) as TypeGeometry3D;

      for (let j = 0; j < current_geometry.coordinates.length; j++) {
        const pcd = this.parseCoordinates(current_geometry.coordinates[j]);
        this.updateLayerRunningCount(this.layer_uuid);
        const gced = remove_duplicate_lines ? this.duplicate(pcd, remove_line) : [pcd];

        for (let k = 0; k < gced.length; k++) {
          const gce_length = gced[k].pos_order.length;

          if (gce_length < threshold) {
            continue;
          }

          paths_array.push(gced[k]);
        }
      }
    }
    return paths_array;
  };
}

export default ParserAdPref;
