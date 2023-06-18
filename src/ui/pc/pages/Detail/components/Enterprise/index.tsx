import style from "./index.module.css";
import {makeStyle} from "../../../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";

import {Types} from "aptos";
import {StockEnterprise, StockHot} from "../../../../../../modules/stock/StockSlice";
import {stockMgr} from "../../../../../../modules/stock/StockManager";

const s = makeStyle(style);

const names=["名称","简介","网址","地址","电话"]

export function Enterprise({code, setName}) {
    const [enterpriseInfo,setEnterpriseInfo] = useState<StockEnterprise>({ name:"",introduction:"",web:"",address:"",phone:""})

    useEffect(()=>{

        stockMgr().getEnterprise({stockCode:code})
            .then((value)=>{
                console.log("getEnterprise return: "+value)
                setEnterpriseInfo(value.enterpriseInfo);
                setName(value.enterpriseInfo.name)
            })
            .catch((reason)=>{
                console.log("getEnterprise error: "+reason)
            })

    },[])

    return <div className={s('enterprise')}>
        <div className={s("title")}>
            <span>企业信息</span>
        </div>
        <div>
            {Object.entries(enterpriseInfo).map(([name, value],index)=>
                index==0?
                    <></>
                    :
                    names[index]=="网址"?
                        <div><b>网址：</b><a href={value} target="_blank">{value}</a></div>
                        :
                        <div className={s(names[index]=="简介"?"intro":"")}><b>{names[index]}</b>：{value}</div>
            )}
        </div>
    </div>
}