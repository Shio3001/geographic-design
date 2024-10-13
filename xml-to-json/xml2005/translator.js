//xmlによるgisデータをjson形式のgisデータに変換するスクリプト

const fs = require("fs");
const xml2js = require("xml2js");

const xmlString = fs.readFileSync("./N02-05-g.xml", "utf8");
// console.log(text);

const parserGmlCurve = (gml_Curve) => {
  const rail = {};

  for (let i = 0; i < gml_Curve.length; i++) {
    const current_gml_Curve = gml_Curve[i];
    const current_gml_Curve_id = current_gml_Curve["$"]["gml:id"];
    const gml_LineStringSegment = current_gml_Curve["gml:segments"][0]["gml:LineStringSegment"][0]["gml:posList"];
    const pos_list_string = current_gml_Curve["gml:segments"][0]["gml:LineStringSegment"][0]["gml:posList"][0];

    const pos_list = pos_list_string.split("\r\n");

    const pos_list_format = pos_list.reduce((accumulator, element) => {
      //   console.log(element, element != "", element != "\t\t\t");
      if (element != "" && element != "\t\t\t") {
        accumulator.push(element.split(" ").reverse());
      }
      return accumulator;
    }, []);

    rail[current_gml_Curve_id] = pos_list_format;
  }
  //   console.log(rail);
  return rail;
};

const parserRailroadSection = (gml_Curve, ksj_RailroadSection) => {
  const features = [];

  for (let i = 0; i < ksj_RailroadSection.length; i++) {
    const ksj_RailroadSection_list = ksj_RailroadSection[i];
    // console.log(ksj_RailroadSection_list);
    const current_gml_Curve_id = ksj_RailroadSection_list["ksj:location"][0]["$"]["xlink:href"].replace("#", "");
    const ksj_railwayType = ksj_RailroadSection_list["ksj:railwayType"][0];
    const ksj_serviceProviderType = ksj_RailroadSection_list["ksj:serviceProviderType"][0];
    const ksj_railwayLineName = ksj_RailroadSection_list["ksj:railwayLineName"][0];
    const ksj_operationCompany = ksj_RailroadSection_list["ksj:operationCompany"][0];
    // console.log(current_gml_Curve_id);

    const feature = {
      type: "Feature",
      properties: { N02_001: ksj_railwayType, N02_002: ksj_serviceProviderType, N02_003: ksj_railwayLineName, N02_004: ksj_operationCompany },
      geometry: { type: "LineString", coordinates: gml_Curve[current_gml_Curve_id] },
    };
    // console.log(feature);
    features.push(feature);
  }

  return features;
};
const parserStation = (gml_Curve, ksj_Station) => {
  const features = [];

  for (let i = 0; i < ksj_Station.length; i++) {
    const ksj_Station_list = ksj_Station[i];
    // console.log(ksj_RailroadSection_list);
    const current_gml_Curve_id = ksj_Station_list["ksj:location"][0]["$"]["xlink:href"].replace("#", "");
    const ksj_railwayType = ksj_Station_list["ksj:railwayType"][0];
    const ksj_serviceProviderType = ksj_Station_list["ksj:serviceProviderType"][0];
    const ksj_railwayLineName = ksj_Station_list["ksj:railwayLineName"][0];
    const ksj_operationCompany = ksj_Station_list["ksj:operationCompany"][0];
    const ksj_stationName = ksj_Station_list["ksj:stationName"][0];
    // console.log(current_gml_Curve_id);

    const feature = {
      type: "Feature",
      properties: {
        N02_001: ksj_railwayType,
        N02_002: ksj_serviceProviderType,
        N02_003: ksj_railwayLineName,
        N02_004: ksj_operationCompany,
        N02_005: ksj_stationName,
        N02_005c: -1,
        N02_005g: -1,
      },
      geometry: { type: "LineString", coordinates: gml_Curve[current_gml_Curve_id] },
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
  //   console.log(result);
  //   console.log(result);

  const ksj_Dataset = result["ksj:Dataset"];
  const gml_Curve = ksj_Dataset["gml:Curve"];
  const ksj_RailroadSection = ksj_Dataset["ksj:RailroadSection"];
  const ksj_Station = ksj_Dataset["ksj:Station"];

  //   console.log(ksj_RailroadSection);
  const parse_gml_Curve = parserGmlCurve(gml_Curve);

  // const parse_rail = parserRailroadSection(parse_gml_Curve, ksj_RailroadSection);
  // const rail_data = { type: "FeatureCollection", name: "N02-05_RailroadSection", features: parse_rail };

  // const rail_data_json = JSON.stringify(rail_data);
  // fs.writeFileSync("N02-05_RailroadSection.json", rail_data_json);

  const parse_station = parserStation(parse_gml_Curve, ksj_Station);
  const station_data = { type: "FeatureCollection", name: "N02-05_Station", features: parse_station };

  const station_data_json = JSON.stringify(station_data);
  fs.writeFileSync("N02-05_Station.json", station_data_json);
});
