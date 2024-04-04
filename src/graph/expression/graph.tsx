import EditData from "../../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeJsonCoordinates } from "../../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../../gis_scipt/gis_unique_data";

import SvgKit from "../../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../../parser/sgml_kit/svg_kit/svg_node";
import { caclcAngleByPosition, radian90 } from "../../mathematical/dimension_two";

import GraphNode from "./graph_node";
import { copyObject } from "./../../definition";

class Graph {
  graph: Map<string, GraphNode>;

  constructor() {
    this.graph = new Map();
  }

  pushNode = (node: GraphNode) => {
    if (!this.graph.has(node.node_id)) {
      this.graph.set(node.node_id, node);
    } else {
      const c_node = this.graph.get(node.node_id);

      for (let i = 0; i < node.bidirectional_link_id_list.length; i++) {
        const bidirectional_link_id = node.bidirectional_link_id_list[i];
        c_node.pushBidirectionalLinkNode(bidirectional_link_id);
      }
      this.graph.set(node.node_id, c_node);
    }
    for (let i = 0; i < node.bidirectional_link_id_list.length; i++) {
      const link_id = node.bidirectional_link_id_list[i];
      const link_node = this.graph.get(link_id);
      link_node.pushBidirectionalLinkNode(node.node_id);
      this.graph.set(link_id, link_node);
    }
  };
  getTerminationPointID = (): Array<string> => {
    if (this.graph.size == 0) {
      return [];
    }

    let bn: Array<string> = [];
    let branch = 1;

    while (bn.length == 0) {
      bn = this.getPointID(branch);
      branch++;
    }

    return bn;
  };

  getOddBranchPointID = (): Array<string> => {
    const t_id: Array<string> = [];

    const itr_node_keys = this.graph.keys();
    const node_keys = Array.from(itr_node_keys);

    for (let i = 0; i < node_keys.length; i++) {
      const node_key = node_keys[i];
      const node = this.graph.get(node_key);
      if (node.bidirectional_link_id_list.length % 2 == 1 && node.bidirectional_link_id_list.length >= 3) {
        t_id.push(node_key);
        continue;
      }
    }

    return t_id;
  };

  getEvenBranchPointID = (): Array<string> => {
    const t_id: Array<string> = [];

    const itr_node_keys = this.graph.keys();
    const node_keys = Array.from(itr_node_keys);

    for (let i = 0; i < node_keys.length; i++) {
      const node_key = node_keys[i];
      const node = this.graph.get(node_key);
      if (node.bidirectional_link_id_list.length % 2 == 0 && node.bidirectional_link_id_list.length >= 4) {
        t_id.push(node_key);
        continue;
      }
    }

    return t_id;
  };

  getOddPointID = (): Array<string> => {
    const t_id: Array<string> = [];

    const itr_node_keys = this.graph.keys();
    const node_keys = Array.from(itr_node_keys);

    for (let i = 0; i < node_keys.length; i++) {
      const node_key = node_keys[i];
      const node = this.graph.get(node_key);
      if (node.bidirectional_link_id_list.length % 2 == 1) {
        t_id.push(node_key);
        continue;
      }
    }

    return t_id;
  };

  getEvenPointID = (): Array<string> => {
    const t_id: Array<string> = [];

    const itr_node_keys = this.graph.keys();
    const node_keys = Array.from(itr_node_keys);

    for (let i = 0; i < node_keys.length; i++) {
      const node_key = node_keys[i];
      const node = this.graph.get(node_key);
      if (node.bidirectional_link_id_list.length % 2 == 0) {
        t_id.push(node_key);
        continue;
      }
    }

    return t_id;
  };

  getPointID = (branch: number): Array<string> => {
    const t_id: Array<string> = [];

    const itr_node_keys = this.graph.keys();
    const node_keys = Array.from(itr_node_keys);

    for (let i = 0; i < node_keys.length; i++) {
      const node_key = node_keys[i];
      const node = this.graph.get(node_key);
      if (node.bidirectional_link_id_list.length == branch) {
        t_id.push(node_key);
        continue;
      }
    }

    return t_id;
  };

  replaceLinkNode = (node_id: string, old_id: string, new_id: string) => {
    const node = this.graph.get(node_id);

    for (let i = 0; i < node.bidirectional_link_id_list.length; i++) {
      if (node.bidirectional_link_id_list[i] == old_id) {
        node.bidirectional_link_id_list[i] = new_id;
      }
    }
  };

