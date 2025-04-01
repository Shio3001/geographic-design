export class RemoveLineMap {
  removeLineMap: Map<string, number>;

  constructor() {
    this.removeLineMap = new Map();
  }

  pushRemoveLineMap(point_1: string, point_2: string) {
    const key1 = point_1 + "_" + point_2;
    const key2 = point_2 + "_" + point_1;

    if (this.removeLineMap.has(key1)) {
      this.removeLineMap.set(key1, this.removeLineMap.get(key1)! + 1);
    } else {
      this.removeLineMap.set(key1, 1);
    }
    if (this.removeLineMap.has(key2)) {
      this.removeLineMap.set(key2, this.removeLineMap.get(key2)! + 1);
    } else {
      this.removeLineMap.set(key2, 1);
    }
  }

  hasRemoveLineMap(point_1: string, point_2: string) {
    const key1 = point_1 + "_" + point_2;
    const key2 = point_2 + "_" + point_1;
    if (this.removeLineMap.has(key1)) {
      if (this.removeLineMap.get(key1)! > 0) {
        this.removeLineMap.set(key1, this.removeLineMap.get(key1)! - 1);
        return true;
      }
    }
    if (this.removeLineMap.has(key2)) {
      if (this.removeLineMap.get(key2)! > 0) {
        this.removeLineMap.set(key2, this.removeLineMap.get(key2)! - 1);
        return true;
      }
    }
    return false;
  }
}
