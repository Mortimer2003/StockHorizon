import {createSlice, Draft, EnhancedStore, Slice} from "@reduxjs/toolkit";
import {SliceCaseReducers, ValidateSliceCaseReducers} from "@reduxjs/toolkit/src/createSlice";
import {Constructor} from "../../app/BaseContext";
import {getMetaData} from "../../utils/TypeUtils";
import {useSelector} from "react-redux";
import {State} from "./StoreConfig";
import {storageMgr} from "../storage/StorageManager";

export type Selector<S, P = any, R = any> = (params?: P) => R;
export type Reducer<S, P = any> = (params?: P) => void | S;

export function selector<N extends string, S>(
	nameOrObj: string | BaseSlice<N, S>,
	key?: string, desc?: PropertyDescriptor) {
	return registerFunc("selectors", nameOrObj, key, desc);
}
export function reducer<N extends string, S>(
	nameOrObj: string | BaseSlice<N, S>,
	key?: string, desc?: PropertyDescriptor) {
	return registerFunc("reducers", nameOrObj, key, desc);
}
function registerFunc<N extends string, S>(
	type: "selectors" | "reducers",
	paramOrObj: any | BaseSlice<N, S>,
	key?: string, desc?: PropertyDescriptor): any {

	const flag = key && desc;
	const param = flag ? undefined : paramOrObj;
	const process = (obj: BaseSlice<N, S>, key: string,
									 desc: PropertyDescriptor) => {
		const clazz = obj.constructor as SliceType<N, S>;
		const setting = SliceUtils.getSetting(clazz);
		setting[type] ||= {};
		setting[type][param || key] = key;
	}

	return flag ? process(paramOrObj, key, desc) : process;
}

// type FullKey<T extends Record<string, any>,
// 	P extends string = ""> = // T[keyof T]
// 	T extends (number | string | boolean | symbol) ? never :
// 		((P extends "" ? Key<T> : `${P}.${Key<T>}`) |
// 			FullKey<T[Key<T>], Key<T>>);
//
// type Key<T> = keyof T extends string ? keyof T : "";
// type StateSetter<S extends Record<string, any>> =
// 	{[K in FullKey<S>]?: any} & Partial<S> & Record<string, any>;
//
// type US = FullKey<UserState>;
// const a: US = {}

type StateSetter<S extends Record<string, any>> =
	Partial<S> & Record<string, any>;

export type SliceSetting<N extends string, S> = {
	selectors: {[K: string]: string}
	reducers: {[K: string]: string}
	extraReducers: [any, string][]
}
const SliceSettingKey = "slice"
export type SliceType<N extends string, S> =
	Constructor<BaseSlice<N, S>> & {
		[K in typeof SliceSettingKey]: SliceSetting<N, S>
	}

export class SliceUtils {

	public static getSetting<N extends string, S>(type: Constructor<BaseSlice<N, S>>) {
		return getMetaData<SliceSetting<N, S>>(
			type, SliceSettingKey, {
				reducers: {}, selectors: {},
				extraReducers: []
			});
	}

	public static getReducers<N extends string, S>(type: Constructor<BaseSlice<N, S>>) {
		return this.getSetting(type).reducers;
	}
	public static getSelectors<N extends string, S>(type: Constructor<BaseSlice<N, S>>) {
		return this.getSetting(type).selectors;
	}
	public static getExtraReducers<N extends string, S>(type: Constructor<BaseSlice<N, S>>) {
		return this.getSetting(type).extraReducers;
	}
}

export abstract class BaseSlice<N extends string = any, S = any> {

	public abstract get name(): N;
	public abstract get initialState(): S;

	public slice: Slice<S, SliceCaseReducers<S>, N>

	// public get name() { return this.slice.name }
	public get reducer() { return this.slice.reducer }

	public reducers() { // @ts-ignore
		return SliceUtils.getReducers(this.constructor);
	}
	public selectors() { // @ts-ignore
		return SliceUtils.getSelectors(this.constructor);
	}
	public extraReducers() { // @ts-ignore
		return SliceUtils.getExtraReducers(this.constructor);
	}

	protected state: Draft<S> | S;
	protected allState: Draft<State> | State;

	protected inSelector = false;
	protected inReducer = false;

	public store: EnhancedStore<State, any, any>;

	public constructor() {
		// setTimeout(() => {
		// 	this.store = require("../slices/StoreConfig").Store;
		// }, 50);
		this.create();
		this.makeSelectors();
		this.makeActions();
	}

	// region 构建Slice

	private create() {
		this.slice = createSlice({
			name: this.name,
			initialState: this.initialState,
			reducers: this.getReducers(),
			extraReducers: this.getExtraReducers()
		})
	}
	private getReducers() {
		const res: ValidateSliceCaseReducers<S, SliceCaseReducers<S>> = {};
		const rs = this.reducers();
		for (const key in rs) {
			const func: Reducer<S> = this[rs[key]];
			res[key] = (state, action) => {
				this.state = state;
				const res = func.call(this, action.payload);
				console.log("Reduce", key, action.payload, state, "->", res);
				return res;
			}
		}
		return res;
	}
	private getExtraReducers() {
		return builder => {
			this.extraReducers().map(er => {
				const [type, key] = er;
				const func: Function = this[key];
				return [type, (state, action) => {
					this.state = state;
					this.allState = this.store?.getState();
					let params = action.error || action.payload;
					return func.call(this, params, action);
				}]
			}).forEach(er => {
				console.log("builder.addCase", er)
				builder.addCase(...er)
			})
		};
	}

