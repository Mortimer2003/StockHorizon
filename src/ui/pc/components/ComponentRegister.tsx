import {
  DataParams,
  DataPayloadFuncRegister
} from "../../../app/BaseRegister";

export abstract class ComponentRegister<
  TEnum extends number | string,
  Params extends DataParams<TEnum>, R = JSX.Element>
  extends DataPayloadFuncRegister<TEnum, Params, R> {
}
