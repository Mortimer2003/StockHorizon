import style from "./index.module.css";
import {makeStyle} from "../../../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";
import {Types} from "aptos";

import {KChart} from "./KChart";
import {RTP, StockDatas, StockPrice} from "../../../../../../modules/stock/StockSlice";
import {stockMgr} from "../../../../../../modules/stock/StockManager";
import dataTest from "../../../../../../assets/data/detail-test.json";
import Chart from "./Chart";
import {useNavigate} from "react-router-dom";


const s = makeStyle(style);

function order(obj){
    const order = ["todayOpen", "yesterdayClose", "highest", "lowest","volume",
                   "amount","turnoverRate","ttm","per","circulationMarketValue",
                   "circulatingShares","mcap","zgb","ww52Highest","ww52Lowest"]
    return  order.map(key => obj[key]);
}


let noneDatas:StockDatas= {
    todayOpen:"",
    yesterdayClose:"",
    highest:"",
    lowest:"",
    volume:"",
    amount:"",
    turnoverRate:"",
    ttm:"",
    per:"",
    circulationMarketValue:"",
    circulatingShares:"",
    mcap:"",
    zgb:"",
    ww52Highest:"",
    ww52Lowest:"",
}

const names=["今开", "昨收", "最高", "最低", "成交量", "成交额", "换手率", "市盈(TTM)", "市净率", "流通值", "流通股", "总市值", "总股本", "52周高", "52周低"]

function deepFreeze(array) {
    // 冻结当前数组
    Object.freeze(array);

    // 递归冻结数组的每个元素
    array.forEach((item) => {
        if (Array.isArray(item)) {
            deepFreeze(item); // 递归冻结子数组
        }
        // 冻结子数组的每个元素
        Object.freeze(item);
    });

    return array;
}


export function StockDisplay({code}) {
    const navigate=useNavigate()

    const [stockRTP,setStockRTP] = useState({
        price: "",
        abChange: "",
        reChange: "",
    })
    const [recommend,setRecommend] = useState<{strategy: number, degree: number,}>({
        strategy: null,
        degree: null,
    })
    const [isCollected,setIsCollected] = useState<{collect: boolean, hold: boolean}>({
        collect: null,
        hold: null
    })
    const [stockDatas,setStockDatas] = useState<StockDatas>(noneDatas);
    const [stockPrices,setStockPrices] = useState<StockPrice[]>([
        ["",null,null,null,null,null],
        ["",null,null,null,null,null],
        ["",null,null,null,null,null]
    ]);
    const [datas,setDatas] = useState<any[]>();

    //deepFreeze(dataTest.priceLibrary)

    useEffect(()=>{

        setRecommend({strategy: 1,degree: 6.8,})
        setIsCollected({collect: false, hold: true})

        setStockDatas(dataTest.stockData); //TODO:测试用,待删除
        // @ts-ignore
        setStockPrices(dataTest.priceLibrary.slice()); //TODO:测试用,待删除
        //setDatas(Object.entries(dataTest.stockData));
        setDatas(order(dataTest.stockData));

        function makeRequest() {
            stockMgr().getStockDetail({stockCode: code,id:global.UserSlice.isLogIn?global.UserSlice.isLogIn:""})
                .then((value) => {
                    console.log("getStockDetail return: " + value)

                    if(value.stockData==null)
                        navigate('/none');

                    setRecommend(value.recommend)
                    setIsCollected(value.isCollected)

                    setStockDatas(value.stockData);
                    setStockPrices(value.priceLibrary.slice());
                    //setDatas(Object.entries(value.stockData));
                    setDatas(order(value.stockData))
                }).catch((reason) => {
                    console.log("getStockDetail error: " + reason)
                });
        }

        makeRequest();
        const timer = setInterval(makeRequest, 60 * 60 * 1000);
        return () => {
            clearInterval(timer);
        };

    },[])
    
    useEffect(()=>{
        function makeRequest() {

            setStockRTP({"price":"¥71.00","abChange":"-0.15","reChange":"-0.21%"})

            stockMgr().getRTP({stockCode: code}).then((value) => {
                console.log("get RTP return: " + value)
                // @ts-ignore
                setStockRTP(value);
            }).catch((reason) => {
                console.log("get RTP error: " + reason)
            });
        }

        makeRequest();
        const timer = setInterval(makeRequest, 60 * 1000);
        return () => {
            clearInterval(timer);
        };

    },[])

    function handleCollect(type:number) {
        stockMgr().collectStock({id:global.UserSlice.userId,stockCode:code,type:type})
            .then((value) => {
                if(value.state!==2)
                    type==0?
                        setIsCollected({collect:value.state == 1,hold:isCollected.hold})
                    :
                        setIsCollected({collect:isCollected.collect,hold:value.state == 1})
            }).catch((reason) => {
            console.log("collectStock error: " + reason)
        });

    }

    // @ts-ignore
    return <div className={s('stockDisplay')}>
        <div className={s("title")}>
            <span>股票详情</span>
            {global.UserSlice.isLogIn &&
                <div>
                    <button onClick={()=>handleCollect(0)}>{isCollected.collect?"已收藏":"+收藏"}</button>
                    <button onClick={()=>handleCollect(1)}>{isCollected.hold?"已持有":"+持有"}</button>
                </div>
            }
        </div>

        <div className={s("top")}>
            <div className={s('RT-data', parseFloat(stockRTP.abChange)>0?"red":parseFloat(stockRTP.abChange)<0?"green":"")}>
                <span className={s('RT-price')}>{stockRTP.price}</span>
                <span>{stockRTP.abChange}</span>
                <span>{stockRTP.reChange}</span>
            </div>
            <div className={s('recom')}>
                <span>{recommend.strategy==0?"推荐卖出  ":"推荐买入  "}</span>
                <span>{recommend.degree+"分"}</span>
            </div>
        </div>


        <table>
            {datas?.map((value,index)=> {
                if (index % 5 === 0) {
                    return (
                        <tr key={index}>
                            {datas.slice(index, index + 5).map((value, subIndex) => (
                                <td key={subIndex}><span className={s('left')}>{names[index+subIndex]}：</span><span className={s('right')}>{value}</span></td>
                            ))}
                        </tr>
                    );
                }})}
        </table>
        {/*<button onClick={handleClick}>重新渲染</button>*/}
        <KChart rawData={stockPrices.slice()}/>
        {/*<Chart rawData={dataTest.priceLibrary}/>*/}
    </div>
}
