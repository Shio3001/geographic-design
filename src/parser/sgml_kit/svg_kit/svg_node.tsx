import EditData from "../../../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../../../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeSVGCommand } from "../../../gis_scipt/route_type";

class SvgNode {
  tag: string;
  children: Array<number>;
  element: string;
  attributes: { [key: string]: string };
  svg_command: Array<TypeSVGCommand>;
  svg_comment: Array<string>;
  //   svg_path_command { }

  constructor() {
    this.tag = "";
    this.children = [];
    this.element = "";
    this.attributes = {};
    this.svg_command = [];
    this.svg_comment = [];
  }

  generate = (svg_tree: Array<SvgNode>): string => {
    const comm = this.generateComment();
    const start = this.generateStartTag();
    const element = this.generateElementTag();
    const children_node = this.generateChildren(svg_tree);
    const end = this.generateEndTag();
    const text = comm + " " + start + " " + element + " " + children_node + " " + end + " ";
    return text;
  };

  pushSvgCommand = (command: string, x: number, y: number) => {
    const xs = String(x);
    const ys = String(y);

    const c: TypeSVGCommand = { command: command, x: xs, y: ys };
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

  pushComment = (comment: string) => {
    this.svg_comment.push(comment);
  };

  pushAttributeNum = (k: string, v: number) => {
    this.attributes[k] = v.toString();
  };
  generateSvgCommand = (): string => {
    if (this.svg_command.length == 0) {
      return "";
    }

    let command = "";

    command += "d=" + '"';

    for (let i = 0; i < this.svg_command.length; i++) {
      const current_svg_command = this.svg_command[i];
      let at = " ";
      at += current_svg_command.command;

      if (current_svg_command.x != "none") {
        at += " ";
        at += current_svg_command.x;
      }
      if (current_svg_command.y != "none") {
        at += " ";
        at += current_svg_command.y;
      }

      command += at;
    }
    command += '"';

    return command;
  };

  generateStartTag = (): string => {
    return "<" + this.tag + " " + this.generateAttributeTag() + " " + this.generateSvgCommand() + " " + ">";
  };
  generateElementTag = (): string => {
    return this.element;
  };
  generateEndTag = (): string => {
    return "</" + this.tag + ">";
  };
  generateComment = (): string => {
    let coment_text = "";

    for (let i = 0; i < this.svg_comment.length; i++) {
      const comment = this.svg_comment[i];

      //<!--次のsvg要素でのviewBoxの範囲-->

      const at = "<!--" + comment + "-->\n";
      coment_text += at;
    }

    return coment_text;
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

      const at = " " + key + " = " + '"' + val + '"' + " ";
      attribute += at;
    }

    return attribute;
  };
}

export default SvgNode;
