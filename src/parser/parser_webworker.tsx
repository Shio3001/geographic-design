import Parser from "./parser";

self.addEventListener(
  "message",
  async (e) => {
    console.log("webworker");
    const parser: Parser = new Parser(e.data.edit_data, e.data.gis_info);
    await parser.parser();
    parser.scaling();
    const svg = parser.toSVG();
    self.postMessage(svg);
  },
  false
);
// export default url;
