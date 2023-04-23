import {Constructor} from "../../app/BaseContext";
import {getMetaData, UnPromise} from "../../utils/TypeUtils";
import {BaseSlice, Reducer, SliceType, SliceUtils} from "./BaseSlice";
import {AsyncThunk, createAsyncThunk} from "@reduxjs/toolkit";
import {AnyAction} from "redux";
import {BaseThunkAPI} from "@reduxjs/toolkit/src/createAsyncThunk";
import {FallbackIfUnknown} from "@reduxjs/toolkit/src/tsHelpers";
import {ThunkDispatch} from "redux-thunk";
import {BaseManager} from "../../app/BaseManager";

export function asyncTask<T extends BaseAsyncTaskManager>(
	nameOrObj: string | T, key: string, desc: PropertyDescriptor
): any {
	const flag = key && desc;
	// @ts-ignore
	const name: string = flag ? key : nameOrObj;
	const process = (obj, key, desc) => {
		const type = obj.constructor as AsyncTaskManager<T>;
		const setting = AsyncTaskUtils.getSetting(type);
		setting.thunks[name] = key;
	}
	return flag ? process(nameOrObj, key, desc) : process;
}

export function pending<T extends BaseAsyncTaskManager>(reducer: Reducer<any>) {
	return registerTaskReducers("pending", reducer)
}
export function fulfilled<T extends BaseAsyncTaskManager>(reducer: Reducer<any>) {
	return registerTaskReducers("fulfilled", reducer)
}
export function rejected<T extends BaseAsyncTaskManager>(reducer: Reducer<any>) {
	return registerTaskReducers("rejected", reducer)
}
export function final<T extends BaseAsyncTaskManager>(reducer: Reducer<any>) {
	return registerTaskReducers("final", reducer)
}
export function registerTaskReducers<T extends BaseAsyncTaskManager>(
	type: "pending" | "fulfilled" | "rejected" | "final",
	reducer: Reducer<any, {p: any, res?: any, e?: any}>) {
	return (obj, key, desc) => {
		const clazz = obj.constructor as AsyncTaskManager<T>;
		const setting = AsyncTaskUtils.getSetting(clazz);
		setting[type][key] ||= [];
		setting[type][key].push(reducer);
	}
}

// export function pending<R = any, P = any, N extends string = any, S = any>(
// 	func: AsyncTaskFunc<P, R> & {thunk?: AsyncTaskThunk<R, P>}) {
// 	return registerExtraReducer<R, P, N, S>(func.thunk?.pending);
// }
// export function fulfilled<R = any, P = any, N extends string = any, S = any>(
// 	func: AsyncTaskFunc<P, R> & {thunk?: AsyncTaskThunk<R, P>}) {
// 	return registerExtraReducer<R, P, N, S>(func.thunk?.fulfilled);
// }
// export function rejected<R = any, P = any, N extends string = any, S = any>(
// 	func: AsyncTaskFunc<P, R> & {thunk?: AsyncTaskThunk<R, P>}) {
// 	return registerExtraReducer<R, P, N, S>(func.thunk?.rejected);
// }
// export function final<R = any, P = any, N extends string = any, S = any>(
// 	func: AsyncTaskFunc<P, R> & {thunk?: AsyncTaskThunk<R, P>}) {
// 	return registerExtraReducer<R, P, N, S>(
// 		[func.thunk?.fulfilled, func.thunk?.rejected]
// 	);
// }

// function registerExtraReducer<R = any, P = any, N extends string = any, S = any>(
// 	paramOrObj: any | BaseSlice<N, S>, key?: string,
// 	desc?: TypedPropertyDescriptor<(params: R) => void | S>)
// 	: (obj: BaseSlice<N, S>, key: string,
// 		 desc: TypedPropertyDescriptor<(params: R) => void | S>) => void {
//
// 	const flag = key && desc;
// 	const param = flag ? undefined : paramOrObj;
// 	const process = (obj, key, desc) => {
// 		const clazz = obj.constructor as SliceType<N, S>;
// 		const setting = SliceUtils.getSetting(clazz);
// 		setting.extraReducers ||= [];
// 		if (param instanceof Array)
// 			param.forEach(p => setting.extraReducers.push([p, key]))
// 		else
// 			setting.extraReducers.push([param, key])
// 	}
// 	// @ts-ignore
// 	return flag ? process(paramOrObj, key, desc) : process;
// }

