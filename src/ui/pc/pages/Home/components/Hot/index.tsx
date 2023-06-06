import style from "./index.module.css";
import {makeStyle} from "../../../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";

import {Types} from "aptos";
import {Link} from "react-router-dom";
import {StockHot, TimeToTimestamp} from "../../../../../../modules/stock/StockSlice";
import {stockMgr} from "../../../../../../modules/stock/StockManager";

const s = makeStyle(style);

export function Hot() {
    const [hotList,setHotList] = useState<StockHot[]>([
            {
                name: "热门1",
                code: "c1",
                exchange: "",
                heat: 10,
                heatChange: 5
            },
            {
                name: "热门2",
                code: "c2",
                exchange: "",
                heat: 9,
                heatChange: 4
            },
            {
                name: "热门3",
                code: "c3",
                exchange: "",
                heat: 8,
                heatChange: 3
            },
            {
                name: "热门4",
                code: "c4",
                exchange: "",
                heat: 7,
                heatChange: 2
            },
            {
                name: "热门5",
                code: "c5",
                exchange: "",
                heat: 6,
                heatChange: 1
            },
            {
                name: "热门6",
                code: "c6",
                exchange: "",
                heat: 5,
                heatChange: 0
            },
            {
                name: "热门7",
                code: "c7",
                exchange: "",
                heat: 4,
                heatChange: -1
            },
            {
                name: "热门8",
                code: "c8",
                exchange: "",
                heat: 3,
                heatChange: -2
            },
            {
                name: "热门9",
                code: "c9",
                exchange: "",
                heat: 2,
                heatChange: -3
            },
            {
                name: "热门10",
                code: "c10",
                exchange: "",
                heat: 1,
                heatChange: -4
            }
        ])

    const [tagIdx, setTagIdx] = useState(0);

    const handleMenuClick = (index, name) => {
        setTagIdx(index);
    };

    return <div className={s('hot-container')}>
        <div className={s("title")}>
            <span>热门股票：</span>
            <div className={s("select")}>
        </div>
        </div>
        <div className={s("separate")}></div>
        <div className={s("content")}>
            <ol>{hotList.map((item, i) =>
                <>
                    {item.code&&<li>
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
