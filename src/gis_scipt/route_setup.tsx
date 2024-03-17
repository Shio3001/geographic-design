import { TypeJsonGISRailroadSection, TypeJsonGISStation, TypeGisUnit, TypeGisUnits, TypeGISInfo } from "./route_type";

const N02_22_RailroadSection_json: TypeJsonGISRailroadSection = require("./GSI_GIS/N02-22_RailroadSection.json");
const N02_22_Station_json: TypeJsonGISStation = require("./GSI_GIS//N02-22_Station.json");

// import N02_22_RailroadSection_json from "./GSI_GIS/N02-22_RailroadSection.json";
// import N02_22_Station_json from "./GSI_GIS/N02-22_Station.json";

const gis_info: TypeGISInfo = { units: {}, gis_data: {} };
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

  const N02_22_RailroadSection_json_type = N02_22_RailroadSection_json as TypeJsonGISRailroadSection;
  const N02_22_Station_json_type = N02_22_Station_json as TypeJsonGISStation;

  gis_info.gis_data["Unnecessary"] = N02_22_RailroadSection_json_type;
  gis_info.units["Unnecessary"] = { unit_id: "Unnecessary", unit_type: "Unnecessary", name: "未選択", grouping_size: 0 };

  gis_info.gis_data["2022_rail"] = N02_22_RailroadSection_json_type;
  gis_info.units["2022_rail"] = { unit_id: "2022_rail", unit_type: "RailroadSection", name: "2022年路線データ", grouping_size: 2 };

  gis_info.gis_data["2022_station"] = N02_22_Station_json_type;
  gis_info.units["2022_station"] = { unit_id: "2022_station", unit_type: "Station", name: "2022年駅データ", grouping_size: 2 };
  gis_info_load_flag = true;
  return gis_info;
};

export const getGisInfo = (): TypeGISInfo => {
  if (!gis_info_load_flag) {
    return setupGisInfo();
  }
  return gis_info;
};

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
