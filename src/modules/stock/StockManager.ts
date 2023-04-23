import style from "./index.module.css";

import {useNavigate} from "react-router-dom";
import React, {useState, useRef, useEffect} from "react";
import {asyncTask, BaseAsyncTaskManager} from "../redux/BaseAsyncTaskManager";
import {getManager, manager} from "../../app/BaseManager";
import {get, post, put} from "../http/NetworkManager";
import {
    RecomType,
    StockDatas,
    StockEnterprise,
    StockHot,
    StockNews,
    StockNewsAbout,
    StockPrice,
    StockRecom
} from "./StockSlice"

export const GetRecom = get<
    { type:RecomType, offset?: number, count: number },
    { buyList:StockRecom[],sellList:StockRecom[]}
    >("/api/stock/recom")

export const GetHot = get<
    { length:number,type:number,limit:number},
    { hotList:StockHot[] }
    >("/api/stock/hot")

export const GetNews = get<
    { offset?:number,limit:number,count:number},
    { newsList:StockNews[] }
    >("/api/stock/news")

export const GetStockDetail = get<
    { stockCode:string },
    { stockData:StockDatas, priceLibrary:StockPrice[]}
    >("/api/stock/:stockCode/data")

export const GetEnterprise = get<
    { stockCode:string },
    { enterpriseInfo:StockEnterprise }
    >("/api/stock/:stockCode/enterprise")

export const GetNewsAbout = get<
    { stockCode:string, limit:number, count:number, page:number },
    { newsList: StockNewsAbout[]}
    >("/api/stock/:stockCode/news")

export const SearchStock = get<
    { query:string },
    { stockCode: string }
    >("/api/stock/:query")


@manager
export class StockManager extends BaseAsyncTaskManager {

    @asyncTask
    public async getStockRecom(type: RecomType, count: number, offset?: number) {
        return await GetRecom({type, offset, count});
    }

    @asyncTask
    public async getHot(length: number, type: number, limit: number) {
        return await GetHot({length, type, limit});
    }

    @asyncTask
    public async getNews(limit: number, count: number, offset?: number) {
        return await GetNews({offset, limit, count});
    }

    @asyncTask
    public async getStockDetail(stockCode: string) {
        return await GetStockDetail({stockCode});
    }

    @asyncTask
    public async getEnterprise(stockCode: string) {
        return await GetEnterprise({stockCode});
    }

    @asyncTask
    public async getNewsAbout(stockCode: string, limit: number, count: number, page: number) {
        return await GetNewsAbout({stockCode, limit, count, page});
    }

    @asyncTask
    public async searchStock(query: string) {
        return await SearchStock({query});
    }


}

export function stockMgr() {
    return getManager(StockManager)
}