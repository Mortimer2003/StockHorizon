import style from "./index.module.css";
import {makeStyle} from "../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect, useMemo} from "react";

import {Types} from "aptos";
import {Navigation} from "../../components/Navigation";
import {useParams} from "react-router-dom";
import {userMgr} from "../../../../modules/user/UserManager";
//import  "../../../../modules/user/UserSlice";

const s = makeStyle(style);


export function None(props) {

    return <div className={s('none')}>
        <Navigation page={"none"}/>
        <div className={s('content')}>
            {"非常抱歉，本网站未收录该股票信息"}
        </div>
    </div>
}
