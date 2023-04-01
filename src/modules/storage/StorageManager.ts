import {BaseManager, getManager, manager} from "../../app/BaseManager";

export function storageMgr() : StorageManager {
	return getManager(StorageManager);
}

@manager
class StorageManager extends BaseManager {

	public setData<T>(key: string, data: T) {
		let strData;
		switch (typeof data) {
			case "object": strData = JSON.stringify(data); break;
			case "boolean": strData = data ? "true" : "false"; break;
			default: strData = data.toString(); break;
		}
		localStorage.setItem(key, strData);
	}
	public getData<T = string>(key, type?: any) {
		const data = localStorage.getItem(key);
		if (data === null) return null;
		switch (type) {
			case Object: return JSON.parse(data);
			case Number: return Number(data);
			case Boolean: return data && data != "false";
			default: return data;
		}
	}

	public removeData(key) {
		localStorage.removeItem(key);
	}
}
