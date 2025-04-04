import { TypeJsonGISRailroadSection, TypeJsonGISStation, TypeGisUnit, TypeGisUnits, TypeGISInfo, TypeGeometry, TypeGeometry3D } from "./route_type";

import { setupGisInfo, getGisInfo } from "./route_setup";

export class CashGeometry {
  cash: Map<string, any>;
  constructor() {
    this.cash = new Map();
  }

  get(path: string): any | undefined {
    return this.cash.get(path);
  }

  set(path: string, geometry: any): void {
    this.cash.set(path, geometry);
  }

  has(path: string): boolean {
    return this.cash.has(path);
  }
}

export const getProperties = (gis_info: TypeGISInfo, unit_id: string, features_index: number): { [key: string]: string } => {
  const gis_unit = gis_info.gis_data[unit_id];
  return gis_unit.features[features_index].properties as { [key: string]: string };
};

export const getGeometry = async (cg: CashGeometry, gis_info: TypeGISInfo, unit_id: string, features_index: number) => {
  const gis_unit = gis_info.gis_data[unit_id];
  const path = gis_unit.features[features_index].geometry as string;
  const features_region_index = features_index - (gis_info.file_first[path] ?? 0);

  const resolve = (js_data: any) => {
    const resolvetg = Array.isArray(js_data)
      ? (js_data[features_region_index].geometry as TypeGeometry | TypeGeometry3D)
      : (js_data.features[features_region_index].geometry as TypeGeometry | TypeGeometry3D);
    return resolvetg;
  };

  if (cg.has(path)) {
    return resolve(cg.get(path));
  }

  const response = await fetch(path);
  const data = await response.json();
  cg.set(path, data);
  return resolve(data);
};

export const searchGisConditional = (gis_info: TypeGISInfo, unit_id: string, conditional: { [key: string]: string }): Array<number> => {
  const gis_unit = gis_info.gis_data[unit_id];

  const search_list: Array<number> = [];

  for (let i = 0; i < gis_unit.features.length; i++) {
    const properties = gis_unit.features[i].properties as { [key: string]: string };

    const conditional_keys = Object.keys(conditional);

    let search_conditional_flag = true;

    for (let k = 0; k < conditional_keys.length; k++) {
      const conditional_key = conditional_keys[k];
      const conditional_value = conditional[conditional_key];

      const propertie_value = properties[conditional_key];

      if (propertie_value != conditional_value) {
        search_conditional_flag = false;
        break;
      }
    }

    if (search_conditional_flag) {
      search_list.push(i);
    }
  }

  return search_list;
};

export const getArrayIndexNum = (array: Array<number>, target: number): number => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] == target) {
      return i;
    }
  }
  return -1;
};
export const getArrayIndexStr = (array: Array<string>, target: string): number => {
  console.log("getArrayIndexStr", array, target);

  if (!target) {
    console.log("getArrayIndexStr-under", target);
    return 0;
  }

  for (let i = 0; i < array.length; i++) {
    if (array[i] == target) {
      console.log("getArrayIndexStr-get", i);
      return i;
    }
  }
  return 0;
};

export const getFeatures = (gis_info: TypeGISInfo, current_unit: string, features_index: number) => {
  const unit_id = gis_info.units[current_unit].unit_id;
  const current_gis = gis_info.gis_data[unit_id];
  const current_features = current_gis.features[features_index];
  return current_features;
};

export const getPropertie = (gis_info: TypeGISInfo, current_unit: string, features_index: number, search_properties_key: string): string => {
  const current_features = getFeatures(gis_info, current_unit, features_index);
  const properties = current_features.properties as { [key: string]: string };
  const propertie = properties[search_properties_key];
  return propertie;
};

export const logicalAndStr = (array1: Array<string>, array2: Array<string>): Array<string> => {
  const ans_array: Array<string> = [];

  for (let i = 0; i < array1.length; i++) {
    for (let j = 0; j < array2.length; j++) {
      if (array1[i] == array2[i]) {
        ans_array.push(array1[i]);
        break;
      }
    }
  }

  return ans_array;
};
export const logicalAnd = (array1: Array<number>, array2: Array<number>): Array<number> => {
  const ans_array: Array<number> = [];

  for (let i = 0; i < array1.length; i++) {
    for (let j = 0; j < array2.length; j++) {
      if (array1[i] == array2[i]) {
        ans_array.push(array1[i]);
        break;
      }
    }
  }

  return ans_array;
};

// 探索関数
// たとえば getGisInfo(), unit_id, "N03_001", pref, "N03_003" とすると、N03_001がprefで指定される値のN03_003の値を取得する
export const searchUniqueKeyBySearchKey = (
  gis_info: TypeGISInfo,
  unit_id: string,
  search_properties_key: string,
  search_propertie_valuie: string,
  request_properties_key: string
): Array<string> => {
  const current_gis = gis_info.gis_data[unit_id];

  const propertie_map = new Map();
  const propertie_list: Array<string> = [];

  const pushPropertie = (propertie_value: string) => {
    if (propertie_map.has(propertie_value)) {
      return;
    }

    propertie_map.set(propertie_value, true);
    propertie_list.push(propertie_value);
  };

  for (let i = 0; i < current_gis.features.length; i++) {
    const properties = current_gis.features[i].properties as { [key: string]: string };
    const search_propertie_value = properties[search_properties_key];

    if (search_propertie_value != search_propertie_valuie) {
      continue;
    }

    const request_propertie_value = properties[request_properties_key];
    pushPropertie(request_propertie_value);
  }

  console.log(propertie_list);

  return propertie_list;
};

