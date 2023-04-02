import style from "./index.module.css";
import {makeStyle} from "../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect} from "react";
import {Types} from "aptos";


const s = makeStyle(style);

export function Container() {

    // return <div className={s('container')}>
    //
    // </div>
    return (
        <CompContainer
            company_intro={"Providing online search engine and marketing services"}
            company_zh_name={"百度"}
            company_en_name={"Baidu"}
            company_industry={"信息服务/互联网软件及服务"}
            company_exchange={"纳斯达克交易所"}
        />
    )
}


// 2023-04 -02 企业信息 container
function CompIntro(props) {
    return (
        <div className={ props.className===undefined ? "Container1" : props.className+" Container1"}>
            <b>{ props.content_title }</b>
            <p>{ props.content_value }</p>
        </div>
    )
}

function CompDetail(props) {
    return (
        <div className={ props.className===undefined ? "Container2" : props.className+" Container2"}>
            <b>{ props.content_title }：</b>
            { props.content_value }
        </div>
    )
}

function CompContainer(props) {
    const companyIntro = props.company_intro,
        companyZhName = props.company_zh_name,
        companyEnName = props.company_en_name,
        companyIndustry = props.company_industry,
        companyExchange = props.company_exchange;

    return (
        <div className={ props.className===undefined ? "Container3" : props.className+" Container3"}>
            <CompIntro content_title={"企业简介"} content_value={companyIntro}></CompIntro>
            <br/>
            <CompDetail content_title={"中文名"} content_value={companyZhName} ></CompDetail>
            <CompDetail  content_title={"英文名"} content_value={companyEnName} ></CompDetail>
            <br/>
            <CompDetail content_title={"行业板块"} content_value={companyIndustry} ></CompDetail>
            <CompDetail content_title={"交易所"} content_value={companyExchange} ></CompDetail>
        </div>
    );
}