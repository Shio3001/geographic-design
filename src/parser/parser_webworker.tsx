import Parser from "./parser";

self.addEventListener(
  "message",
  (e) => {
    console.log("webworker");
    const parser: Parser = new Parser(e.data.edit_data, e.data.gis_info);
    parser.parser();
    parser.scaling();
    const svg = parser.toSVG();
    self.postMessage(svg);
  },
  false
);
// export default url;
