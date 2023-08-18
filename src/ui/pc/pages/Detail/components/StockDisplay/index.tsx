import style from "./index.module.css";
import {makeStyle} from "../../../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect, useContext} from "react";
import {Types} from "aptos";

import {KChart} from "./KChart";
import {StockDatas, StockPrice} from "../../../../../../modules/stock/StockSlice";
import {stockMgr} from "../../../../../../modules/stock/StockManager";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../../../../../root";


const s = makeStyle(style);

function order(obj){
    const order = ["todayOpen", "yesterdayClose", "highest", "lowest","volume",
        "amount","turnoverRate","ttm","per","circulationMarketValue",
        "circulatingShares","mcap","zgb","ww52Highest","ww52Lowest"]
    return  order.map(key => obj[key]);
}


const noneDatas:StockDatas= {
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

const nonePrice:StockPrice=["",null,null,null,null,null]


const names=["今开", "昨收", "最高", "最低", "成交量", "成交额", "换手率", "市盈(TTM)", "市净率", "流通值", "流通股", "总市值", "总股本", "52周高", "52周低"]

export function StockDisplay({code,setName}) {
    const navigate=useNavigate()
    const {userSlice, setUserSlice}=useContext(UserContext)

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
    const [stockPrices,setStockPrices] = useState<StockPrice[]>(new Array(5).fill(nonePrice));
    const [datas,setDatas] = useState<any[]>();

    useEffect(()=>{
        stockMgr().getEnterprise({stockCode:code})
            .then((value)=>{
                setName(value.enterpriseInfo.name);
            })
    },[])

    useEffect(()=>{
        function makeRequest() {
            stockMgr().getStockDetail({stockCode: code,id:userSlice.isLogIn?userSlice.userId:""})
                .then((value) => {
                    console.log("getStockDetail return: " + value)

                    if(value.stockData==null)
                        navigate('/none');

                    setRecommend(value.recommend)

                    userSlice.isLogIn && setIsCollected({collect:value.isCollected.collect==0?false:value.isCollected.collect==1?true:null,hold:value.isCollected.hold==0?false:value.isCollected.hold==1?true:null})

                    setStockDatas(value.stockData);
                    // @ts-ignore
                    setStockPrices(value.priceLibrary.slice());
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

    const [loadingCollect,setLoadingCollect]=useState(false);
    const [loadingHold,setLoadingHold]=useState(false);

    function handleCollect(type:number) {
        switch (type) {
            case 0:setLoadingCollect(true);break;
            case 1:setLoadingHold(true);break;
        }

        stockMgr().collectStock({id:userSlice.userId,stockCode:code,type:type})
            .then((value) => {
                if(value.state!==2)
                    type==0?
                        setIsCollected({collect:value.state == 1,hold:isCollected.hold})
                        :
                        setIsCollected({collect:isCollected.collect,hold:value.state == 1})
                switch (type) {
                    case 0:setLoadingCollect(false);break;
                    case 1:setLoadingHold(false);break;
                }
            }).catch((reason) => {
                alert("网络错误,请求失败!")
                console.log("collectStock error: " + reason)
                switch (type) {
                    case 0:setLoadingCollect(false);break;
                    case 1:setLoadingHold(false);break;
                }
        });


    }

    // @ts-ignore
    return <div className={s('stockDisplay')}>
        <div className={s("title")}>
            <span>股票详情</span>
            {userSlice.isLogIn &&
                <div>
                    <button onClick={()=>handleCollect(0)}>{loadingCollect?"收藏中":isCollected.collect?"已收藏":"+收藏"}</button>
                    <button onClick={()=>handleCollect(1)}>{loadingHold?"持有中":isCollected.hold?"已持有":"+持有"}</button>
                </div>
            }
        </div>

        <div className={s("top")}>
            <div className={s('RT-data', parseFloat(stockRTP.abChange)>0?"red":parseFloat(stockRTP.abChange)<0?"green":"")}>
                <span className={s('RT-price')}>{stockRTP.price}</span>
                <span>{stockRTP.abChange}</span>
                <span>{stockRTP.reChange}</span>
            </div>
            {recommend?.degree&&<div className={s('recom')}>
                <span>{recommend.strategy == 0 ? "推荐减仓  " : "推荐加仓  "}</span>
                <span>{recommend.degree + "分"}</span>
            </div>}
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
        <KChart rawData={stockPrices.slice()}/>
    </div>
}
