import style from "./index.module.css";

import {useNavigate} from "react-router-dom";
import React, {useState, useRef, useEffect} from "react";
import {asyncTask, BaseAsyncTaskManager} from "../redux/BaseAsyncTaskManager";
import {getManager, manager} from "../../app/BaseManager";
import {get, post, put} from "../http/NetworkManager";

@manager
export class UserManager extends BaseAsyncTaskManager {

}

export function userMgr() {
    return getManager(UserManager)
}


