import style from "./index.module.css";
import {makeStyle} from "../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect, useMemo} from "react";

import {Types} from "aptos";
import {Navigation} from "../../components/Navigation";
import {useParams} from "react-router-dom";
import {userMgr} from "../../../../modules/user/UserManager";

const s = makeStyle(style);


export function None(props) {

    return <div className={s('none')}>

    </div>
}
