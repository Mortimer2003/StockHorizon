import style from "./index.module.css";
import {makeStyle} from "../../../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";

import {Types} from "aptos";
import {StockHot, StockNews, TimestampToTime, TimeToTimestamp} from "../../../../../../modules/stock/StockSlice";
import {stockMgr} from "../../../../../../modules/stock/StockManager";

const s = makeStyle(style);

export function News() {
    const noneItem = {
        content:"",
        date:"",
        url:""
    }
    const noneList=Array(10).fill(noneItem);
    const [newsList,setNewsList] = useState<StockNews[]>(noneList);

    useEffect(()=>{

        function makeRequest() {
            stockMgr().getNews({offset: 0, limit: 1640966400000, count: 100})
                .then((value) => {
                    console.log("getNews return: " + value)
                    setNewsList(value.newsList);
                })
                .catch((reason) => {
                    console.log("getNews error: " + reason)
                })
        }

        makeRequest();
        setInterval(makeRequest, 10 * 60 * 1000);
    },[])

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; // 每页展示的新闻条数

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const currentNews = newsList.slice(startIndex, endIndex);

    const handlePrevClick = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextClick = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(newsList.length / pageSize)));
    };

    return <div className={s('news-container')}>
        <div className={s("title")}>
            <span>股市资讯:</span>
            <div className={s("page-buttons")}>
                <button onClick={handlePrevClick} disabled={currentPage === 1}>
                    {"<"}
                </button>
                <button onClick={handleNextClick} disabled={currentPage === Math.ceil(newsList.length / pageSize)}>
                    {">"}
                </button>
            </div>
        </div>
        <div className={s("separate")}></div>
        <div className={s("content")}>

            {currentNews.map((item,index)=>
                <>
                    <div className={s("news-top")}>
                        {item.date&&<div className={s("left")}>{TimestampToTime(item.date)}</div>}
                    </div>
                    <div><a href={item.url} target="_blank" className={s("news-information")}>{item.content}</a></div>
                    {item.date&&<div className={s("separate")}></div>}
                </>
            )}

        </div>
    </div>
}