export type Key<T> = keyof T extends string ? keyof T : "";

// type GetParams<T extends BaseAsyncTask> =
// 	Parameters<T["process"]>[0]
// type GetReturns<T extends BaseAsyncTask> =
// 	UnPromise<ReturnType<T["process"]>>
type AsyncTaskFunc<P = any, R = any> = (args: P) => Promise<R>;
type AsyncThunkConfig = {
	state: State
	dispatch: AppDispatch
}
type AsyncTaskThunk<R = any, P = any> = AsyncThunk<R, P, AsyncThunkConfig>
export type AsyncReturn<T extends AsyncTaskFunc> = UnPromise<ReturnType<T>>;

// region 内部声明

type GetState<ThunkApiConfig> = ThunkApiConfig extends {
		state: infer State
	}
	? State
	: unknown
type GetExtra<ThunkApiConfig> = ThunkApiConfig extends { extra: infer Extra }
	? Extra
	: unknown
type GetDispatch<ThunkApiConfig> = ThunkApiConfig extends {
		dispatch: infer Dispatch
	}
	? FallbackIfUnknown<
		Dispatch,
		ThunkDispatch<
			GetState<ThunkApiConfig>,
			GetExtra<ThunkApiConfig>,
			AnyAction
			>
		>
	: ThunkDispatch<GetState<ThunkApiConfig>, GetExtra<ThunkApiConfig>, AnyAction>
type GetRejectValue<ThunkApiConfig> = ThunkApiConfig extends {
		rejectValue: infer RejectValue
	}
	? RejectValue
	: unknown
type GetFulfilledMeta<ThunkApiConfig> = ThunkApiConfig extends {
		fulfilledMeta: infer FulfilledMeta
	}
	? FulfilledMeta
	: unknown
type GetRejectedMeta<ThunkApiConfig> = ThunkApiConfig extends {
		rejectedMeta: infer RejectedMeta
	}
	? RejectedMeta
	: unknown

// endregion

export type ThunkAPI =
	BaseThunkAPI<
		GetState<AsyncThunkConfig>,
		GetExtra<AsyncThunkConfig>,
		GetDispatch<AsyncThunkConfig>,
		GetRejectValue<AsyncThunkConfig>,
		GetRejectedMeta<AsyncThunkConfig>,
		GetFulfilledMeta<AsyncThunkConfig>
		>

export type AsyncTaskSetting = {
	thunks: {[K: string]: string}
	pending: {[K: string]: Reducer<any>[]}
	fulfilled: {[K: string]: Reducer<any>[]}
	rejected: {[K: string]: Reducer<any>[]}
	final: {[K: string]: Reducer<any>[]}
}

const AsyncTaskSettingKey = "asyncTask"
export type AsyncTaskManager<T extends BaseAsyncTaskManager> =
	Constructor<T> & {
		[K in typeof AsyncTaskSettingKey]?: AsyncTaskSetting
	} // & {[K in Capitalize<Key<T>>]?: AsyncThunk<any, any, any>}

export class AsyncTaskUtils {

	public static getSetting<T extends BaseAsyncTaskManager>(type: AsyncTaskManager<T>) {
		return getMetaData<AsyncTaskSetting>(
			type, AsyncTaskSettingKey, {
				thunks: {}, pending: {}, fulfilled: {}, rejected: {}, final: {}
			});
	}

	public static getThunks<T extends BaseAsyncTaskManager>(type: AsyncTaskManager<T>) {
		return this.getSetting(type).thunks;
	}
	public static getPending<T extends BaseAsyncTaskManager>(type: AsyncTaskManager<T>, name: string) {
		return this.getSetting(type).pending;
	}
	public static getFulfilled<T extends BaseAsyncTaskManager>(type: AsyncTaskManager<T>, name: string) {
		return this.getSetting(type).fulfilled;
	}
	public static getRejected<T extends BaseAsyncTaskManager>(type: AsyncTaskManager<T>, name: string) {
		return this.getSetting(type).rejected;
	}
	public static getFinal<T extends BaseAsyncTaskManager>(type: AsyncTaskManager<T>, name: string) {
		return this.getSetting(type).final;
	}
}

