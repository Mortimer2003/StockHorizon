import style from "./index.module.css";
import {makeStyle} from "../../../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";

import {Types} from "aptos";
import {Link} from "react-router-dom";
import {StockRecom} from "../../../../../../modules/stock/StockSlice";
import {stockMgr} from "../../../../../../modules/stock/StockManager";

const s = makeStyle(style);

export function Recommend() {
    //TODO:测试数据集

    // @ts-ignore
    const [buyList,setBuyList]=useState<StockRecom[]>([
        {name:"推荐加仓1",code:"a1",degree:10},
        {name:"推荐加仓2",code:"a2",degree:9},
        {name:"推荐加仓3",code:"a3",degree:8},
        {name:"推荐加仓4",code:"a4",degree:7},
        {name:"推荐加仓5",code:"a5",degree:6},
        {name:"推荐加仓6",code:"a6",degree:5},
        {name:"推荐加仓7",code:"a7",degree:4},
        {name:"推荐加仓8",code:"a8",degree:3},
        {name:"推荐加仓9",code:"a9",degree:2},
        {name:"推荐加仓10",code:"a10",degree:1},
    ]);

    // @ts-ignore
    const [sellList,setSellList]=useState<StockRecom[]>([
        {name:"推荐减仓1",code:"b1",degree:10},
        {name:"推荐减仓2",code:"b2",degree:9},
        {name:"推荐减仓3",code:"b3",degree:8},
        {name:"推荐减仓4",code:"b4",degree:7},
        {name:"推荐减仓5",code:"b5",degree:6},
        {name:"推荐减仓6",code:"b6",degree:5},
        {name:"推荐减仓7",code:"b7",degree:4},
        {name:"推荐减仓8",code:"b8",degree:3},
        {name:"推荐减仓9",code:"b9",degree:2},
        {name:"推荐减仓10",code:"b10",degree:1},
    ]);

    const [tagIdx, setTagIdx] = useState(0);

    //TODO:处理tag切换后的请求发起

    const [login,setLogin] = useState(false)

    const menuNames=["全部","收藏"]

    const handleMenuClick = (index, name) => {
        setTagIdx(index);
    };

    const [currentPageOfBuy, setCurrentPageOfBuy] = useState(1);
    const [currentPageOfSell, setCurrentPageOfSell] = useState(1);
    const pageSize = 5; // 每页展示的条数

    const startIndexOfBuy = (currentPageOfBuy - 1) * pageSize;
    const endIndexOfBuy = startIndexOfBuy + pageSize;
    const startIndexOfSell = (currentPageOfSell - 1) * pageSize;
    const endIndexOfSell = startIndexOfSell + pageSize;


    const currentBuys = buyList.slice(startIndexOfBuy, endIndexOfBuy);
    const currentSells = sellList.slice(startIndexOfSell, endIndexOfSell);

    const handlePrevClickOfBuy = () => {
        setCurrentPageOfBuy((prevPage) => Math.max(prevPage - 1, 1));
    };
    const handleNextClickOfBuy = () => {
        setCurrentPageOfBuy((prevPage) => Math.min(prevPage + 1, Math.ceil(buyList.length / pageSize)));
    };
    const handlePrevClickOfSell = () => {
        setCurrentPageOfSell((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextClickOfSell = () => {
        setCurrentPageOfSell((prevPage) => Math.min(prevPage + 1, Math.ceil(sellList.length / pageSize)));
    };


    return <div className={s("recommend-container")}>
        <div className={s("title")}>
            <span>投资建议：</span>
            {login &&
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
            }
        </div>
        <div className={s("separate")}></div>
        <div className={s("recommend")}>
            <div className={s("left")}>
                <div className={s("sub-title")}>
                    <span className={s("name")}>推荐加仓</span>
                    <span className={s("degree")}>推荐度</span>
                </div>
                <ol start={1 + (currentPageOfBuy - 1) * pageSize}>{currentBuys.map((item, i) =>
                    <>
                        <li>
                            <Link to={`/stock/${item.code}`} className={s("rank-link")}>
                                <span className={s("name")}>{item.name}</span>
                                <span className={s("degree")}>{item.degree?.toFixed(2)}</span>
                            </Link>
                        </li>
                        <div className={s("separate")}></div>
                    </>
                )}</ol>
                <div className={s("page-buttons")}>
                    <button onClick={handlePrevClickOfBuy} disabled={currentPageOfBuy === 1}>
                        {"<"}
                    </button>
                    <button onClick={handleNextClickOfBuy} disabled={currentPageOfBuy === Math.ceil(sellList.length / pageSize)}>
                        {">"}
                    </button>
                </div>
            </div>

            <div className={s("line")}></div>

            <div className={s("right")}>
                <div className={s("sub-title")}>
                    <span className={s("name")}>推荐减仓</span>
                    <span className={s("degree")}>推荐度</span>
                </div>
                <ol start={1 + (currentPageOfSell - 1) * pageSize}>{currentSells.map((item, i) =>
                    <>
                        <li>
                            <Link to={`/stock/${item.code}`} className={s("rank-link")}>
                                <span className={s("name")}>{item.name}</span>
                                <span className={s("degree")}>{item.degree?.toFixed(2)}</span>
                            </Link>
                        </li>
                        <div className={s("separate")}></div>
                    </>
                )}</ol>
                <div className={s("page-buttons")}>
                    <button onClick={handlePrevClickOfSell} disabled={currentPageOfSell === 1}>
                        {"<"}
                    </button>
                    <button onClick={handleNextClickOfSell} disabled={currentPageOfSell === Math.ceil(sellList.length / pageSize)}>
                        {">"}
                    </button>
                </div>
            </div>
        </div>
    </div>
}
