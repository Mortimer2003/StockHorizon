import {BaseContext, Constructor} from "../app/BaseContext";

class SingletonContext extends BaseContext {
	public get contentName() { return "Singleton"; }
}

class SingletonUtils {

	public static context = new SingletonContext();

}

export function singleton<T>(clazz: Constructor<T>) {
	SingletonUtils.context.create(clazz, new clazz());
}

export function singletonValue<T>(clazz: Constructor<T>) {
	return (target, key) => {
		console.log("[USE] ", {clazz, target, key});
		target[key] = getSingleton(clazz);
	}
}
export function singletonGetter<T>(clazz: Constructor<T>) {
	return (target, key, desc) => {
		desc.value = (): T =>
			target[key + '_CACHE'] = target[key + '_CACHE'] || getSingleton(clazz)
	};
}

export function getSingleton<T>(clazz: Constructor<T>) {
	return SingletonUtils.context.instance(clazz);
}