// 探索関数 政令指定都市などの検索
// たとえば getGisInfo(), unit_id, "N03_001", pref, "N03_004" ,"N03_003" とすると、
// N03_001がprefで指定される値のうち、N03_004が存在するN03_003の値を取得する
// 存在しないものはnullが代入されているか、そもそも要素として存在しない
export const hasUniqueKeyBySearchKey = (
  gis_info: TypeGISInfo,
  unit_id: string,
  search_properties_key: string,
  search_propertie_valuie: string,
  check_properties_key: string,
  request_properties_key: string
): Array<string> => {
  const current_gis = gis_info.gis_data[unit_id];

  const propertie_map = new Map();
  const propertie_list: Array<string> = [];

  const pushPropertie = (propertie_value: string) => {
    if (propertie_map.has(propertie_value)) {
      return;
    }

    propertie_map.set(propertie_value, true);
    propertie_list.push(propertie_value);
  };

  for (let i = 0; i < current_gis.features.length; i++) {
    const properties = current_gis.features[i].properties as { [key: string]: string };
    const search_propertie_value = properties[search_properties_key];

    if (search_propertie_value != search_propertie_valuie) {
      continue;
    }

    const check_propertie_value = properties[check_properties_key];
    if (check_propertie_value == null || check_propertie_value == "") {
      continue;
    }

    const request_propertie_value = properties[request_properties_key];
    pushPropertie(request_propertie_value);
  }

  console.log(propertie_list);

  return propertie_list;
};

export const searchUniqueKeyBySearchKeyArray = (
  gis_info: TypeGISInfo,
  unit_id: string,
  search_properties: Array<Array<string>>, // [["N03_001", "pref"], ["N03_003", "city"]] のand検索 この場合、"N03_001"がprefで指定されるかつ、"M03_003"がcityで指定される値を取得する
  request_properties_key: string
): Array<string> => {
  const current_gis = gis_info.gis_data[unit_id];

  const propertie_map = new Map();
  const propertie_list: Array<string> = [];

  const pushPropertie = (propertie_value: string) => {
    if (propertie_map.has(propertie_value)) {
      return;
    }

    propertie_map.set(propertie_value, true);
    propertie_list.push(propertie_value);
  };

  for (let i = 0; i < current_gis.features.length; i++) {
    const properties = current_gis.features[i].properties as { [key: string]: string };

    let search_conditional_flag = true;

    for (let j = 0; j < search_properties.length; j++) {
      const search_propertie_key = search_properties[j][0];
      const search_propertie_value = search_properties[j][1];

      if (properties[search_propertie_key] != search_propertie_value) {
        search_conditional_flag = false;
        break;
      }
    }

    if (!search_conditional_flag) {
      continue;
    }

    const request_propertie_value = properties[request_properties_key];
    pushPropertie(request_propertie_value);
  }

  console.log(propertie_list);

  return propertie_list;
};

export const searchUniquePropertie = (gis_info: TypeGISInfo, unit_id: string, search_properties_key: string, propertie_value: string): Array<number> => {
  // const unit_id = gis_info.units[current_unit].unit_id;
  const current_gis = gis_info.gis_data[unit_id];

  const features_index_list: Array<number> = [];
  for (let i = 0; i < current_gis.features.length; i++) {
    const properties = current_gis.features[i].properties as { [key: string]: string };
    const current_propertie_value = properties[search_properties_key];
    if (current_propertie_value == propertie_value) {
      features_index_list.push(i);
    }
  }
  return features_index_list;
};

export const searchUniqueIndex = (gis_info: TypeGISInfo, unit_id: string, search_properties_key: string): Array<number> => {
  // const unit_id = gis_info.units[current_unit].unit_id;
  const current_gis = gis_info.gis_data[unit_id];

  const propertie_map = new Map();
  const propertie_list: Array<string> = [];
  const propertie_index_list: Array<number> = [];
  const pushPropertie = (propertie_value: string, index: number) => {
    if (propertie_map.has(propertie_value)) {
      return;
    }

    propertie_map.set(propertie_value, true);
    propertie_list.push(propertie_value);
    propertie_index_list.push(index);
  };

  for (let i = 0; i < current_gis.features.length; i++) {
    const properties = current_gis.features[i].properties as { [key: string]: string };
    const propertie_value = properties[search_properties_key];
    pushPropertie(propertie_value, i);
  }

  console.log(propertie_list);

  return propertie_index_list;
};

export const searchUniqueKey = (gis_info: TypeGISInfo, unit_id: string, search_properties_key: string): Array<string> => {
  // const unit_id = gis_info.units[current_unit].unit_id;
  const current_gis = gis_info.gis_data[unit_id];

  const propertie_map = new Map();
  const propertie_list: Array<string> = [];

  const pushPropertie = (propertie_value: string) => {
    if (propertie_map.has(propertie_value)) {
      return;
    }

    propertie_map.set(propertie_value, true);
    propertie_list.push(propertie_value);
  };

  for (let i = 0; i < current_gis.features.length; i++) {
    const properties = current_gis.features[i].properties as { [key: string]: string };
    const propertie_value = properties[search_properties_key];
    pushPropertie(propertie_value);
  }

  console.log("propertie_list", propertie_list);

  return propertie_list;
};
