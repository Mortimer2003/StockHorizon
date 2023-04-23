import style from "./index.module.css";
import {makeStyle} from "../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";
import { Link } from 'react-router-dom';

import {Types} from "aptos";
import {Navigation} from "../../components/Navigation";
import {Recommend} from "./components/Recommend";
import {StockDisplay} from "../Detail/components/StockDisplay";
import {Enterprise} from "../Detail/components/Enterprise";
import {News} from "./components/News";
import {Hot} from "./components/Hot";

const s = makeStyle(style);


export function Home() {

    return <div className={s('home')}>
        <Navigation/>

        <div className={s('content')}>
            <div className={s("top")}>
                <Recommend/>
                <Hot/>
            </div>
            <News/>
        </div>
    </div>

}


