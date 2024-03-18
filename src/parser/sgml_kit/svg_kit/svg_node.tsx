import EditData from "../../../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../../../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo } from "../../../gis_scipt/route_type";

class SvgNode {
  tag: string;
  children: Array<number>;
  element: string;
  attributes: { [key: string]: string };
  svg_command: Array<Array<string>>;
  //   svg_path_command { }

  constructor() {
    this.tag = "";
    this.children = [];
    this.element = "";
    this.attributes = {};
    this.svg_command = [];
  }

  generate = (svg_tree: Array<SvgNode>): string => {
    const start = this.generateStartTag();
    const element = this.generateElementTag();
    const children_node = this.generateChildren(svg_tree);
    const end = this.generateEndTag();
    const text = start + " " + element + " " + children_node + " " + end + " ";
    return text;
  };

  pushSvgCommand = (command: string, x?: number, y?: number) => {
    const xs = !x ? "none" : String(x);
    const ys = !y ? "none" : String(y);

    const c = [command, xs, ys];
    this.svg_command.push(c);
  };

  setTag = (tag: string) => {
    this.tag = tag;
  };
  setElement = (element: string) => {
    this.element = element;
  };
  linkChild = (c_index: number) => {
    this.children.push(c_index);
  };
  pushAttribute = (k: string, v: string) => {
    this.attributes[k] = v;
  };

  generateStartTag = (): string => {
    return "<" + this.tag + " " + this.generateAttributeTag() + " " + ">";
  };
  generateElementTag = (): string => {
    return this.element;
  };
  generateEndTag = (): string => {
    return "</" + this.tag + ">";
  };
  generateChildren = (svg_tree: Array<SvgNode>): string => {
    let text = " ";

    for (let i = 0; i < this.children.length; i++) {
      const child_index = this.children[i];
      const child_text = svg_tree[child_index].generate(svg_tree);
      text += child_text;
      text += " ";
    }

    return text;
  };
  generateAttributeTag = (): string => {
    let attribute = "";
    const keys = Object.keys(this.attributes);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const val = this.attributes[key];

      const at = " " + key + " = " + val + " ";
      attribute += at;
    }

    return attribute;
  };
}

export default SvgNode;
