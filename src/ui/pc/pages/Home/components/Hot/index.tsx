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
                name: "",
                code: "",
                exchange: "",
                heat: null,
                heatChange: null
            },
            {
                name: "",
                code: "",
                exchange: "",
                heat: null,
                heatChange: null
            },
            {
                name: "",
                code: "",
                exchange: "",
                heat: null,
                heatChange: null
            },
            {
                name: "",
                code: "",
                exchange: "",
                heat: null,
                heatChange: null
            },
            {
                name: "",
                code: "",
                exchange: "",
                heat: null,
                heatChange: null
            },
            {
                name: "",
                code: "",
                exchange: "",
                heat: null,
                heatChange: null
            },
            {
                name: "",
                code: "",
                exchange: "",
                heat: null,
                heatChange: null
            },
            {
                name: "",
                code: "",
                exchange: "",
                heat: null,
                heatChange: null
            },
            {
                name: "",
                code: "",
                exchange: "",
                heat: null,
                heatChange: null
            },
            {
                name: "",
                code: "",
                exchange: "",
                heat: null,
                heatChange: null
            }
        ])

    useEffect(()=>{
        //setHotList(dataTest.hotList); //TODO:测试用,待删除

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



    
    //TODO:处理tag切换后的请求发起

    const [tagIdx, setTagIdx] = useState(0);
    const menuNames=["全球","沪深","港股","美股"]

    const handleMenuClick = (index, name) => {
        setTagIdx(index);
    };

    return <div className={s('hot-container')}>
        <div className={s("title")}>
            <span>热门股票：</span>
            <div className={s("select")}>
            {/*<span>筛选:</span>*/}
            {/*{menuNames.map((name, index) => (*/}
            {/*    <div key={index}*/}
            {/*         onClick={() => handleMenuClick(index, name)}*/}
            {/*         className={s(`item${index+1}`, tagIdx == index && "current")}>*/}
            {/*        {name}*/}
            {/*    </div>*/}
            {/*))}*/}
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
