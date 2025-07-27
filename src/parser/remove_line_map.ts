export class RemoveLineMap {
  removeLineMap: Map<string, string>;

  constructor() {
    this.removeLineMap = new Map();
  }

  pushRemoveLineMap(point_1: string, point_2: string, layer_uuid: string) {
    const key1 = point_1 + "_" + point_2;
    const key2 = point_2 + "_" + point_1;

    if (!this.removeLineMap.has(key1)) {
      this.removeLineMap.set(key1, layer_uuid);
    }
    if (!this.removeLineMap.has(key2)) {
      this.removeLineMap.set(key2, layer_uuid);
    }
  }

  hasRemoveLineMap(point_1: string, point_2: string, layer_uuid: string): boolean {
    const key1 = point_1 + "_" + point_2;
    const key2 = point_2 + "_" + point_1;

    if (key1 == key2) {
      return false; // 同じ座標は削除しない
    }

    if (this.removeLineMap.has(key1)) {
      if (this.removeLineMap.get(key1)! !== layer_uuid) {
        return true;
      }
    }
    if (this.removeLineMap.has(key2)) {
      if (this.removeLineMap.get(key2)! !== layer_uuid) {
        return true;
      }
    }
    return false;
  }
}
