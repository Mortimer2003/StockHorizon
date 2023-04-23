import style from "./index.module.css";
import {makeStyle} from "../../../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";

import {Types} from "aptos";
import {StockEnterprise} from "../../../../../../modules/stock/StockSlice";
import {stockMgr} from "../../../../../../modules/stock/StockManager";

const s = makeStyle(style);


let enterpriseInfo:StockEnterprise= {
    "简介":"平安银行股份有限公司主要从事经有关监菅机构批准的各项商业银行业务。220年3月，(具亚洲货币主办2*中国私人银行大奖评选。本行私人银行获评“嗫佳家族办公宫\"大奖、。22068月，坯洲银行家)举9\"2126年;发中国奖项计姑\"活动。本行森获跤中国最佳手机银行依用\"、“中国最佳客户体验(无伴擦实项英颜)\"、“中国最佳的业模式\"、“中国最佳质吊金胜银行奖\"“最佳网将安全和叮T风险管理项目“等A项大奖。2286年11月，救威机构叮T研究政间公司同阳arte 宜t力的持\" toer金&最联务创浙贸\"决表，本行凭错智依风控开台顶目，获存得\"ieart er金融得分创饿奖\"区太地区的冠释等。‘，",
    "公司网站":"https://www.123.com",
    "公司地址":"广东省深圳市罗湖区泯情;东路5047号，广东省深圳市福田区益田路5023号平安金融中心B座",
    "公司电话":"86-755-82080387"
}

export function Enterprise({code}) {
    useEffect(()=>{
        stockMgr().getEnterprise(code).then((value)=>{
            enterpriseInfo=value.enterpriseInfo;
        })
    },[])

    return <div className={s('enterprise')}>
        <div className={s("title")}>
            <span>企业信息</span>
        </div>
        <div>
            {Object.entries(enterpriseInfo).map(([name, value],index)=>
                name=="公司网站"?
                    <div><b>{name}：</b><a href={value} target="_blank">{value}</a></div>
                    :
                    <div className={s(name=="简介"?"intro":"")}><b>{name}</b>：{value}</div>
            )}
        </div>
    </div>
}
