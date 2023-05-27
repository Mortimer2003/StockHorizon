import style from "./index.module.css";
import {makeStyle} from "../../../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";

import {Types} from "aptos";
import {Link} from "react-router-dom";
import {StockRecom} from "../../../../../../modules/stock/StockSlice";
import {stockMgr} from "../../../../../../modules/stock/StockManager";

const s = makeStyle(style);

//TODO：调用getStockRecom(type:RecomType,count:number,offset?:number),
//     返回值设置buyList/sellList
//     注意切换类别时更新



export function Recommend() {
    //TODO:测试数据集

    // @ts-ignore
    const [buyList,setBuyList]=useState<StockRecom[]>([
        {name:"",code:"",degree:null},
        {name:"",code:"",degree:null},
        {name:"",code:"",degree:null},
        {name:"",code:"",degree:null},
        {name:"",code:"",degree:null},
    ]);
    // @ts-ignore
    const [sellList,setSellList]=useState<StockRecom[]>([
        {name:"",code:"",degree:null},
        {name:"",code:"",degree:null},
        {name:"",code:"",degree:null},
        {name:"",code:"",degree:null},
        {name:"",code:"",degree:null},
    ]);

    const [tagIdx, setTagIdx] = useState(0);

    useEffect(()=>{
        // setBuyList(dataTest.buyList); //TODO:测试用,待删除
        // setSellList(dataTest.sellList); //TODO:测试用,待删除

        function makeRequest() {
            stockMgr().getStockRecom({type: tagIdx, offset: 0, count: 100, id:global.UserSlice.userId})
                .then((value) => {

                    console.log("getStockRecom return: " + value)

                    if(value==null||value.buyList==null)
                        setBuyList([
                            {name:"",code:"",degree:null},
                            {name:"",code:"",degree:null},
                            {name:"",code:"",degree:null},
                            {name:"",code:"",degree:null},
                            {name:"",code:"",degree:null},
                        ])
                    else setBuyList(value.buyList);

                    if(value==null||value.sellList==null)
                        setSellList([
                            {name:"",code:"",degree:null},
                            {name:"",code:"",degree:null},
                            {name:"",code:"",degree:null},
                            {name:"",code:"",degree:null},
                            {name:"",code:"",degree:null},
                        ])
                    else setSellList(value.sellList);

                })
                .catch((reason) => {
                    console.log("getStockRecom error: " + reason)
                })
        }

        makeRequest();
        setInterval(makeRequest, 60 * 60 * 1000);

    },[tagIdx])

    //TODO:处理tag切换后的请求发起

    const [login,setLogin] = useState(global.UserSlice.isLogIn)
    useEffect(()=>{
        setLogin(global.UserSlice.isLogIn);
    },[global.UserSlice.isLogIn])

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