export abstract class BaseAsyncTaskManager extends BaseManager {

	public store;
	// protected thunkAPI: ThunkAPI

	protected get state(): State {
		return this.store?.getState();
	}

	constructor() {
		super();
		this.createAsyncThunks();
	}

	private createAsyncThunks() {
		// @ts-ignore
		const setting = AsyncTaskUtils.getSetting(this.constructor);
		const {thunks, pending, fulfilled, rejected, final} = setting;
		// const thunks = AsyncTaskUtils.getThunks(this.constructor);
		// const pending = AsyncTaskUtils.getPending(this.constructor)
		for (const name in thunks) {
			const key = thunks[name], func = this[key];
			const thunk = this.createThunk(name, func,
				pending[key], fulfilled[key], rejected[key], final[key]);
			this.createAsyncTask(key, name, thunk);
		}
	}
	private createThunk<P, R>(
		name: string, func: AsyncTaskFunc<P, R>,
		pending: Reducer<any, {p: P}>[],
		fulfilled: Reducer<any, {p: P, res: R}>[],
		rejected: Reducer<any, {p: P, e: any}>[],
		final: Reducer<any, {p: P}>[]) {
		return async p => {
			try {
				// @ts-ignore
				// this.thunkAPI = thunkAPI;
				// this.state = window["Store"].getState();
				// AsyncTaskUtils.addCall(this);
				console.log("AsyncThunk Start", name, p, this.state);
				// @ts-ignore
				pending?.forEach(f => f({p}));
				const res = await func.call(this, p);
				console.log("AsyncThunk Finish", name, res);
				fulfilled?.forEach(f => f({p, res}));
				return res
			} catch (e) {
				// res = thunkAPI.rejectWithValue(e);
				rejected?.forEach(f => f({p, e}));
				console.error("AsyncThunk Error", name, e);
				throw e; // TODO: 可配置
			} finally {
				final?.forEach(f => f({p}));
			}
		}
		// return createAsyncThunk<R, P, AsyncThunkConfig>(
		// 	name, async (p, thunkAPI) => {
		// 		let res;
		// 		try {
		// 			// @ts-ignore
		// 			this.thunkAPI = thunkAPI;
		// 			this.state = thunkAPI.getState();
		// 			// AsyncTaskUtils.addCall(this);
		// 			console.log("AsyncThunk Start", name, p, this.state, thunkAPI);
		// 			// @ts-ignore
		// 			pending?.forEach(f => f({p}));
		// 			res = await func.call(this, p);
		// 			fulfilled?.forEach(f => f({p, res}));
		// 			console.log("AsyncThunk Finish", name, res);
		// 			return res
		// 		} catch (e) {
		// 			res = thunkAPI.rejectWithValue(e);
		// 			rejected?.forEach(f => f({p, e: res.payload}));
		// 			console.error("AsyncThunk Error", name, res);
		// 			throw e; // TODO: 可配置
		// 		} finally {
		// 			final?.forEach(f => f({p}));
		// 		}
		// 	})
	}
	private createAsyncTask(key, name, thunk) {
		this[key] = async (params) => {
			const res = await thunk(params);
			console.log("AsyncTask Return", name, res);
			return res;
			// const dispatch = this.store?.dispatch; // TODO: 可以封装
			// const res = await dispatch(thunk(params))
			// console.log("AsyncTask Return", name, res);
			// return res.payload;
		};
		this[key]["thunk"] = thunk;
	}
}

// region 测试

// export function testMgr() {
// 	return getManager(TestManager);
// }
//
// @manager
// class TestManager extends BaseAsyncTaskManager {
//
// 	@asyncTask
// 	public async test({aa}: {aa: number}) {
// 		return aa * 2;
// 	}
// }
//
// testMgr().test({aa: 22}).then(console.log);

// endregion

import {AppDispatch, State, Store} from "./StoreConfig";
