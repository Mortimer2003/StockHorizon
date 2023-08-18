import {PopWindow} from "../windows/PopWindow";
import {makeStyle} from "../../../../utils/CSSUtils";
import style from "./index.module.css";
import React from "react";

const s = makeStyle(style);

type Params = {
  isShow: boolean
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}

export function LogWindow({isShow, onCancel}: Params) {


  return <div className={s("log-window")}>

  </div>
}
