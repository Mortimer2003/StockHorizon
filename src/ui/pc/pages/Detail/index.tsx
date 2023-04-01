import style from "./index.module.css";
import {makeStyle} from "../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";
import {Types} from "aptos";

import {StockDisplay} from "../../components/StockDisplay";

const s = makeStyle(style);

export function Detail() {

    return <div className={s('detail')}>
        详情页
        <StockDisplay/>
    </div>
}