  //even_point_idで指定しているノードの接続先のうち、extraction_link_id_listのみと共に分離する
  separationLinkNode = (even_point_id: string, extraction_link_id_list: Array<string>, symbol: string) => {
    const even_point_node = this.graph.get(even_point_id);

    const event_point_node_copy1 = copyObject(even_point_node);
    const event_point_node_copy2 = copyObject(even_point_node);

    event_point_node_copy1.bidirectional_link_id_list = even_point_node.bidirectional_link_id_list.filter((element, index) =>
      extraction_link_id_list.includes(element)
    );
    event_point_node_copy2.bidirectional_link_id_list = even_point_node.bidirectional_link_id_list.filter(
      (element, index) => !extraction_link_id_list.includes(element)
    );

    const old_copy1_id = even_point_node.node_id;
    const new_copy1_id = old_copy1_id + symbol;
    event_point_node_copy1.node_id = new_copy1_id;

    for (let i = 0; i < extraction_link_id_list.length; i++) {
      this.replaceLinkNode(extraction_link_id_list[i], old_copy1_id, new_copy1_id);
    }

    this.graph.set(event_point_node_copy1.node_id, event_point_node_copy1);
    this.graph.set(event_point_node_copy2.node_id, event_point_node_copy2);

    return new_copy1_id;
  };

  intersectionExtraction = () => {
    const extraction = (even_point_index: string) => {
      const even_point_node = this.graph.get(even_point_index);
      const b_link_list = even_point_node.bidirectional_link_id_list;

      let max_radian = Number.MIN_SAFE_INTEGER;
      let extraction_id_list: Array<string> = [];

      for (let i = 0; i < b_link_list.length; i++) {
        const b_link_out_id = b_link_list[i];
        const b_link_out_node = this.graph.get(b_link_out_id);
        for (let j = i + 1; j < b_link_list.length; j++) {
          const b_link_in_id = b_link_list[j];
          const b_link_in_node = this.graph.get(b_link_in_id);

          const c_radian = caclcAngleByPosition(
            { x: even_point_node.x, y: even_point_node.y },
            { x: b_link_out_node.x, y: b_link_out_node.y },
            { x: b_link_in_node.x, y: b_link_in_node.y }
          );

          if (max_radian < c_radian) {
            max_radian = c_radian;
            extraction_id_list = [b_link_out_id, b_link_in_id];
          }
        }
      }

      return extraction_id_list;
    };

    //4つから2つを抽出したとき、のこり2つによって鋭角が形成されていないかをチェック。鋭角であれば処理を中断
    const isAcuteAngle = (even_point_index: string, extraction_id_list: Array<String>) => {
      const even_point_node = this.graph.get(even_point_index);
      const b_link_list = even_point_node.bidirectional_link_id_list;

      const another_extraction_id_list = b_link_list.filter((element, index) => !extraction_id_list.includes(element));

      if (another_extraction_id_list.length != 2) {
        return false;
      }
      const b_link_out_1 = this.graph.get(another_extraction_id_list[0]);
      const b_link_out_2 = this.graph.get(another_extraction_id_list[1]);
      const c_radian = caclcAngleByPosition(
        { x: even_point_node.x, y: even_point_node.y },
        { x: b_link_out_1.x, y: b_link_out_1.y },
        { x: b_link_out_2.x, y: b_link_out_2.y }
      );

      return c_radian <= radian90;
    };

    let even_point_list = this.getEvenBranchPointID();

    while (even_point_list.length > 0) {
      const even_point_id = even_point_list[0];
      const extraction_link_id_list = extraction(even_point_id);
      const is_another_acute = isAcuteAngle(even_point_id, extraction_link_id_list);
      const new_even_point_id = this.separationLinkNode(even_point_id, extraction_link_id_list, "s");

      if (is_another_acute) {
        const even_node = this.graph.get(even_point_id);
        const even_new_node = this.graph.get(new_even_point_id);

        even_node.bidirectional_link_id_list.push(new_even_point_id);
        even_new_node.bidirectional_link_id_list.push(even_point_id);
      }

      console.log("even_point_list", even_point_list);

      even_point_list = this.getEvenBranchPointID();
    }
  };

  loopLinePoint = (termination_point_branch_1: Array<string>, termination_point_branch_2: Array<string>) => {
    const branch2node_id = termination_point_branch_2[0];
    const branch2node = this.graph.get(branch2node_id);

    const branch2node_copy1 = copyObject(branch2node);
    const branch2node_copy2 = copyObject(branch2node);

    branch2node_copy1.bidirectional_link_id_list = [branch2node.bidirectional_link_id_list[0]];
    branch2node_copy2.bidirectional_link_id_list = [branch2node.bidirectional_link_id_list[1]];
    const old_copy2_id = branch2node_copy2.node_id;
    const new_copy2_id = old_copy2_id + "c";
    branch2node_copy2.node_id = new_copy2_id;

    this.graph.set(branch2node_copy1.node_id, branch2node_copy1);
    this.graph.set(branch2node_copy2.node_id, branch2node_copy2);

    this.replaceLinkNode(branch2node.bidirectional_link_id_list[1], old_copy2_id, new_copy2_id);

    console.log("環状閉路分割", branch2node_copy1, branch2node_copy2, old_copy2_id, new_copy2_id);
  };
}

export default Graph;
