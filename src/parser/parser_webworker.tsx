import ParserController from "./parser_controller";

self.addEventListener(
  "message",
  async (e) => {
    console.log("webworker");
    const parser: ParserController = new ParserController(e.data.edit_data, e.data.gis_info);
    await parser.parser();
    parser.scaling();
    const svg = parser.toSVG();
    self.postMessage(svg);
  },
  false
);
// export default url;
