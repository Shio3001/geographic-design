import { TypeJsonGISRailroadSection, TypeJsonGISStation, TypeJsonCoast, TypeJsonCoastPref, TypeGisUnit, TypeGisUnits, TypeGISInfo } from "./route_type";

const gis_info: TypeGISInfo = { units: {}, gis_data: {}, id_type: {} };
let gis_info_load_flag = false;

export const globalStore = new EventTarget(); // React へ通知するイベント管理

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

export const setupGisInfo = async () => {
  const N02_05_RailroadSection_ = await fetch("./GSI_GIS/N02-05_RailroadSection.json");
  const N02_22_RailroadSection = await fetch("./GSI_GIS/N02-22_RailroadSection.json");
  const N02_23_RailroadSection = await fetch("./GSI_GIS/N02-23_RailroadSection.json");

  const N02_05_Station = await fetch("./GSI_GIS//N02-05_Station.json");
  const N02_22_Station = await fetch("./GSI_GIS//N02-22_Station.json");
  const N02_23_Station = await fetch("./GSI_GIS//N02-23_Station.json");

  const N02_05_RailroadSection_json = (await N02_05_RailroadSection_.json()) as TypeJsonGISRailroadSection;
  const N02_22_RailroadSection_json = (await N02_22_RailroadSection.json()) as TypeJsonGISRailroadSection;
  const N02_23_RailroadSection_json = (await N02_23_RailroadSection.json()) as TypeJsonGISRailroadSection;

  const N02_05_Station_json = (await N02_05_Station.json()) as TypeJsonGISStation;
  const N02_22_Station_json = (await N02_22_Station.json()) as TypeJsonGISStation;
  const N02_23_Station_json = (await N02_23_Station.json()) as TypeJsonGISStation;

  const Hokkaido_23_Coast = await fetch("./GSI_GIS/Hokkaido-23_Coast.json");
  const Hokkaido_23_Coast_json = (await Hokkaido_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Aomori_23_Coast = await fetch("./GSI_GIS/Aomori-23_Coast.json");
  const Aomori_23_Coast_json = (await Aomori_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Iwate_23_Coast = await fetch("./GSI_GIS/Iwate-23_Coast.json");
  const Iwate_23_Coast_json = (await Iwate_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Miyagi_23_Coast = await fetch("./GSI_GIS/Miyagi-23_Coast.json");
  const Miyagi_23_Coast_json = (await Miyagi_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Akita_23_Coast = await fetch("./GSI_GIS/Akita-23_Coast.json");
  const Akita_23_Coast_json = (await Akita_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Yamagata_23_Coast = await fetch("./GSI_GIS/Yamagata-23_Coast.json");
  const Yamagata_23_Coast_json = (await Yamagata_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Fukushima_23_Coast = await fetch("./GSI_GIS/Fukushima-23_Coast.json");
  const Fukushima_23_Coast_json = (await Fukushima_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Ibaraki_23_Coast = await fetch("./GSI_GIS/Ibaraki-23_Coast.json");
  const Ibaraki_23_Coast_json = (await Ibaraki_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Chiba_23_Coast = await fetch("./GSI_GIS/Chiba-23_Coast.json");
  const Chiba_23_Coast_json = (await Chiba_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Tokyo_23_Coast = await fetch("./GSI_GIS/Tokyo-23_Coast.json");
  const Tokyo_23_Coast_json = (await Tokyo_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Kanagawa_23_Coast = await fetch("./GSI_GIS/Kanagawa-23_Coast.json");
  const Kanagawa_23_Coast_json = (await Kanagawa_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Niigata_23_Coast = await fetch("./GSI_GIS/Niigata-23_Coast.json");
  const Niigata_23_Coast_json = (await Niigata_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Toyama_23_Coast = await fetch("./GSI_GIS/Toyama-23_Coast.json");
  const Toyama_23_Coast_json = (await Toyama_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Ishikawa_23_Coast = await fetch("./GSI_GIS/Ishikawa-23_Coast.json");
  const Ishikawa_23_Coast_json = (await Ishikawa_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Fukui_23_Coast = await fetch("./GSI_GIS/Fukui-23_Coast.json");
  const Fukui_23_Coast_json = (await Fukui_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Shizuoka_23_Coast = await fetch("./GSI_GIS/Shizuoka-23_Coast.json");
  const Shizuoka_23_Coast_json = (await Shizuoka_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Aichi_23_Coast = await fetch("./GSI_GIS/Aichi-23_Coast.json");
  const Aichi_23_Coast_json = (await Aichi_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Mie_23_Coast = await fetch("./GSI_GIS/Mie-23_Coast.json");
  const Mie_23_Coast_json = (await Mie_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Kyoto_23_Coast = await fetch("./GSI_GIS/Kyoto-23_Coast.json");
  const Kyoto_23_Coast_json = (await Kyoto_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Osaka_23_Coast = await fetch("./GSI_GIS/Osaka-23_Coast.json");
  const Osaka_23_Coast_json = (await Osaka_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Hyogo_23_Coast = await fetch("./GSI_GIS/Hyogo-23_Coast.json");
  const Hyogo_23_Coast_json = (await Hyogo_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Wakayama_23_Coast = await fetch("./GSI_GIS/Wakayama-23_Coast.json");
  const Wakayama_23_Coast_json = (await Wakayama_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Tottori_23_Coast = await fetch("./GSI_GIS/Tottori-23_Coast.json");
  const Tottori_23_Coast_json = (await Tottori_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Shimane_23_Coast = await fetch("./GSI_GIS/Shimane-23_Coast.json");
  const Shimane_23_Coast_json = (await Shimane_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Okayama_23_Coast = await fetch("./GSI_GIS/Okayama-23_Coast.json");
  const Okayama_23_Coast_json = (await Okayama_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Hiroshima_23_Coast = await fetch("./GSI_GIS/Hiroshima-23_Coast.json");
  const Hiroshima_23_Coast_json = (await Hiroshima_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Yamaguchi_23_Coast = await fetch("./GSI_GIS/Yamaguchi-23_Coast.json");
  const Yamaguchi_23_Coast_json = (await Yamaguchi_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Tokushima_23_Coast = await fetch("./GSI_GIS/Tokushima-23_Coast.json");
  const Tokushima_23_Coast_json = (await Tokushima_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Kagawa_23_Coast = await fetch("./GSI_GIS/Kagawa-23_Coast.json");
  const Kagawa_23_Coast_json = (await Kagawa_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Ehime_23_Coast = await fetch("./GSI_GIS/Ehime-23_Coast.json");
  const Ehime_23_Coast_json = (await Ehime_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Kochi_23_Coast = await fetch("./GSI_GIS/Kochi-23_Coast.json");
  const Kochi_23_Coast_json = (await Kochi_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Fukuoka_23_Coast = await fetch("./GSI_GIS/Fukuoka-23_Coast.json");
  const Fukuoka_23_Coast_json = (await Fukuoka_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Saga_23_Coast = await fetch("./GSI_GIS/Saga-23_Coast.json");
  const Saga_23_Coast_json = (await Saga_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Nagasaki_23_Coast = await fetch("./GSI_GIS/Nagasaki-23_Coast.json");
  const Nagasaki_23_Coast_json = (await Nagasaki_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Kumamoto_23_Coast = await fetch("./GSI_GIS/Kumamoto-23_Coast.json");
  const Kumamoto_23_Coast_json = (await Kumamoto_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Oita_23_Coast = await fetch("./GSI_GIS/Oita-23_Coast.json");
  const Oita_23_Coast_json = (await Oita_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Miyazaki_23_Coast = await fetch("./GSI_GIS/Miyazaki-23_Coast.json");
  const Miyazaki_23_Coast_json = (await Miyazaki_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Kagoshima_23_Coast = await fetch("./GSI_GIS/Kagoshima-23_Coast.json");
  const Kagoshima_23_Coast_json = (await Kagoshima_23_Coast.json()) as Array<TypeJsonCoastPref>;
  const Okinawa_23_Coast = await fetch("./GSI_GIS/Okinawa-23_Coast.json");
  const Okinawa_23_Coast_json = (await Okinawa_23_Coast.json()) as Array<TypeJsonCoastPref>;

  // const Aomori_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Aomori-23_Coast.json");
  // const Iwate_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Iwate-23_Coast.json");
  // const Miyagi_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Miyagi-23_Coast.json");
  // const Akita_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Akita-23_Coast.json");
  // const Yamagata_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Yamagata-23_Coast.json");
  // const Fukushima_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Fukushima-23_Coast.json");
  // const Ibaraki_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Ibaraki-23_Coast.json");
  // const Chiba_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Chiba-23_Coast.json");
  // const Tokyo_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Tokyo-23_Coast.json");
  // const Kanagawa_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Kanagawa-23_Coast.json");
  // const Niigata_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Niigata-23_Coast.json");
  // const Toyama_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Toyama-23_Coast.json");
  // const Ishikawa_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Ishikawa-23_Coast.json");
  // const Fukui_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Fukui-23_Coast.json");
  // const Shizuoka_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Shizuoka-23_Coast.json");
  // const Aichi_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Aichi-23_Coast.json");
  // const Mie_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Mie-23_Coast.json");
  // const Kyoto_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Kyoto-23_Coast.json");
  // const Osaka_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Osaka-23_Coast.json");
  // const Hyogo_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Hyogo-23_Coast.json");
  // const Wakayama_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Wakayama-23_Coast.json");
  // const Tottori_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Tottori-23_Coast.json");
  // const Shimane_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Shimane-23_Coast.json");
  // const Okayama_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Okayama-23_Coast.json");
  // const Hiroshima_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Hiroshima-23_Coast.json");
  // const Yamaguchi_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Yamaguchi-23_Coast.json");
  // const Tokushima_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Tokushima-23_Coast.json");
  // const Kagawa_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Kagawa-23_Coast.json");
  // const Ehime_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Ehime-23_Coast.json");
  // const Kochi_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Kochi-23_Coast.json");
  // const Fukuoka_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Fukuoka-23_Coast.json");
  // const Saga_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Saga-23_Coast.json");
  // const Nagasaki_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Nagasaki-23_Coast.json");
  // const Kumamoto_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Kumamoto-23_Coast.json");
  // const Oita_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Oita-23_Coast.json");
  // const Miyazaki_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Miyazaki-23_Coast.json");
  // const Kagoshima_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Kagoshima-23_Coast.json");
  // const Okinawa_23_Coast: Array<TypeJsonCoastPref> = require("./GSI_GIS/Okinawa-23_Coast.json");

  const lake_05 = await fetch("./GSI_GIS/lake-05.json");
  const lake_05_json = (await lake_05.json()) as Array<TypeJsonCoastPref>;

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
    Hokkaido_23_Coast_json,
    Aomori_23_Coast_json,
    Iwate_23_Coast_json,
    Miyagi_23_Coast_json,
    Akita_23_Coast_json,
    Yamagata_23_Coast_json,
    Fukushima_23_Coast_json,
    Ibaraki_23_Coast_json,
    Chiba_23_Coast_json,
    Tokyo_23_Coast_json,
    Kanagawa_23_Coast_json,
    Niigata_23_Coast_json,
    Toyama_23_Coast_json,
    Ishikawa_23_Coast_json,
    Fukui_23_Coast_json,
    Shizuoka_23_Coast_json,
    Aichi_23_Coast_json,
    Mie_23_Coast_json,
    Kyoto_23_Coast_json,
    Osaka_23_Coast_json,
    Hyogo_23_Coast_json,
    Wakayama_23_Coast_json,
    Tottori_23_Coast_json,
    Shimane_23_Coast_json,
    Okayama_23_Coast_json,
    Hiroshima_23_Coast_json,
    Yamaguchi_23_Coast_json,
    Tokushima_23_Coast_json,
    Kagawa_23_Coast_json,
    Ehime_23_Coast_json,
    Kochi_23_Coast_json,
    Fukuoka_23_Coast_json,
    Saga_23_Coast_json,
    Nagasaki_23_Coast_json,
    Kumamoto_23_Coast_json,
    Oita_23_Coast_json,
    Miyazaki_23_Coast_json,
    Kagoshima_23_Coast_json,
    Okinawa_23_Coast_json
  );
  const lake23: TypeJsonCoast = { type: "FeatureCollection", name: "lake-05", features: lake_05_json };
  const coast23: TypeJsonCoast = { type: "FeatureCollection", name: "Hokkaido_23_Coast", features: coast23pref };

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
  globalStore.dispatchEvent(new Event("update")); // React に通知
  return gis_info;
};

export const getGisInfo = (): TypeGISInfo => {
  if (!gis_info_load_flag) {
    setupGisInfo();
    return null;
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
