import style from "./index.module.css";
import {makeStyle} from "../../../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";

import {Types} from "aptos";
import {StockHot, StockNews, TimestampToTime, TimeToTimestamp} from "../../../../../../modules/stock/StockSlice";
import {stockMgr} from "../../../../../../modules/stock/StockManager";

const s = makeStyle(style);


let newsListTest:StockNews[] = [
    {
        content:"资讯内容1，资讯内容1，资讯内容1，资讯内容1，资讯内容1.",
        date:"2021/5/6 上午11:10:35",
        url:"https://www.123.com"
    },
    {
        content:"资讯内容2，资讯内容2，资讯内容2，资讯内容2，资讯内容2.",
        date:"2021/5/6 上午11:10:35",
        url:"https://www.123.com"
    },
    {
        content:"资讯内容3，资讯内容3，资讯内容3，资讯内容3，资讯内容3.",
        date:"2021/5/6 上午11:10:35",
        url:"https://www.123.com"
    },
    {
        content:"资讯内容4，资讯内容4，资讯内容4，资讯内容4，资讯内容4.",
        date:"2021/5/6 上午11:10:35",
        url:"https://www.123.com"
    },
    {
        content:"资讯内容5，资讯内容5，资讯内容5，资讯内容5，资讯内容5.",
        date:"2021/5/6 上午11:10:35",
        url:"https://www.123.com"
    },
    {
        content:"资讯内容6，资讯内容6，资讯内容6，资讯内容6，资讯内容6.",
        date:"2021/5/6 上午11:10:35",
        url:"https://www.123.com"
    },
    {
        content:"资讯内容7，资讯内容7，资讯内容7，资讯内容7，资讯内容7.",
        date:"2021/5/6 上午11:10:35",
        url:"https://www.123.com"
    },
    {
        content:"资讯内容8，资讯内容8，资讯内容8，资讯内容8，资讯内容8.",
        date:"2021/5/6 上午11:10:35",
        url:"https://www.123.com"
    },
]


export function News() {
    const [newsList,setNewsList] = useState<StockNews[]>(newsListTest)

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
