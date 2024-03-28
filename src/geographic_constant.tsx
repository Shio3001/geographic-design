import BigNumber from "bignumber.js";

//少数は誤差があり扱いづらいので、緯度経度は100000倍して取り扱う。それ以下は四捨五入しても構わない
export const EXPANSION_CONSTANT = 100000;
export const EXPANSION_CONSTANT_BIGNUMBER = new BigNumber(EXPANSION_CONSTANT);

//1kmあたりの経度
export const LONGITUDE_KM1 = 0.010966404715491394;
export const LONGITUDE_KM1_BIGNUMBER = new BigNumber(LONGITUDE_KM1);
export const LONGITUDE_KM1_EXP_BIGNUMBER = new BigNumber(LONGITUDE_KM1_BIGNUMBER).times(EXPANSION_CONSTANT_BIGNUMBER);

//1kmあたりの緯度
export const LATITUDE_KM1 = 0.0090133729745762;
export const LATITUDE_KM1_BIGNUMBER = new BigNumber(LATITUDE_KM1);
export const LATITUDE_KM1_EXP_BIGNUMBER = LATITUDE_KM1_BIGNUMBER.times(EXPANSION_CONSTANT_BIGNUMBER);

export const GEO_LATE = LATITUDE_KM1_EXP_BIGNUMBER.div(LONGITUDE_KM1_EXP_BIGNUMBER);
