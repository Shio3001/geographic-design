const fs = require("fs");
const xml2js = require("xml2js");

const xmlString = fs.readFileSync("./C23-06_18-g.xml", "utf8");

const parserGmlCurve = (gml_Curve) => {
  const curve = [];

  for (let i = 0; i < gml_Curve.length; i++) {
    const current_gml_Curve = gml_Curve[i];
    // const current_gml_Curve_id = current_gml_Curve["$"]["gml:id"];
    // console.log(current_gml_Curve);
    const id = current_gml_Curve["$"]["gml:id"];
    const LineStringSegment = current_gml_Curve["gml:segments"][0]["gml:LineStringSegment"];

    // console.log(LineStringSegment[0]["gml:posList"]);
    const pos_list_string = LineStringSegment[0]["gml:posList"][0];
    console.log(pos_list_string);
    const pos_list = pos_list_string.split("\r\n");

    const pos_list_format = pos_list.reduce((accumulator, element) => {
      if (element != "" && element != "\t\t\t") {
        accumulator.push(element.split(" ").reverse());
      }
      return accumulator;
    }, []);

    curve.push(pos_list_format);
  }
  return curve;
};

const parserCurve = (gml_Curve) => {
  const features = [];

  for (let i = 0; i < gml_Curve.length; i++) {
    const feature = {
      type: "Feature",
      properties: { pref: "福井県" },
      geometry: { type: "LineString", coordinates: gml_Curve[i] },
    };
    // console.log(feature);
    features.push(feature);
  }

  return features;
};

xml2js.parseString(xmlString, (err, result) => {
  if (err) {
    console.error(err);
    return;
  }

  const ksj_Dataset = result["ksj:Dataset"];
  const gml_Curve = ksj_Dataset["gml:Curve"];

  const parse_gml_Curve = parserGmlCurve(gml_Curve);
  console.log(parse_gml_Curve);
  const curve_data = parserCurve(parse_gml_Curve);
  const parse_gml_Curve_json = JSON.stringify(curve_data);
  fs.writeFileSync("Fukui-23_Coast.json", parse_gml_Curve_json);
});
