export const copyObject = (john: any) => {
  return Object.assign(Object.create(Object.getPrototypeOf(john)), john);
};
