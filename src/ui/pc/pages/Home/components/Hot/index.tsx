import style from "./index.module.css";
import {makeStyle} from "../../../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";

import {Types} from "aptos";
import {Link} from "react-router-dom";
import {StockHot, TimeToTimestamp} from "../../../../../../modules/stock/StockSlice";
import {stockMgr} from "../../../../../../modules/stock/StockManager";

const s = makeStyle(style);

export function Hot() {
    const noneItem = {
        name: "",
        code: "",
        exchange: "",
        heat: null,
        heatChange: null
    }
    const noneList=Array(10).fill(noneItem);
    const [hotList,setHotList] = useState<StockHot[]>(noneList)

    useEffect(()=>{

        function makeRequest() {
            stockMgr().getHot({length: 10, type: 0, limit: 1640966400000})
                .then((value) => {
                    console.log("getHot return: " + value)
                    setHotList(value.hotList);
                })
                .catch((reason) => {
                    console.log("getHot error: " + reason)
                })
        }

        makeRequest();
        setInterval(makeRequest, 60 * 60 * 1000);
    },[])

    return <div className={s('hot-container')}>
        <div className={s("title")}>
            <span>热门股票：</span>
        </div>
        <div className={s("separate")}></div>
        <div className={s("content")}>
            <ol>{hotList.map((item, i) =>
                <>
                    {item.code && <li>
                        <Link to={`/stock/${item.code}`} className={s("rank-link")}>
                            <span className={s("name")}>{item.name}</span>
                            <div className={s(item.heatChange == 0 ? "" : item.heatChange > 0 ? "red" : "green")}>
                                <span
                                    className={s("change")}>{item.heatChange == 0 ? '' : item.heatChange > 0 ? '↑  ' : '↓  '}</span>
                                <span className={s("degree")}>{item.heat?.toFixed(0)}</span>
                            </div>
                        </Link>
                    </li>}
                    {item.code&&<div className={s("separate")}></div>}
                </>
            )}</ol>
        </div>
    </div>
}
