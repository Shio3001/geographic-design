import {
  TypeJsonGISRailroadSection,
  TypeJsonGISStation,
  TypeJsonCoast,
  TypeJsonCoastPref,
  TypeGisUnit,
  TypeGisUnits,
  TypeGISInfo,
  TypeJsonAd,
  TypeJsonAdPref,
  TypeMergedAdInfoyMap,
} from "./route_type";

const gis_info: TypeGISInfo = { adlist: {}, units: {}, gis_data: {}, id_type: {}, file_first: {} };
let gis_info_load_flag = false;

const prefectures = [
  "Hokkaido",
  "Aomori",
  "Iwate",
  "Miyagi",
  "Akita",
  "Yamagata",
  "Fukushima",
  "Ibaraki",
  "Chiba",
  "Tokyo",
  "Kanagawa",
  "Niigata",
  "Toyama",
  "Ishikawa",
  "Fukui",
  "Shizuoka",
  "Aichi",
  "Mie",
  "Kyoto",
  "Osaka",
  "Hyogo",
  "Wakayama",
  "Tottori",
  "Shimane",
  "Okayama",
  "Hiroshima",
  "Yamaguchi",
  "Tokushima",
  "Kagawa",
  "Ehime",
  "Kochi",
  "Fukuoka",
  "Saga",
  "Nagasaki",
  "Kumamoto",
  "Oita",
  "Miyazaki",
  "Kagoshima",
  "Okinawa",
];

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
  const N02_05_RailroadSection_ = await fetch("./GSI_GIS_NO_GEOM/N02-05_RailroadSection.json");
  const N02_22_RailroadSection = await fetch("./GSI_GIS_NO_GEOM/N02-22_RailroadSection.json");
  const N02_23_RailroadSection = await fetch("./GSI_GIS_NO_GEOM/N02-23_RailroadSection.json");

  const N02_05_Station = await fetch("./GSI_GIS_NO_GEOM//N02-05_Station.json");
  const N02_22_Station = await fetch("./GSI_GIS_NO_GEOM//N02-22_Station.json");
  const N02_23_Station = await fetch("./GSI_GIS_NO_GEOM//N02-23_Station.json");

  const N02_05_RailroadSection_json = (await N02_05_RailroadSection_.json()) as TypeJsonGISRailroadSection;
  const N02_22_RailroadSection_json = (await N02_22_RailroadSection.json()) as TypeJsonGISRailroadSection;
  const N02_23_RailroadSection_json = (await N02_23_RailroadSection.json()) as TypeJsonGISRailroadSection;

  const N02_05_Station_json = (await N02_05_Station.json()) as TypeJsonGISStation;
  const N02_22_Station_json = (await N02_22_Station.json()) as TypeJsonGISStation;
  const N02_23_Station_json = (await N02_23_Station.json()) as TypeJsonGISStation;

  // const Administrative_24 = await fetch("./GSI_GIS_NO_GEOM/N03-20240101.json", { cache: "no-store" });
  // const Administrative_24_json = (await Administrative_24.json()) as TypeJsonGISAdministrative;

  // const Administrative_24_pref = await fetch("./GSI_GIS_NO_GEOM/N03-20240101_prefecture.json", { cache: "no-store" });
  // const Administrative_24_pref_json = (await Administrative_24_pref.json()) as TypeJsonGISAdministrative;

  let ad: Array<TypeJsonAdPref> = [];
  for (const pref of prefectures) {
    const fileName = `./GSI_GIS_NO_GEOM/ad/${pref}.json`;
    const data = await fetch(fileName);
    const json = (await data.json()) as Array<TypeJsonAdPref>;

    const len = ad.length;
    ad = ad.concat(json);
    if (json.length > 0) {
      gis_info.file_first[json[0].geometry as string] = len;
    }

    console.log("ad", fileName);
  }

  let adPref: Array<TypeJsonAdPref> = [];
  for (const pref of prefectures) {
    const fileName = `./GSI_GIS_NO_GEOM/adpref/${pref}.json`;
    const data = await fetch(fileName);
    const json = (await data.json()) as Array<TypeJsonAdPref>;

    const len = adPref.length;
    adPref = adPref.concat(json);
    if (json.length > 0) {
      gis_info.file_first[json[0].geometry as string] = len;
    }

    console.log("adPref", fileName);
  }

  let coast23pref: Array<TypeJsonCoastPref> = [];

  for (const pref of prefectures) {
    const fileName = `./GSI_GIS_NO_GEOM/coast/${pref}-23_Coast.json`;
    const data = await fetch(fileName);
    const json = (await data.json()) as Array<TypeJsonCoastPref>;
    const len = coast23pref.length;
    coast23pref = coast23pref.concat(json);
    if (json.length > 0) {
      gis_info.file_first[json[0].geometry as string] = len;
    }
    console.log("coast23pref", fileName);
  }

  const lake_05 = await fetch("./GSI_GIS_NO_GEOM/lake-05.json");
  const lake_05_json = (await lake_05.json()) as Array<TypeJsonCoastPref>;

  const N02_05_RailroadSection_json_type = N02_05_RailroadSection_json as TypeJsonGISRailroadSection;
  const N02_22_RailroadSection_json_type = N02_22_RailroadSection_json as TypeJsonGISRailroadSection;
  const N02_23_RailroadSection_json_type = N02_23_RailroadSection_json as TypeJsonGISRailroadSection;

  const N02_05_Station_json_type = N02_05_Station_json as TypeJsonGISStation;
  const N02_22_Station_json_type = N02_22_Station_json as TypeJsonGISStation;
  const N02_23_Station_json_type = N02_23_Station_json as TypeJsonGISStation;

  const lake23: TypeJsonCoast = { type: "FeatureCollection", name: "lake-05", features: lake_05_json };
  const coast23: TypeJsonCoast = { type: "FeatureCollection", name: "coast-23", features: coast23pref };
  const ad24: TypeJsonAd = { type: "FeatureCollection", name: "ad-24", features: ad };
  const adPref24: TypeJsonAd = { type: "FeatureCollection", name: "adpref-24", features: adPref };

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

  // gis_info.gis_data["2024_administrative"] = Administrative_24_json;
  // gis_info.units["2023_administrative"] = { unit_id: "2024_administrative", name: "2024年行政区域市町村データ", grouping_size: 2 };

  // gis_info.gis_data["2024_administrative_pref"] = Administrative_24_pref_json;
  // gis_info.units["2023_administrative_pref"] = { unit_id: "2024_administrative_pref", name: "2024年行政区域都道府県データ", grouping_size: 2 };

  gis_info.gis_data["2023_coast"] = coast23;
  gis_info.units["2023_coast"] = { unit_id: "2023_coast", name: "2023年海岸線データ", grouping_size: 2 };

  gis_info.gis_data["2024_ad"] = ad24;
  gis_info.units["2024_ad"] = { unit_id: "2024_ad", name: "2024年行政区域市町村データ", grouping_size: 2 };

  gis_info.gis_data["2024_adpref"] = adPref24;
  gis_info.units["2024_adpref"] = { unit_id: "2024_adpref", name: "2024年行政区域都道府県データ", grouping_size: 2 };

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

  gis_info.id_type["2024_ad"] = "Administrative";
  gis_info.id_type["2024_adpref"] = "Administrative_pref";

  console.log("gis_info_2023_rail", gis_info.gis_data["2023_rail"]);
  console.log("gis_info_2023_coast", gis_info.gis_data["2023_coast"]);

  gis_info.adlist = (await (await fetch("./merged_municipalities.json")).json()) as TypeMergedAdInfoyMap;

  gis_info_load_flag = true;
  globalStore.dispatchEvent(new Event("update")); // React に通知
  return gis_info;
};

export const getGisInfo = (): TypeGISInfo => {
  console.log("getGisInfo", gis_info_load_flag);

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
