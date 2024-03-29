import style from "./index.module.css";

import {useNavigate} from "react-router-dom";
import React, {useState, useRef, useEffect} from "react";
import {asyncTask, BaseAsyncTaskManager} from "../redux/BaseAsyncTaskManager";
import {getManager, manager} from "../../app/BaseManager";
import {get, post, put} from "../http/NetworkManager";
import {
    Collect,
    Recom,
    RecomType, RTP,
    StockDatas,
    StockEnterprise,
    StockHot,
    StockNews,
    StockNewsAbout,
    StockPrice,
    StockRecom
} from "./StockSlice"

export const GetRecom = get<
    { type:number, offset?: number, count: number, id: string },
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

export const GetRTP = get<
    { stockCode:string },
    { price:string, abChange:string, reChange:string}
    >("/api/stock/rtp")

export const GetStockDetail = get<
    { stockCode:string , id:string},
    {
        stockData:StockDatas,
        priceLibrary:StockPrice[],
        recommend:Recom,
        isCollected:{collect:number,hold:number}
    }
    >("/api/stock/detail/data")

export const GetEnterprise = get<
    { stockCode:string },
    { enterpriseInfo:StockEnterprise }
    >("/api/stock/detail/enterprise")

export const GetNewsAbout = get<
    { stockCode:string, limit:number, offset:number, count:number },
    { newsList: StockNewsAbout[]}
    >("/api/stock/detail/news")

export const SearchStock = get<
    { query:string },
    { stockCode: string, name: string }
    >("/api/stock/search")

export const CollectStock = get<
    { id:string, stockCode:string, type:number},
    { state: number }
    >("/api/user/collectStock")

export const GetCollect = get<
    { id:string },
    { collectList:Collect[], holdList:Collect[] }
    >("/api/user/getCollect")

export const GetCollectRTP = get<
    { id:string, type:number },
    { rtplist:RTP[]}
    >("/api/user/getCollectRTP")

@manager
export class StockManager extends BaseAsyncTaskManager {

    @asyncTask
    public async getStockRecom(params:{type: number, offset?: number, count: number, id: string}) {
        return await GetRecom(params);
    }

    @asyncTask
    public async getHot(params:{length: number, type: number, limit: number}) {
        return await GetHot(params);
    }

    @asyncTask
    public async getNews(params:{offset?: number, limit: number, count: number}) {
        return await GetNews(params);
    }

    @asyncTask
    public async getRTP(params:{stockCode: string}) {
        return await GetRTP(params);
    }

    @asyncTask
    public async getStockDetail(params:{stockCode: string, id:string}) {
        return await GetStockDetail(params);
    }

    @asyncTask
    public async getEnterprise(params:{stockCode: string}) {
        return await GetEnterprise(params);
    }

    @asyncTask
    public async getNewsAbout(params:{stockCode: string, limit: number, offset: number, count: number}) {
        return await GetNewsAbout(params);
    }

    @asyncTask
    public async searchStock(query: string) {
        return await SearchStock({query});
    }

    @asyncTask
    public async collectStock(params:{id:string, stockCode:string, type:number}) {
        return await CollectStock(params);
    }

    @asyncTask
    public async getCollect(params:{id:string}) {
        return await GetCollect(params);
    }

    @asyncTask
    public async getCollectRTP(params:{id:string, type:number}) {
        return await GetCollectRTP(params);
    }

}

export function stockMgr() {
    return getManager(StockManager)
}