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

export type TypeJsonGISRailroadSection = {
  type: string;
  name: string;

  features: Array<{
    type: string;
    properties: { N02_001: number; N02_002: number; N02_003: string; N02_004: string };
    geometry: { type: string; coordinates: TypeJsonCoordinates };
  }>;
};
export type TypeJsonGISStation = {
  type: string;
  name: string;
  features: Array<{
    type: string;
    properties: { N02_001: string; N02_002: string; N02_003: string; N02_004: string; N02_005: string; N02_005c: string; N02_005g: string };
    geometry: { type: string; coordinates: TypeJsonCoordinates };
  }>;
};

export type TypeGisUnit = { unit_id: string; name: string; grouping_size: number };
export type TypeGisUnits = { [key: string]: TypeGisUnit };
export type TypeGisData = { [key: string]: TypeJsonGISRailroadSection | TypeJsonGISStation };
export type TypeGISInfo = { units: TypeGisUnits; gis_data: TypeGisData; id_type: { [key: string]: string } };
