import style from "./index.module.css";
import {makeStyle} from "../../../../utils/CSSUtils";
import {Types} from "aptos";

import React, {useState, useRef, useEffect} from "react";
import {useParams} from "react-router-dom";

import {StockDisplay} from "./components/StockDisplay";
import {Navigation} from "../../components/Navigation";
import {Enterprise} from "./components/Enterprise";
import {News} from "./components/News";


const s = makeStyle(style);

export function Detail(props) {

    const code = useParams<{ stockCode: string }>().stockCode;
    const [name,setName] = useState("");

    return <div className={s('detail')}>
        <Navigation page={"detail"} code={code} name={name} /* searchResult={props.searchResult} setSearchResult={props.setSearchResult}*//> {/*TODO：这里需要传入name参数*/}
        <div className={s('content')}>
            <StockDisplay code={code}/>
            <div className={s('right')}>
                <Enterprise code={code} setName={setName}/>
                <News code={code}/>
            </div>
        </div>
    </div>
}
