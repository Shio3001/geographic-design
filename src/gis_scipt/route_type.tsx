export type TypeJsonCoordinate = Array<string>; //数値誤差を防ぐため文字列型
export type TypeJsonCoordinates = Array<TypeJsonCoordinate>;

export type TypePosition = {
  x: number;
  y: number;
};

export type TypeSVGCommand = {
  command: string;
  x: string;
  y: string;
};

export type TypeGeometry = {
  type: string;
  coordinates: TypeJsonCoordinates;
};

export type TypeJsonCoastPref = {
  type: string;
  properties: { pref: string };
  geometry: TypeGeometry | string;
};

export type TypeJsonCoast = {
  type: string;
  name: string;

  features: Array<TypeJsonCoastPref>;
};

export type TypeJsonAdPref = {
  type: string;
  properties: { N03_001: string; N03_002: string; N03_003: string; N03_004: string; N03_005: string; N03_007: number };
  geometry: TypeGeometry | string;
};

export type TypeJsonAd = {
  type: string;
  name: string;
  features: Array<TypeJsonAdPref>;
};

//  "properties": { "N03_001": "北海道", "N03_002": null, "N03_003": null, "N03_004": null, "N03_005": null, "N03_007": "01000" } },

// export type TypeJsonGISAdministrative = {
//   type: string;
//   name: string;
//   features: Array<{
//     type: string;
//     properties: { N03_001: string; N03_002: string; N03_003: string; N03_004: string; N03_005: string; N03_007: number };
//     // properties: { N03_001: "北海道"; N03_002: "石狩振興局"; N03_003: null; N03_004: "札幌市"; N03_005: "北区"; N03_007: "01102" };

//     geometry: { type: string; coordinates: TypeJsonCoordinates };
//   }>;
// };

export type TypeJsonGISRailroadSection = {
  type: string;
  name: string;

  features: Array<{
    type: string;
    properties: { N02_001: number; N02_002: number; N02_003: string; N02_004: string };
    geometry: TypeGeometry | string;
  }>;
};
export type TypeJsonGISStation = {
  type: string;
  name: string;

  features: Array<{
    type: string;
    properties: { N02_001: string; N02_002: string; N02_003: string; N02_004: string; N02_005: string; N02_005c: string; N02_005g: string };
    geometry: TypeGeometry | string;
  }>;
};

export type TypeGisUnit = { unit_id: string; name: string; grouping_size: number };
export type TypeGisUnits = { [key: string]: TypeGisUnit };
export type TypeGisData = { [key: string]: TypeJsonGISRailroadSection | TypeJsonGISStation | TypeJsonCoast | TypeJsonAd };
export type TypeGISInfo = { units: TypeGisUnits; gis_data: TypeGisData; id_type: { [key: string]: string }; file_first: { [key: string]: number } };
