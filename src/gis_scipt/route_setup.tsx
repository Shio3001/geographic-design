import { TypeJsonGISRailroadSection, TypeJsonGISStation, TypeJsonCoast, TypeJsonCoastPref, TypeGisUnit, TypeGisUnits, TypeGISInfo } from "./route_type";

const N02_05_RailroadSection_json: TypeJsonGISRailroadSection = require("./GSI_GIS/N02-05_RailroadSection.json");
const N02_22_RailroadSection_json: TypeJsonGISRailroadSection = require("./GSI_GIS/N02-22_RailroadSection.json");
const N02_23_RailroadSection_json: TypeJsonGISRailroadSection = require("./GSI_GIS/N02-23_RailroadSection.json");

const N02_05_Station_json: TypeJsonGISStation = require("./GSI_GIS//N02-05_Station.json");
const N02_22_Station_json: TypeJsonGISStation = require("./GSI_GIS//N02-22_Station.json");
const N02_23_Station_json: TypeJsonGISStation = require("./GSI_GIS//N02-23_Station.json");
const Fukui_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Fukui-23_Coast.json");

const gis_info: TypeGISInfo = { units: {}, gis_data: {}, id_type: {} };
let gis_info_load_flag = false;

export const getKeysGisUnitIDs = () => {
  const keys = Object.keys(gis_info.units);
  return keys;
};

export const getNamesGisUnitIDs = () => {
  const keys = Object.keys(gis_info.units);

  const names: Array<string> = [];

  for (let i = 0; i < keys.length; i++) {
    names.push(gis_info.units[keys[i]].name);
  }

  return names;
};

export const getGisUnitIDs = () => {
  return gis_info.units;
};

export const setupGisInfo = (): TypeGISInfo => {
  console.log(N02_22_RailroadSection_json);
  console.log(N02_22_Station_json);

  const N02_05_RailroadSection_json_type = N02_05_RailroadSection_json as TypeJsonGISRailroadSection;
  const N02_22_RailroadSection_json_type = N02_22_RailroadSection_json as TypeJsonGISRailroadSection;
  const N02_23_RailroadSection_json_type = N02_23_RailroadSection_json as TypeJsonGISRailroadSection;

  const N02_05_Station_json_type = N02_05_Station_json as TypeJsonGISStation;
  const N02_22_Station_json_type = N02_22_Station_json as TypeJsonGISStation;
  const N02_23_Station_json_type = N02_23_Station_json as TypeJsonGISStation;

  let coast23pref: Array<TypeJsonCoastPref> = [];
  const Fukui_23_Coast_json_type = Fukui_23_Coast as Array<TypeJsonCoastPref>;
  coast23pref = coast23pref.concat(Fukui_23_Coast_json_type);
  const coast23: TypeJsonCoast = { type: "FeatureCollection", name: "Fukui-23_Coast", features: coast23pref };

  gis_info.gis_data["2005_rail"] = N02_05_RailroadSection_json_type;
  gis_info.units["2005_rail"] = { unit_id: "2005_rail", name: "2005年路線データ", grouping_size: 2 };

  gis_info.gis_data["2005_station"] = N02_05_Station_json_type;
  gis_info.units["2005_station"] = { unit_id: "2005_station", name: "2005年駅データ", grouping_size: 2 };

  gis_info.gis_data["2022_rail"] = N02_22_RailroadSection_json_type;
  gis_info.units["2022_rail"] = { unit_id: "2022_rail", name: "2022年路線データ", grouping_size: 2 };

  gis_info.gis_data["2022_station"] = N02_22_Station_json_type;
  gis_info.units["2022_station"] = { unit_id: "2022_station", name: "2022年駅データ", grouping_size: 2 };

  gis_info.gis_data["2023_rail"] = N02_23_RailroadSection_json_type;
  gis_info.units["2023_rail"] = { unit_id: "2022_rail", name: "2023年路線データ", grouping_size: 2 };

  gis_info.gis_data["2023_station"] = N02_23_Station_json_type;
  gis_info.units["2023_station"] = { unit_id: "2023_station", name: "2023年駅データ", grouping_size: 2 };

  gis_info.gis_data["2023_coast"] = coast23;
  gis_info.units["2023_coast"] = { unit_id: "2023_coast", name: "2023年海岸線データ", grouping_size: 2 };

  gis_info.id_type["2005_rail"] = "RailroadSection";
  gis_info.id_type["2005_station"] = "Station";

  gis_info.id_type["2022_rail"] = "RailroadSection";
  gis_info.id_type["2022_station"] = "Station";

  gis_info.id_type["2023_rail"] = "RailroadSection";
  gis_info.id_type["2023_station"] = "Station";

  gis_info.id_type["2023_coast"] = "Coast";
  console.log("gis_info_2023_rail", gis_info.gis_data["2023_rail"]);
  console.log("gis_info_2023_coast", gis_info.gis_data["2023_coast"]);

  gis_info_load_flag = true;
  return gis_info;
};

export const getGisInfo = (): TypeGISInfo => {
  if (!gis_info_load_flag) {
    return setupGisInfo();
  }
  return gis_info;
};
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
//rail data
/*
  { "type": "Feature", "properties": { "N02_001": "23", "N02_002": "5", "N02_003": "沖縄都市モノレール線", "N02_004": "沖縄都市モノレール" },
   "geometry": { "type": "LineString", "coordinates": [ [ 127.67948, 26.21454 ], [ 127.6797, 26.21474 ], [ 127.67975, 26.2148 ], [ 127.68217, 26.21728 ], [ 127.68357, 26.21862 ], [ 127.68394, 26.21891 ], [ 127.68419, 26.21905 ] ] } },
  */

//station data
/*
  { "type": "Feature", "properties": { "N02_001": "11", "N02_002": "2", "N02_003": "指宿枕崎線", "N02_004": "九州旅客鉄道", "N02_005": "二月田", "N02_005c": "010112", "N02_005g": "010112" }, 
  "geometry": { "type": "LineString", "coordinates": [ [ 130.63035, 31.25405 ], [ 130.62985, 31.25459 ] ] } },
  */

/*
  路線データ区分
  N02_001 鉄道区分    
  N02_002 事業者種別  
  N02_003 路線名      
  N02_004 運営会社    
  */

/*
  駅データ区分
  N02_001 鉄道区分
  N02_002 事業者種別
  N02_003 路線名
  N02_004 運営会社
  N02_005 駅名
  N02_005c 駅コード
  N02_005g グループコード グループコード300m以内の距離にある駅で且つ同じ名称の駅を一つのグループとし、グループの重心に最も近い駅コード	
  */
