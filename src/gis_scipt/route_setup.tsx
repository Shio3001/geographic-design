import { TypeJsonGISRailroadSection, TypeJsonGISStation, TypeJsonCoast, TypeJsonCoastPref, TypeGisUnit, TypeGisUnits, TypeGISInfo } from "./route_type";

const N02_05_RailroadSection_json: TypeJsonGISRailroadSection = require("./GSI_GIS/N02-05_RailroadSection.json");
const N02_22_RailroadSection_json: TypeJsonGISRailroadSection = require("./GSI_GIS/N02-22_RailroadSection.json");
const N02_23_RailroadSection_json: TypeJsonGISRailroadSection = require("./GSI_GIS/N02-23_RailroadSection.json");

const N02_05_Station_json: TypeJsonGISStation = require("./GSI_GIS//N02-05_Station.json");
const N02_22_Station_json: TypeJsonGISStation = require("./GSI_GIS//N02-22_Station.json");
const N02_23_Station_json: TypeJsonGISStation = require("./GSI_GIS//N02-23_Station.json");

const Hokkaido_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Hokkaido-23_Coast.json");
const Aomori_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Aomori-23_Coast.json");
const Iwate_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Iwate-23_Coast.json");
const Miyagi_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Miyagi-23_Coast.json");
const Akita_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Akita-23_Coast.json");
const Yamagata_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Yamagata-23_Coast.json");
const Fukushima_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Fukushima-23_Coast.json");
const Ibaraki_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Ibaraki-23_Coast.json");
const Chiba_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Chiba-23_Coast.json");
const Tokyo_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Tokyo-23_Coast.json");
const Kanagawa_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Kanagawa-23_Coast.json");
const Niigata_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Niigata-23_Coast.json");
const Toyama_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Toyama-23_Coast.json");
const Ishikawa_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Ishikawa-23_Coast.json");
const Fukui_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Fukui-23_Coast.json");
const Shizuoka_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Shizuoka-23_Coast.json");
const Aichi_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Aichi-23_Coast.json");
const Mie_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Mie-23_Coast.json");
const Kyoto_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Kyoto-23_Coast.json");
const Osaka_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Osaka-23_Coast.json");
const Hyogo_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Hyogo-23_Coast.json");
const Wakayama_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Wakayama-23_Coast.json");
const Tottori_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Tottori-23_Coast.json");
const Shimane_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Shimane-23_Coast.json");
const Okayama_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Okayama-23_Coast.json");
const Hiroshima_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Hiroshima-23_Coast.json");
const Yamaguchi_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Yamaguchi-23_Coast.json");
const Tokushima_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Tokushima-23_Coast.json");
const Kagawa_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Kagawa-23_Coast.json");
const Ehime_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Ehime-23_Coast.json");
const Kochi_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Kochi-23_Coast.json");
const Fukuoka_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Fukuoka-23_Coast.json");
const Saga_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Saga-23_Coast.json");
const Nagasaki_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Nagasaki-23_Coast.json");
const Kumamoto_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Kumamoto-23_Coast.json");
const Oita_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Oita-23_Coast.json");
const Miyazaki_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Miyazaki-23_Coast.json");
const Kagoshima_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Kagoshima-23_Coast.json");
const Okinawa_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Okinawa-23_Coast.json");

const lake_05: Array<TypeJsonCoastPref> = require("./GSI_GIS/lake-05.json");

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

  // const Fukui_23_Coast_json_type = Fukui_23_Coast as Array<TypeJsonCoastPref>;
  // const Ishikawa_23_Coast_json_type = Ishikawa_23_Coast as Array<TypeJsonCoastPref>;
  // const Toyama_23_Coast_json_type = Toyama_23_Coast as Array<TypeJsonCoastPref>;
  // const Niigata_23_Coast_json_type = Niigata_23_Coast as Array<TypeJsonCoastPref>;
  // const Shizuoka_23_Coast_json_type = Shizuoka_23_Coast as Array<TypeJsonCoastPref>;
  // const Aichi_23_Coast_json_type = Aichi_23_Coast as Array<TypeJsonCoastPref>;
  // const Mie_23_Coast_json_type = Mie_23_Coast as Array<TypeJsonCoastPref>;

  coast23pref = coast23pref.concat(
    Hokkaido_23_Coast,
    Aomori_23_Coast,
    Iwate_23_Coast,
    Miyagi_23_Coast,
    Akita_23_Coast,
    Yamagata_23_Coast,
    Fukushima_23_Coast,
    Ibaraki_23_Coast,
    Chiba_23_Coast,
    Tokyo_23_Coast,
    Kanagawa_23_Coast,
    Niigata_23_Coast,
    Toyama_23_Coast,
    Ishikawa_23_Coast,
    Fukui_23_Coast,
    Shizuoka_23_Coast,
    Aichi_23_Coast,
    Mie_23_Coast,
    Kyoto_23_Coast,
    Osaka_23_Coast,
    Hyogo_23_Coast,
    Wakayama_23_Coast,
    Tottori_23_Coast,
    Shimane_23_Coast,
    Okayama_23_Coast,
    Hiroshima_23_Coast,
    Yamaguchi_23_Coast,
    Tokushima_23_Coast,
    Kagawa_23_Coast,
    Ehime_23_Coast,
    Kochi_23_Coast,
    Fukuoka_23_Coast,
    Saga_23_Coast,
    Nagasaki_23_Coast,
    Kumamoto_23_Coast,
    Oita_23_Coast,
    Miyazaki_23_Coast,
    Kagoshima_23_Coast,
    Okinawa_23_Coast
  );
  const lake23: TypeJsonCoast = { type: "FeatureCollection", name: "lake-05", features: lake_05 };
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

  gis_info.gis_data["2005_lake"] = lake23;
  gis_info.units["2005_lake"] = { unit_id: "2005_lake", name: "2005年湖沼データ", grouping_size: 2 };

  gis_info.id_type["2005_rail"] = "RailroadSection";
  gis_info.id_type["2005_station"] = "Station";

  gis_info.id_type["2022_rail"] = "RailroadSection";
  gis_info.id_type["2022_station"] = "Station";

  gis_info.id_type["2023_rail"] = "RailroadSection";
  gis_info.id_type["2023_station"] = "Station";

  gis_info.id_type["2005_lake"] = "Lake";
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
