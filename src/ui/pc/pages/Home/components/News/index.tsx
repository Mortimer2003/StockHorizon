import style from "./index.module.css";
import {makeStyle} from "../../../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";

import {Types} from "aptos";
import {StockHot, StockNews, TimestampToTime, TimeToTimestamp} from "../../../../../../modules/stock/StockSlice";
import {stockMgr} from "../../../../../../modules/stock/StockManager";
import dataTest from "../../../../../../assets/data/news-test.json";

const s = makeStyle(style);


// let newsList:StockNews[]= [
//     {
//         content:"【新益品。拟发行不趣5.2亿元可转钱用丹商暗替能装备制迹基地项目】新益因公告，公司打雨不特定对象发行可转换公司债券的募典资俭总额不超过5.2亿元，将用于新益召商猎督能装备笥迹墓地项目及补充说动资金.",
//         date:"2021/4/6 上午11:10:35", //记得把时间戳转为时间
//         url:"https://www.123.com"
//     },
//     {
//         content:"【安凯客车:3月客车销量为136辆】安凯客车公告，安凯客车公告，3月客车销量为136辆;本年累计销量为508辆，同比减少26.80%。",
//         date:"2021/4/6 上午11:08:24", //记得把时间戳转为时间
//         url:"https://www.123.com"
//     },
//     {
//         content:"广汽集团:3月汽车销量为231,735辆，同比增长1.87%。",
//         date:"2021/4/6 上午11:07:56", //记得把时间戳转为时间
//         url:"https://www.123.com"
//     },
//     {
//         content:"【核店东磁:一季度的和前绪4.8-68.5%】模店东硬方布业须预合，预t235年一季度日晦净利5.483亿元-6.2元，比增长49.8-69.5%。公司光炮产业在全体市场晋求总体向好的情况下，不斯优化产品结构。的铁推迷阵本增效，深让交该兹异化战略。并进一步加大全球市场拓展力度，使得组件出货量同比、环此均灾现了较大的增长、面利同比灾现了最番以壮上的增长、公司磁材产业受市场麦争加倒和下浩窃分应用市场景气度猪的形响。蓝利同比有所下阵。",
//         date:"2021/4/6 上午11:10:35", //记得把时间戳转为时间
//         url:"https://www.123.com"
//     },
//     {
//         content:"资讯内容5，比一般的标题要长一些；资讯内容，比一般的标题要长一些；资讯内容，比一般的标题要长一些；",
//         date:"2021/4/6 上午11:10:35", //记得把时间戳转为时间
//         url:"https://www.123.com"
//     },
//     {
//         content:"资讯内容6，比一般的标题要长一些；资讯内容，比一般的标题要长一些；资讯内容，比一般的标题要长一些；",
//         date:"2021/4/6 上午11:10:35", //记得把时间戳转为时间
//         url:"https://www.123.com"
//     },
// ]
//
// newsList=dataTest.newsList;


export function News() {
    const [newsList,setNewsList] = useState<StockNews[]>([
        {
            content:"",
            date:"", //记得把时间戳转为时间
            url:""
        },
        {
            content:"",
            date:"", //记得把时间戳转为时间
            url:""
        },
        {
            content:"",
            date:"", //记得把时间戳转为时间
            url:""
        },
        {
            content:"",
            date:"", //记得把时间戳转为时间
            url:""
        },
        {
            content:"",
            date:"", //记得把时间戳转为时间
            url:""
        },
    ])

    useEffect(()=>{
        setNewsList(dataTest.newsList);//TODO:测试用,待删除

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
                        <div className={s("left")}>{TimestampToTime(item.date)}</div>
                    </div>
                    <div><a href={item.url} target="_blank" className={s("news-information")}>{item.content}</a></div>
                    <div className={s("separate")}></div>
                </>
            )}

            </div>
    </div>
}
