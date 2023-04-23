import style from "./index.module.css";
import {makeStyle} from "../../../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";

import {Types} from "aptos";
import {Link} from "react-router-dom";
import {StockRecom} from "../../../../../../modules/stock/StockSlice";
import {stockMgr} from "../../../../../../modules/stock/StockManager";

const s = makeStyle(style);

let buyList:StockRecom[]=[
    {name:"米哈游",code:"SZ000001",degree:10.0},
    {name:"阿里巴巴",code:"SZ000002",degree:8.0},
    {name:"腾讯",code:"SZ000003",degree:6.0},
    {name:"华为",code:"SZ000004",degree:5.0},
    {name:"百度",code:"SZ000005",degree:4.0},
    {name:"小米",code:"SZ000003",degree:3.3},
    {name:"bilibili",code:"SZ000004",degree:3.2},
    {name:"网易",code:"SZ000005",degree:3.0},
    {name:"格力",code:"SZ000001",degree:2.9},
    {name:"富途",code:"SZ000002",degree:2.5},
];

let sellList:StockRecom[]=[
    {name:"苹果",code:"SZ000001",degree:10.0},
    {name:"微软",code:"SZ000002",degree:8.0},
    {name:"亚马逊",code:"SZ000003",degree:6.0},
    {name:"Google",code:"SZ000004",degree:5.0},
    {name:"Meta",code:"SZ000005",degree:4.5},
    {name:"英伟达",code:"SZ000003",degree:3.3},
    {name:"IBM",code:"SZ000004",degree:3.2},
    {name:"英特尔",code:"SZ000001",degree:2.9},
    {name:"Adobe",code:"SZ000002",degree:2.5},
    {name:"甲骨文",code:"SZ000005",degree:1.0},
];

//TODO：调用getStockRecom(type:RecomType,count:number,offset?:number),
//     返回值设置buyList/sellList
//     注意切换类别时更新



export function Recommend() {
    useEffect(()=>{
        stockMgr().getStockRecom(0,100,0).then((value)=>{
            buyList=value.buyList;
            sellList=value.sellList;
        })
    },[])

    //TODO:处理tag切换后的请求发起

    const [tagIdx, setTagIdx] = useState(0);
    const menuNames=["全部","持有","收藏"]

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
        <div className={s("recommend")}>
            <div className={s("left")}>
                <div className={s("sub-title")}>
                    <span className={s("name")}>推荐买入</span>
                    <span className={s("degree")}>推荐度</span>
                </div>
                <ol start={1 + (currentPageOfBuy - 1) * pageSize}>{currentBuys.map((item, i) =>
                    <>
                        <li>
                            <Link to={`/stock/${item.code}`} className={s("rank-link")}>
                                <span className={s("name")}>{item.name}</span>
                                <span className={s("degree")}>{item.degree.toFixed(1)}</span>
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
                    <span className={s("name")}>推荐卖出</span>
                    <span className={s("degree")}>推荐度</span>
                </div>
                <ol start={1 + (currentPageOfSell - 1) * pageSize}>{currentSells.map((item, i) =>
                    <>
                        <li>
                            <Link to={`/stock/${item.code}`} className={s("rank-link")}>
                                <span className={s("name")}>{item.name}</span>
                                <span className={s("degree")}>{item.degree.toFixed(1)}</span>
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
