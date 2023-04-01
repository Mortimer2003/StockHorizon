import style from "./index.module.css";
import {makeStyle} from "../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";
import {Types} from "aptos";

import {KChart} from "./KChart";

const s = makeStyle(style);

export function StockDisplay() {

    return <div className={s('stockDisplay')}>
        <div>
            股票详情：
        </div>
        <KChart/>
    </div>
}
