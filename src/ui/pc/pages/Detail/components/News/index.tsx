import style from "./index.module.css";
import {makeStyle} from "../../../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";

import {Types} from "aptos";
import {StockNewsAbout, TimeToTimestamp} from "../../../../../../modules/stock/StockSlice";
import {stockMgr} from "../../../../../../modules/stock/StockManager";

const s = makeStyle(style);

// type NewsInfo = {
//     "标题":string,
//     "预览图"?:string, //丢弃
//     "发布日期":string, //记得把时间戳转为时间
//     "来源":string,
//     "来源连接":string,
//     "新闻简讯":string
// }

// let newsInfos:NewsInfo[]= [
//     {
//         "标题":"我是新闻标题1",
//
//         "发布日期":"2021/4/6 上午11:10:35",
//         "来源":"智通财经",
//         "来源连接":"https://www.123.com",
//         "新闻简讯":"这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是……" // 自带省略号
//     },
//     {
//         "标题":"我是新闻标题2",
//
//         "发布日期":"2021/4/6 上午11:10:35",
//         "来源":"智通财经",
//         "来源连接":"https://www.123.com",
//         "新闻简讯":"这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是……" // 自带省略号
//     },
//     {
//         "标题":"我是新闻标题3",
//
//         "发布日期":"2021/4/6 上午11:10:35",
//         "来源":"智通财经",
//         "来源连接":"https://www.123.com",
//         "新闻简讯":"这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是……" // 自带省略号
//     },
//     {
//         "标题":"我是新闻标题4",
//
//         "发布日期":"2021/4/6 上午11:10:35",
//         "来源":"智通财经",
//         "来源连接":"https://www.123.com",
//         "新闻简讯":"这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是……" // 自带省略号
//     },
//     {
//         "标题":"我是新闻标题5",
//
//         "发布日期":"2021/4/6 上午11:10:35",
//         "来源":"智通财经",
//         "来源连接":"https://www.123.com",
//         "新闻简讯":"这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是……" // 自带省略号
//     },
//     {
//         "标题":"我是新闻标题6",
//
//         "发布日期":"2021/4/6 上午11:10:35",
//         "来源":"智通财经",
//         "来源连接":"https://www.123.com",
//         "新闻简讯":"这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是……" // 自带省略号
//     },
// ]

/*
*{标慰'∵‘′，“预能图t :lone，"发有日期∶，‘来g':‘'，来源进梦':"‘ttp;/stock.1 0j0tac o n/2358484/641452%4 shtnl'，"新闻简讯':‘.'}，{标题;:"平安银行。4月3日获融资买入9562.75万元，占当日流入资全比例17.47%'，预施照': Mone，发布日斯'∶16805782629，"来源"上‘同花项称经'，"来源睢按': 'itt.://stock.10jokce.con;
1l/1284lob的184.itil', 新h行讯':同花项(5.833)教数报中6品示，平安银行(0时31)4月3日获胜资买入952.5万元、占当日买入金额的17.4%。当前融资余额39.14亿元。占流通市值的1.5%。超过;历史70%分位水平。融资走势表日期融资变动融资余额4月3日-2527.48万39.14亿3月3...'}]
*/

let newsList:StockNewsAbout[]= [
    {
        title:"复且胀江(154)向平安银行认购合计5亿元的结构性存执产品",

        date:"1687715669",
        source:"智通财经",
        url:"https://www.123.com",
        information:"暂题联经APF讯。奥且胀江(154)发布公洽告，迁日，谈诠司与平安银行订立平安银行结构性存数产品协汉I，同意以日常营运产生的自有闷置资全向平安银行认购总金额为人,民币1.58亿元的结构性存款产品;并与平安银行订立平安银行结构性存饮产品..." // 自带省略号
    },
    {
        title:"平安银行缘色企股白皮书。缘色产业激励不足未来抛在材或、信贷及联市场强化微",

        date:"18041467280",
        source:"经济观威网",
        url:"https://www.123.com",
        information:"经济观察网记者胡群“根据我们X算，推动我国实件经济缘色、高反最发展，偶要超过百;万亿的投资规该。这离分巨大的接全统米，就相落要没色会融的支撑，件随实体经济料轻升级和不斯放欣k、绿色金融巴必将成为一个长城理雪的超级赛道，“4月3日，平交..." // 自带省略号
    },
    {
        title:"平安银行联合信通院举办223中国物职风金会法发展大会",

        date:"1605835630",
        source:"同花顺能经",
        url:"https://www.123.com",
        information:"讯(记者齐全到)日前，平安银行(0.01)携手中国信息运信研究戏盼合举办的223中国教籍网金独决展大会在武汉静开，大会以愠联打物开放共颜\"全主恩。邀请金融、你联网科技等产学甲止企45余位代表出席，探讨物联网技术驱动数宇转圈。分..." // 自带省略号
    },
    {
        title:"我是新闻标题4",

        date:"2021/4/6 上午11:10:35",
        source:"智通财经",
        url:"https://www.123.com",
        information:"这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是……" // 自带省略号
    },
    {
        title:"我是新闻标题5",

        date:"2021/4/6 上午11:10:35",
        source:"智通财经",
        url:"https://www.123.com",
        information:"这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是……" // 自带省略号
    },
    {
        title:"我是新闻标题6",

        date:"2021/4/6 上午11:10:35",
        source:"智通财经",
        url:"https://www.123.com",
        information:"这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是新闻简讯这是……" // 自带省略号
    },
]


export function News({code}) {
    useEffect(()=>{
        stockMgr().getNewsAbout(code, TimeToTimestamp(Date()),3,5).then((value)=>{
            newsList=value.newsList;
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
                    <div className={s("news-top")}>
                        <div className={s("left")}>{item.title}</div>
                        <div className={s("right")}>{item.source+"   "+item.date}</div>
                    </div>
                    <div><a href={item.url} target="_blank" className={s("news-information")}>{item.information}</a></div>
                    <div className={s("separate")}></div>
                </>
            )}

            </div>
    </div>
}
