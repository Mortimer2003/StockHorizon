import style from "./index.module.css";

import {useNavigate} from "react-router-dom";
import React, {useState, useRef, useEffect} from "react";
import {asyncTask, BaseAsyncTaskManager} from "../redux/BaseAsyncTaskManager";
import {getManager, manager} from "../../app/BaseManager";
import {get, post, put} from "../http/NetworkManager";
import axios from "axios";

export const CreateUser = get<
    { phone:string, password: string },
    { state:boolean, id?:string}
    >("/api/user/create")

export const LogInUser = get<
    { phone:string, password: string },
    { state:boolean, id?:string}
    >("/api/user/login")

export const GetUserInfo = get<
    { id:string },
    { name:string, phone:string, avatarUrl:string}
    >("/api/user/info")

// export const EditUserInfo = formData =>
//     axios.post('/api/user/editInfo', formData)

export const EditUserInfo =  post<
    /*{ formData:FormData },*/FormData,
    { state:number, name:string, avatarUrl:string}
    >("/api/user/editInfo")



@manager
export class UserManager extends BaseAsyncTaskManager {

    @asyncTask
    public async createUser(params:{phone:string, password: string}) {
        return await CreateUser(params);
    }

    @asyncTask
    public async logInUser(params:{phone:string, password: string}) {
        console.log(params)
        return await LogInUser(params);
    }

    @asyncTask
    public async getUserInfo(params:{id: string}) {
        return await GetUserInfo(params);
    }

    @asyncTask
    public async editUserInfo(params/*:{formData: FormData}*/) {
        return await EditUserInfo(params);
    }

}

export function userMgr() {
    return getManager(UserManager)
}


