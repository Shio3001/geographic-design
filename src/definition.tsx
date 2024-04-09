export const copyObject = (john: any) => {
  return Object.assign(Object.create(Object.getPrototypeOf(john)), john);
};
export const deepCopyObject = <T,>(root: T) => {
  const search = (obj: unknown): unknown => {
    if (obj === null) {
      return null;
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => search(item));
    }
    if (typeof obj === "object") {
      return Object.assign(
        Object.create(Object.getPrototypeOf(obj)),
        Object.entries(obj).reduce((previous, [key, value]) => ({ ...previous, [key]: search(value) }), {})
      );
    }
    return obj;
  };
  return search(root) as T;
};
