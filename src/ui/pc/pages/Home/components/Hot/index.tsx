import style from "./index.module.css";
import {makeStyle} from "../../../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";

import {Types} from "aptos";
import {Link} from "react-router-dom";
import {StockHot, TimeToTimestamp} from "../../../../../../modules/stock/StockSlice";
import {stockMgr} from "../../../../../../modules/stock/StockManager";

const s = makeStyle(style);

let hotList:StockHot[]= [
    {
        name: "苹果",
        code: "SZ000001",
        exchange: "SZ",
        heat: 5781.0,
        heatChange: -71
    },
    {
        name: "华为",
        code: "SZ000005",
        exchange: "SZ",
        heat: 4781.0,
        heatChange: -30
    },
    {
        name: "小米",
        code: "SZ000010",
        exchange: "SZ",
        heat: 3781.0,
        heatChange: +50
    },
    {
        name: "百度",
        code: "SZ000100",
        exchange: "SZ",
        heat: 3581.0,
        heatChange: -10
    },
    {
        name: "腾讯",
        code: "SZ001000",
        exchange: "SZ",
        heat: 3281.0,
        heatChange: +70
    },
    {
        name: "字节",
        code: "SZ010000",
        exchange: "SZ",
        heat: 2281.0,
        heatChange: -65
    },
    {
        name: "网易",
        code: "SZ100000",
        exchange: "SZ",
        heat: 1281.0,
        heatChange: +13
    },
    {
        name: "米哈游",
        code: "SZ111111",
        exchange: "SZ",
        heat: 1281.0,
        heatChange: +13
    },
]


export function Hot() {
    useEffect(()=>{
        stockMgr().getHot(10,0,0).then((value)=>{
            hotList=value.hotList;
        })
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
            <span>筛选:</span>
            {menuNames.map((name, index) => (
                <div key={index}
                     onClick={() => handleMenuClick(index, name)}
                     className={s(`item${index+1}`, tagIdx == index && "current")}>
                    {name}
                </div>
            ))}
        </div>
        </div>
        <div className={s("separate")}></div>
        <div className={s("content")}>
            <ol>{hotList.map((item, i) =>
                <>
                    <li>
                        <Link to={`/stock/${item.code}`} className={s("rank-link")}>
                            <span className={s("name")}>{item.name}</span>
                            <div className={s(item.heatChange==0?"":item.heatChange>0?"red":"green")}>
                                <span className={s("change")}>{item.heatChange==0?'-':item.heatChange>0?'↑  ':'↓  '}</span>
                                <span className={s("degree")}>{item.heat.toFixed(0)}</span>
                            </div>
                        </Link>
                    </li>
                    <div className={s("separate")}></div>
                </>
            )}</ol>
        </div>
    </div>
}
