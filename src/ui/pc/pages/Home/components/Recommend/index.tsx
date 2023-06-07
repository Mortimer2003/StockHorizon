import style from "./index.module.css";
import {makeStyle} from "../../../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect, useContext} from "react";

import {Types} from "aptos";
import {Link} from "react-router-dom";
import {StockRecom} from "../../../../../../modules/stock/StockSlice";
import {stockMgr} from "../../../../../../modules/stock/StockManager";
import {UserContext} from "../../../../../../index";

const s = makeStyle(style);

export function Recommend() {
    const UserSlice=useContext(UserContext)

    const noneList=Array(5).fill({name:"",code:"",degree:null});

    // @ts-ignore
    const [buyList,setBuyList]=useState<StockRecom[]>(noneList);
    // @ts-ignore
    const [sellList,setSellList]=useState<StockRecom[]>(noneList);

    const [tagIdx, setTagIdx] = useState(0);

    useEffect(()=>{

        function makeRequest() {
            stockMgr().getStockRecom({type: tagIdx, offset: 0, count: 100, id:UserSlice.userId})
                .then((value) => {

                    console.log("getStockRecom return: " + value)

                    if(value==null||value.buyList==null)
                        setBuyList(noneList)
                    else setBuyList(value.buyList);

                    if(value==null||value.sellList==null)
                        setSellList(noneList)
                    else setSellList(value.sellList);

                })
                .catch((reason) => {
                    console.log("getStockRecom error: " + reason)
                })
        }

        makeRequest();
        setInterval(makeRequest, 60 * 60 * 1000);
    },[tagIdx])


    const [login,setLogin] = useState(UserSlice.isLogIn)
    useEffect(()=>{
        setLogin(UserSlice.isLogIn);
    },[UserSlice.isLogIn])

    const menuNames=["全部","收藏"]

    const handleMenuClick = (index, name) => {
        setTagIdx(index);
    };

    const [currentPageOfBuy, setCurrentPageOfBuy] = useState(1);
    const [currentPageOfSell, setCurrentPageOfSell] = useState(1);
    const pageSize = 5; // 每页展示的条数

    const startIndex = [(currentPageOfBuy - 1) * pageSize,(currentPageOfSell - 1) * pageSize];
    const endIndex = startIndex.map(it=>it + pageSize);

    const currentBuys = buyList.slice(startIndex[0], endIndex[0]);
    const currentSells = sellList.slice(startIndex[1], endIndex[1]);

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
