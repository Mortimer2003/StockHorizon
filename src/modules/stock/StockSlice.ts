import style from "./index.module.css";

import {useNavigate} from "react-router-dom";
import React, {useState, useRef, useEffect} from "react";

export enum RecomType {
    "全部", "持有", "收藏"
}

export type Recom = {
    strategy: number,
    degree: number
}

export type Collect = {
    stockCode : string,
    name : string,
    strategy : number,
    degree : number
}

export type StockRecom = {
    name:string,
    code:string,
    degree:number
}

export type StockInfo = {
    name:string,
    code:string,
}

export type RTP = {
    price: string,
    abChange: string,
    reChange: string
}

export type StockDatas = {
    todayOpen:string,
    yesterdayClose:string,
    highest:string,
    lowest:string,
    volume:string,
    amount:string,
    turnoverRate:string,
    ttm:string,
    per:string,
    circulationMarketValue:string,
    circulatingShares:string,
    mcap:string,
    zgb:string,
    ww52Highest:string,
    ww52Lowest:string,
}

export type StockPrice = [date:string, open:number, close:number, lowest:number, highest:number, volume:number];

export type StockHot = {
    name:string,
    code:string,
    exchange:string,
    heat:number,
    heatChange:number,
}

export type StockNews = {
    content:string,
    date:string, //记得把时间戳转为时间
    url:string
}

export type StockEnterprise = {
    name:string, //TODO:name处理
    introduction:string,
    web:string,
    address?:string,
    phone?:string
}

export type StockNewsAbout = {
    title:string,
    graph?:string, //丢弃
    date:string, //记得把时间戳转为时间
    source:string,
    url:string,
    information:string
}

//将时间戳转化为日期字符串：
export function TimestampToTime(timestamp:string){
    // 时间戳，单位为毫秒 timestamp = "1617681835000";
    // 创建一个Date对象，并将时间戳作为参数传入
    const date = new Date(Number(timestamp));
    // console.log(date)
    // 调用Date对象的toLocaleString方法，将其转化为本地日期字符串
    return date.toLocaleString(); // 返回：2021/4/6 上午11:10:35
}



//将日期字符串转化为时间戳：
export function TimeToTimestamp(dateString:string){
    // 日期字符串 dateString = '2021/4/6 上午11:10:35';
    // 创建一个Date对象，并将日期字符串作为参数传入
    const date = new Date(dateString);
    // 调用Date对象的getTime方法，获取对应的时间戳
    return date.getTime(); // 返回：1617681835000
}
