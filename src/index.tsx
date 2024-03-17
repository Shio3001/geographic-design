import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";

type TypeGISRailroadSection = {
  type: string;
  properties: { N02_001: number; N02_002: number; N02_003: string; N02_004: string };
  geometry: { type: string; coordinates: Array<Array<number>> };
};
type TypeGISStation = {
  type: string;
  properties: { N02_001: string; N02_002: string; N02_003: string; N02_004: string; N02_005: string; N02_005c: string; N02_005g: string };
  geometry: { type: string; coordinates: Array<Array<number>> };
};

const N02_22_RailroadSection: TypeGISRailroadSection = require("./GSI_GIS/N02-22_RailroadSection.json");
const N02_22_Station: TypeGISStation = require("./GSI_GIS//N02-22_Station.json");

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

const App = () => {
  const [update, setUpdata] = useState<boolean>(false);

  const updateDOM = () => {
    //強制再レンダリング関数
    setUpdata(update ? false : true);
  };

  useEffect(() => {
    console.log("update 再レンダリング");
  }, [update]);
};
