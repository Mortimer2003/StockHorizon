import {DataWithPayload, Payload} from "./BaseRegister";

export function getItem<
  V extends DataWithPayload<T, Payloads>,
  T extends number | string,
  Payloads extends Record<string | number, any>
>(group: DataWithPayload<any, Payloads>[], type: T, index = 0): V {
  if (!group) return null;
  if (index >= 0)
    // 正循环
    for (const val of group) {
      if (val.type != type) continue;
      if (index-- <= 0) return val as V;
    }
  else if (index < 0)
    // reverse再循环
    return getItem(group.slice(0).reverse(), type, -index - 1);
}

export function getIndex<
  V extends DataWithPayload<T, Payloads>,
  T extends number | string,
  Payloads extends Record<string | number, any>
>(group: DataWithPayload<any, Payloads>[], type: T, index = 0): number {
  if (!group) return -1;
  if (index >= 0)
    // 正循环
    for (let i = 0; i < group.length; i++) {
      if (group[i].type != type) continue;
      if (index-- <= 0) return i;
    }
  else if (index < 0)
    // reverse再循环
    for (let i = group.length - 1; i >= 0; i--) {
      if (group[i].type != type) continue;
      if (index-- <= 0) return i;
    }
  return -1;
}

export function getItems<
  V extends DataWithPayload<T, Payloads>,
  T extends number | string,
  Payloads extends Record<string | number, any>
>(group: DataWithPayload<any, Payloads>[], type: T): V[] {
  return (group?.filter((r) => r.type == type) as V[]) || [];
}

export function changeItem<
  V extends DataWithPayload<T, Payloads>,
  T extends number | string,
  Payloads extends Record<string | number, any>
>(
  group: DataWithPayload<any, Payloads>[],
  type: T,
  payload: Payload<T, Payloads>
): V {
  const res = group?.find((r) => r.type == type) as V;
  if (!res) return addItem(group, type, payload);
  res.payload = payload;
  return res;
}

export function addItem<
  V extends DataWithPayload<T, Payloads>,
  T extends number | string,
  Payloads extends Record<string | number, any>
>(
  group: DataWithPayload<any, Payloads>[],
  type: T,
  payload: Payload<T, Payloads>
): V {
  const res: V = { type, payload } as V;
  group.push(res);
  return res;
}