	// endregion

	// region 更改函数

	private makeSelectors() {
		console.log("makeSelectors");
		this.makeRegisteredSelectors();
		this.makeAutoSelectors();
	}
	private makeRegisteredSelectors() {
		const ss = this.selectors();
		for (const key in ss) {
			const func: Selector<S> = this[ss[key]];
			this[key] = (params) => {
				// console.log("Selector", key, this.inSelector)
				if (this.inSelector || this.inReducer)
					return func.call(this, params);

				return useSelector<any>((state) => {
					this.allState = state;
					this.state = state[this.name];
					this.inSelector = true;
					const res = func.call(this, params);
					this.inSelector = false;
					return res;
				});
			}
		}
	}
	private makeAutoSelectors() {
		const initState: Record<string, any> = this.initialState;
		for (const key in initState) {
			if (this[key]) continue; // 防止覆盖
			this[key] = () => useSelector<any>(
				(state) => state[this.name][key]
			)
		}
	}
	private makeActions() {
		const rs = this.reducers();
		for (const key in rs) {
			const aKey = rs[key];
			const action = this.slice.actions[aKey];
			if (!action) continue;

			const func: Reducer<S> = this[key];
			this[key] = (params) => {
				if (this.inReducer)
					return func.call(this, params)

				this.allState = this.store?.getState();
				const dispatch = this.store?.dispatch; // this.dispatch || useDispatch();
				this.inReducer = true;
				dispatch(action(params))
				this.inReducer = false;
			}
		}
	}

	// endregion

	// region Selector

	// endregion

	// region Reducer

	@reducer
	public reset() { return this.initialState }

	@reducer
	public getState() {
		return this.state;
	}

	@reducer
	public setState(state: StateSetter<S>) {
		console.error('setState', state);
		for (const key in state) {
			const val = state[key];
			if (/[.\[\]]/.test(key))
				// 路径设置
				this.evalSetDataPath(key, val);
			else this.state[key] = val;
		}
	}
	private async evalSetDataPath(key: string, val) {
		const subs = key.split('.');
		let state: any = this.state;
		for (let i = 0; i < subs.length; i++) {
			const match = /(\w+?)\[(\d+?)]/.exec(subs[i]); // 是否数组
			const idx = match && Number.parseInt(match[2]);
			const sub = match ? match[1] : subs[i];

			if (i == subs.length - 1) {
				// 最后一项
				if (match) {
					if (state[sub] == undefined) state[sub] = [];
					state[sub][idx] = val;
				} else state[sub] = val;
			} else {
				if (state[sub] == undefined) state[sub] = match ? [] : {};
				state = state[sub];

				if (match) {
					if (state[idx] == undefined) state[idx] = {};
					state = state[idx];
				}
				// const tmp = (state = match ? state[sub]?.[idx] : state[sub]);
			}
			// if (state == undefined) state = {}; // return
		}
	}

	// @reducer
	// public setState(state: StateSetter<S>) {
	// 	for (const key in state) {
	// 		const val = state[key];
	// 		if (/[.\[\]]/.test(key)) // 路径设置
	// 			this.evalSetDataPath(key, val);
	// 		else
	// 			this.state[key] = val;
	// 	}
	// }
	// private async evalSetDataPath(key: string, val) {
	// 	const subs = key.split('.');
	// 	let state = this.state, root;
	// 	for (let i = 0; i < subs.length; i++) {
	// 		const match = /(\w+?)\[(\d+?)]/.exec(subs[i]); // 是否数组
	// 		const idx = match && Number.parseInt(match[2]);
	// 		const sub = match ? match[1] : subs[i];
	//
	// 		if (i == subs.length - 1) // 最后一项
	// 			match ? state[sub] && (state[sub][idx] = val) : (state[sub] = val);
	// 		else
	// 			state = (match ? state[sub]?.[idx] : state[sub]);
	// 		if (state == undefined) return;
	// 	}
	// }

	@reducer
	public saveState(key) {
		if (!this.state) return;
		storageMgr().setData(key, this.state);
	}

	@reducer
	public loadState(key) {
		this.setState(storageMgr().getData(key, Object));
		storageMgr().removeData(key);
	}

	// endregion

	// region 其他函数

	// endregion
}
type StateOf<S extends BaseSlice> =
	S extends BaseSlice<any, infer S> ? S : {};
export type SliceObject<S extends BaseSlice>
	= S & {[K in keyof StateOf<S>]?: () => StateOf<S>[K]}

// region 测试代码

// export interface TestState {
// 	aa: string
// 	bb: boolean
// }
//
// export class TestSlice extends BaseSlice<"test", TestState> {
//
// 	protected get name(): "test" { return "test" }
// 	protected get initialState() {
// 		return {aa: "", bb: false}
// 	}
//
// 	@reducer("r1")
// 	public r1({a, b}: {a: string, b: boolean}) {
// 		this.state.aa = a;
// 		this.state.bb = b;
// 	}
//
// }
// export const testSlice = new TestSlice();

// endregion

