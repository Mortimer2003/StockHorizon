import style from "./index.module.css";
import {makeStyle} from "../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect, useMemo} from "react";

import {Types} from "aptos";
import {Navigation} from "../../components/Navigation";
import {useParams} from "react-router-dom";
import {userMgr} from "../../../../modules/user/UserManager";
import {stockMgr} from "../../../../modules/stock/StockManager";
import {Collect} from "../../../../modules/stock/StockSlice";
//import  "../../../../modules/user/UserSlice";

const s = makeStyle(style);

export function Collected() {
    return <></>
}

export function User(props) {
    const address = useParams<{ address: string }>().address;

    return <div className={s('user')}>
    </div>
}
