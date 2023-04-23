import style from "./index.module.css";
import {makeStyle} from "../../../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";
import {Types} from "aptos";

import {KChart} from "./KChart";
import {RTData, StockDatas, StockPrice} from "../../../../../../modules/stock/StockSlice";
import {stockMgr} from "../../../../../../modules/stock/StockManager";

//测试用例
import rawData from "../../../../../../assets/data/stock-DJI.json"

const s = makeStyle(style);

let testRTD:RTData = {
    price: "$127.44",
    abChange: "-0.71",
    reChange: "-0.55%"
}

let testDatas:StockDatas= {
    "今开":"12.60",
    "昨收":"12.65",
    "最高":"12.61",
    "最低":"12.50",
    "成交量":"56.33万手",
    "成交额":"7.06亿",
    "换手率":"0.29%",
    "市盈(TTM)":"5.36",
    "市净率":"0.67",
    "流通值":"2441.22亿",
    "流通股":"194.06亿",
    "总市值":"2441.26亿",
    "总股本":"194.06亿",
    "52周高":"16.37",
    "52周低":"10.22",
}




//datas = getDatas(code);




export function StockDisplay({code}) {


    const [stockDatas,setStockDatas] = useState<StockDatas>();
    const [stockPrices,setStockPrices] = useState<StockPrice[]>();

    useEffect(()=>{
        stockMgr().getStockDetail(code).then((value)=>{
            setStockDatas(value.stockData);
            setStockPrices(value.priceLibrary);
        }).catch((reason)=>{
            console.log("get detail error: "+reason)
        });
    },[])

    //
    // //测试用：
    // stockDatas==null?setStockDatas(testDatas):console.log("stockDatas获取成功");
    // stockPrices==null?setStockPrices(rawData as unknown as StockPrice[]):console.log("stockDatas获取成功");

    const datas=Object.entries(stockDatas);

    // @ts-ignore
    return <div className={s('stockDisplay')}>
        <div className={s("title")}>
            <span>股票详情</span>
        </div>

        <div className={s('RT-data', parseFloat(testRTD.abChange)>0?"red":parseFloat(testRTD.abChange)<0?"green":"")}>
            <span className={s('RT-price')}>{testRTD.price}</span>
            <span>{testRTD.abChange}</span>
            <span>{testRTD.reChange}</span>
        </div>

        <table>
            {datas.map(([name, value],index)=> {
                if (index % 5 === 0) {
                    return (
                        <tr key={index}>
                            {datas.slice(index, index + 5).map(([name, value], subIndex) => (
                                <td key={subIndex}><span className={s('left')}>{name}：</span><span className={s('right')}>{value}</span></td>
                            ))}
                        </tr>
                    );
                }})}
        </table>
        <KChart rawData={stockPrices}/>
    </div>
}
