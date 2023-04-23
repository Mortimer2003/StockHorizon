import {configureStore} from "@reduxjs/toolkit";


const RegisterSlices = [

];
const RegisterManagers = [

];

export type State = {
  // test: TestState,

}

// type Slices = typeof RegisterSlices;
// type NameOf<S extends BaseSlice> =
//   S extends BaseSlice<infer N, any> ? N : "";

export const StoreConfig = {
  reducer: RegisterSlices.reduce((res, s) => ({
    ...res, [s.name]: s.reducer
  }), {})
}

export const Store = configureStore(StoreConfig);
RegisterSlices.forEach(s => s.store = Store);
RegisterManagers.forEach(m => m.store = Store);

window["Store"] = Store;

// export type StoreType = typeof Store;
export type AppDispatch = typeof Store.dispatch;
// Use throughout your app instead of plain `useDispatch` and `useSelector`
// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
