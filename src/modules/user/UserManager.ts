import style from "./index.module.css";

import {useNavigate} from "react-router-dom";
import React, {useState, useRef, useEffect} from "react";
import {asyncTask, BaseAsyncTaskManager} from "../redux/BaseAsyncTaskManager";
import {getManager, manager} from "../../app/BaseManager";
import {get, post, put} from "../http/NetworkManager";

export const CreateUser = post<
    { phone:string, password: string },
    { state:boolean, id?:string}
    >("/api/user/create")

export const LogInUser = post<
    { phone:string, password: string },
    { state:boolean, id?:string}
    >("/api/stock/logIn")

export const GetUserInfo = get<
    { id:string },
    { name:string, phone:string, avatarUrl:string}
    >("/api/user/:id")

export const EditUserInfo = put<
    { id:string, name?:string, avatar?:FormData },
    { state:boolean }
    >("/api/user/:id")


@manager
export class UserManager extends BaseAsyncTaskManager {

    @asyncTask
    public async createUser(phone:string, password: string) {
        return await CreateUser({phone,password});
    }

    @asyncTask
    public async logInUser(phone:string, password: string) {
        return await LogInUser({phone,password});
    }

    @asyncTask
    public async getUserInfo(id: string) {
        return await GetUserInfo({id});
    }

    @asyncTask
    public async editUserInfo(edit:{id:string, name?:string, avatar?:FormData}) {
        return await EditUserInfo(edit);
    }

}

export function userMgr() {
    return getManager(UserManager)
}