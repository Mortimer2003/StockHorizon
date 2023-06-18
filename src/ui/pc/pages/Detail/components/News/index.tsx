import style from "./index.module.css";
import {makeStyle} from "../../../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";

import {Types} from "aptos";
import {StockHot, StockNewsAbout, TimestampToTime, TimeToTimestamp} from "../../../../../../modules/stock/StockSlice";
import {stockMgr} from "../../../../../../modules/stock/StockManager";

const s = makeStyle(style);

export function News({code}) {
    const [newsList,setNewsList] = useState<StockNewsAbout[]>([
        {
            title:"",
            date:"",
            source:"",
            url:"",
            information:""
        },
        {
            title:"",
            date:"",
            source:"",
            url:"",
            information:""
        },
        {
            title:"",
            date:"",
            source:"",
            url:"",
            information:""
        },
        {
            title:"",
            date:"",
            source:"",
            url:"",
            information:""
        },
        {
            title:"",
            date:"",
            source:"",
            url:"",
            information:""
        },
    ])

    useEffect(()=>{
        // setNewsList(dataTest.newsList); //TODO:测试用,待删除

        stockMgr().getNewsAbout({stockCode:code, limit:1640966400000, offset:0, count:15})
            .then((value)=>{
                console.log("getNewsAbout return: "+value)
                setNewsList(value.newsList);
            })
            .catch((reason)=>{
                console.log("getNewsAbout error: "+reason)
            })
    },[])

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3; // 每页展示的新闻条数

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const currentNews = newsList.slice(startIndex, endIndex);

    const handlePrevClick = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextClick = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(newsList.length / pageSize)));
    };

    return <div className={s('news')}>
        <div className={s("title")}>
            <span>最新资讯</span>
            <div className={s("page-buttons")}>
                <button onClick={handlePrevClick} disabled={currentPage === 1}>
                    {"<"}
                </button>
                <button onClick={handleNextClick} disabled={currentPage === Math.ceil(newsList.length / pageSize)}>
                    {">"}
                </button>
            </div>
        </div>
        <div>
            {currentNews.map((item,index)=>
                <>
                    <div  className={s("news-item")}>
                        <div className={s("news-top")}>
                            <div className={s("left")}>{item.title}</div>
                            {item.date&&<div className={s("right")}>{item.source+"   "+TimestampToTime(item.date)}</div>}
                        </div>
                        <div><a href={item.url} target="_blank" className={s("news-information")}>{item.information}</a></div>
                    </div>
                    {item.title&&<div className={s("separate")}></div>}
                </>
            )}

        </div>
    </div>
}