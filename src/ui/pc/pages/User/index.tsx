import style from "./index.module.css";
import {makeStyle} from "../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";

import {Types} from "aptos";

const s = makeStyle(style);

export function User() {
    return <div className={s('user')}>
        <></>
    </div>
}
