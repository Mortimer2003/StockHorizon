import {PopWindow} from "../windows/PopWindow";
import {Button} from "../Button";
import {makeStyle} from "../../../../utils/CSSUtils";
import style from "./index.module.css";
import React from "react";

const s = makeStyle(style);

type Params = {
  isShow: boolean
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}

export function LogWindow({isShow, onCancel}: Params) {

  // return <PopWindow isShow={isShow} onCancel={onCancel} className={""}>
  //   <div className={s("log-window")}>
  //
  //       {/*<img src={require("../../../../../assets/selectOwn.png")}/>*/}
  //       <div className={s("textBox")}>
  //         <div className={s("text1")}>Select your own Image</div>
  //         <div className={s("text2")}>Browse from you device, select image</div>
  //         <div className={s("text2")}>and make it a drop</div>
  //         <div className={s("createButton")}></div>
  //       </div>
  //   </div>
  // </PopWindow>

  return <div className={s("log-window")}>

  </div>
}
