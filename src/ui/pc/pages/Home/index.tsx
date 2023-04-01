import style from "./index.module.css";
import {makeStyle} from "../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";
import { Link } from 'react-router-dom';

import {Types} from "aptos";

const s = makeStyle(style);


export function Home() {

    const stocks:string[]=["0001","0002","0003","0004"];

    return <div className={s('home')}>
        {stocks.map((id) =>
            <Link to={`/stock/${id}`} className={s("link")}>
                Go to Stock {id}
            </Link>
        )}
    </div>
}
