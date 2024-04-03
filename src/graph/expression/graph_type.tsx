import PathContact from "./path_contact";

export type TypeGraphRouteNode = Map<string, Array<PathContact>>;
export type TypeGraphRoute = Map<string, TypeGraphRouteNode>;

export type TypePathIndex = {
  path: PathContact;
  index: number;
};
