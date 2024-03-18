import { TypeJsonGISRailroadSection, TypeJsonGISStation, TypeGisUnit, TypeGisUnits, TypeGISInfo } from "./route_type";

import { setupGisInfo, getGisInfo } from "./route_setup";

export const getArrayIndexNum = (array: Array<number>, target: number): number => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] == target) {
      return i;
    }
  }
  return -1;
};
export const getArrayIndexStr = (array: Array<string>, target: string): number => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] == target) {
      return i;
    }
  }
  return -1;
};

export const getFeatures = (current_unit: string, features_index: number) => {
  const gis_info = getGisInfo();
  const unit_id = gis_info.units[current_unit].unit_id;
  const current_gis = gis_info.gis_data[unit_id];
  const current_features = current_gis.features[features_index];
  return current_features;
};

export const getPropertie = (current_unit: string, features_index: number, search_properties_key: string): string => {
  const current_features = getFeatures(current_unit, features_index);
  const properties = current_features.properties as { [key: string]: string };
  const propertie = properties[search_properties_key];
  return propertie;
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

export const searchUniqueIndex = (unit_id: string, search_properties_key: string, propertie_value: string): Array<number> => {
  const gis_info = getGisInfo();
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

export const searchUniqueKey = (unit_id: string, search_properties_key: string): Array<string> => {
  const gis_info = getGisInfo();
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

  console.log(propertie_list);

  return propertie_list;
};
