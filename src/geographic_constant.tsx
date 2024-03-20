import BigNumber from "bignumber.js";

//1kmあたりの経度
export const LONGITUDE_KM1 = 0.010966404715491394;
export const LONGITUDE_KM1_EXP = 1096.6404715491394;

//1mあたりの経度
export const LONGITUDE_M1 = 0.000010966404715491394;
export const LONGITUDE_M1_EXP = 1.0966404715491394;

//1kmあたりの緯度
export const LATITUDE_KM1 = 0.0090133729745762;
export const LATITUDE_KM1_EXP = 901.337297458;
export const LATITUDE_KM1_BIGNUMBER = new BigNumber(901.337297458);

//1mあたりの緯度
export const LATITUDE_M1 = 0.0000090133729745762;
export const LATITUDE_M1_EXP = 0.901337297458;
export const LATITUDE_M1_EXP_BIGNUMBER = new BigNumber(0.901337297458);

//少数は誤差があり扱いづらいので、緯度経度は100000倍して取り扱う。それ以下は四捨五入しても構わない
export const EXPANSION_CONSTANT = 100000;
export const EXPANSION_CONSTANT_BIGNUMBER = new BigNumber(EXPANSION_CONSTANT);
