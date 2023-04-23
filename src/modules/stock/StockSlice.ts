import style from "./index.module.css";

import {useNavigate} from "react-router-dom";
import React, {useState, useRef, useEffect} from "react";

export enum RecomType {
    "全部", "持有", "收藏"
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

export type RTData = {
    price: string,
    abChange: string,
    reChange: string
}

export type StockDatas = {
    "今开":string,
    "昨收":string,
    "最高":string,
    "最低":string,
    "成交量":string,
    "成交额":string,
    "换手率":string,
    "市盈(TTM)":string,
    "市净率":string,
    "流通值":string,
    "流通股":string,
    "总市值":string,
    "总股本":string,
    "52周高":string,
    "52周低":string,
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
    "简介":string,
    "公司网站":string,
    "公司地址"?:string,
    "公司电话"?:string
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
    // 时间戳，单位为毫秒 timestamp = 1617681835000;
    // 创建一个Date对象，并将时间戳作为参数传入
    const date = new Date(timestamp);
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
