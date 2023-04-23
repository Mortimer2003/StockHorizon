import style from "./index.module.css";
import {makeStyle} from "../../../../utils/CSSUtils";

import {useNavigate} from "react-router-dom";
import React, {useState, useRef, useEffect} from "react";
import {Types} from "aptos";

import homeIcon from "../../../../assets/icons/home.svg"
import {StockInfo} from "../../../../modules/stock/StockSlice";
import axios from "axios";
import {stockMgr} from "../../../../modules/stock/StockManager";
import {userMgr} from "../../../../modules/user/UserManager";
//import "../../../../modules/user/UserSlice";
//import {LogWindow} from "../LogWindow";


const s = makeStyle(style);


export function Overlay({onClick}) {
    return <div className={s("overlay")} onClick={onClick}></div>
}


export function LogWindow({close}) {

    const [toLog, setToLogin] = useState(true);

    const toggleForm = () => {
        setToLogin(!toLog);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // 在这里处理表单提交
        if(toLog){
            //提交登录请求
            userMgr().logInUser(event.target.phone.value,event.target.password.value)
                .then((value)=>{
                    if(value.state){
                        alert("登录成功");
                        global.UserSlice.userId = value.id;
                        global.UserSlice.isLogIn=true;
                    } else alert("登录失败");
                })
                .catch((reason)=>{console.log("登录请求error：" +reason)})
        }
        else if(!toLog){
            //提交注册请求
            userMgr().createUser(event.target.phone.value,event.target.password.value)
                .then((value)=>{
                    if(value.state){
                        alert("注册成功");
                        global.UserSlice.userId = value.id;
                        global.UserSlice.isLogIn=true;
                    } else alert("注册失败");
                })
                .catch((reason)=>{console.log("注册请求error：" +reason)})
        }
    };

    return <div className={s("log-window")}>
            <form onSubmit={handleSubmit}>
                <h2>{toLog ? "账号登录" : "账号注册"}</h2>
                <div className={s("forms")}>
                    <div className="form-group">
                        <label htmlFor="phone">手机号：</label>
                        <input type="tel" id="phone" name="phone" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">密码：</label>
                        <input type="password" id="password" name="password" /*required={isLogin} disabled={!isLogin}*/ />
                    </div>
                </div>
                <button type="submit">{toLog ? "登录" : "注册"}</button>
            </form>
            <div className={s("form-toggle")}>
                <span>{toLog ? "没有账号？" : "已有账号？"}</span>
                <button onClick={toggleForm}>{toLog ? "注册" : "登录"}</button>
            </div>
        </div>
}


export function Navigation(props) {

    //——————————————————————————导航——————————————————————————

    const navigate=useNavigate();
    const [query, setQuery] = useState('');

    const handleSearch= async (event) => {
        //可处理股票代码搜索或股票名搜索
        //把搜索内容传给服务器，让服务器在股票代码库和股票名称库中匹配，并返回匹配结果
        if (query) {
            /*let searchResults;*/
            try {
                const stockCode = (await stockMgr().searchStock(query)).stockCode;
                if(stockCode!=="null")
                    navigate(`/stock/${stockCode}`);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleInputChange = async (event:React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }

    //父组件传入代码与名称
    const information :StockInfo  = {
        code: props.code,
        name: props.name?props.name:"平安银行",
    }

    const SearchBox = () => <div className={s("search-box")}>
        <form onSubmit={handleSearch}>
            <button type="submit" ></button>
            <input type="text" value={query} onChange={handleInputChange} placeholder="搜索股票……" name="search"/>
        </form>
    </div>

    //——————————————————————————登录——————————————————————————

    // const [userId, setUserId] = useState(null)
    // const [isLogIn,setIsLogIn] = useState(false) //暂时在这里修改登录态
    const [showLogWindow,setShowLogWindow] = useState(false)

    const noneAvatar = require("../../../../assets/icons/user.png")

    // const [userAvatar,setUserAvatar] = useState(noneAvatar)
    // const [userName,setUserName] = useState("user")


    useEffect(()=>{
        userMgr().getUserInfo(global.UserSlice.userId)
            .then((value)=>{
                global.UserSlice.avatar=value.avatarUrl;
                global.UserSlice.name=value.name})
    },[global.UserSlice.userId])

    // const userInfo = userMgr().getUserInfo(userId)
    // const userAvatar = noneAvatar /*require("../../../../assets/test/avatar.jpg")*/
    // const userName = "股市小白"
    // const userId = "100001"

    const toUser = () => {
        navigate(`/user/${global.UserSlice.userId}`)
    }

    const logIn = () => {
        setShowLogWindow(true);
    }

    const closeLogWindow = () => {
        setShowLogWindow(false);
    }

    const LogIn = () => <div className={s("user")}>
        <div  className={s("content")}>
            <img onClick={logIn} src={noneAvatar}/>
            <div onClick={logIn} className={s("user-name")}>登录</div>
        </div>
    </div>

    const UserDisplay = () => <div className={s("user")}>
        <div  className={s("content")}>
            <img onClick={toUser} src={global.UserSlice.avatar}/>
            <div onClick={toUser} className={s("user-name")}>{global.UserSlice.name}</div>
        </div>
    </div>


    //——————————————————————————渲染——————————————————————————
    return props.page==="detail"?
            <>
                <div className={s('navigation')}>
                    <div onClick={()=>{history.back()}}>
                        <svg className={s("return")} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                             p-id="2756" width="200" height="200">
                            <path
                                d="M795.91835938 490.13457031c-49.66523437-60.0609375-111.53320313-102.77578125-179.10878907-123.73857422a439.74755859 439.74755859 0 0 0-102.54902344-19.37988281V162.25859375a30.79335937 30.79335937 0 0 0-11.46972656-27.40429688c-7.91015625-5.47910156-17.74160156-4.12382812-24.40898437 3.27832032L139.31914062 448.32324219a35.08769531 35.08769531 0 0 0-8.92792968 23.33496093c0 9.4359375 3.84257812 18.24960937 10.28320312 23.39121094l340.41972657 312.50742188a17.96748047 17.96748047 0 0 0 23.10820312 3.27832031 32.60039063 32.60039063 0 0 0 11.41347656-27.34804688v-174.3046875c128.03203125 4.63183594 213.74472656 49.77773437 273.80390625 130.0078125 28.81582031 36.66972656 49.94824219 81.36210937 61.47421875 130.29257813 2.71142578 13.78652344 12.825 23.50371094 24.40898438 23.39121094h2.48554687c12.20449219-1.29902344 21.58242187-13.73027344 21.75292969-28.75957032 1.35527344-159.33339844-33.22265625-284.65136719-103.62304688-374.26289062v0.22675781z"
                                p-id="2757"></path>
                        </svg>
                    </div>
                    <div className={s("title")}>
                        <div className={s("name")}>详情——{information.name}</div>
                        <div className={s("id")}>股票代码：{information.code}</div>
                    </div>
                    <SearchBox/>
                    {global.UserSlice.isLogIn?<UserDisplay/>:<LogIn/>}
                </div>
                {showLogWindow && (
                    <>
                        <Overlay onClick={closeLogWindow} />
                        <LogWindow close={closeLogWindow} /*setUserId={setUserId} setIsLogIn={setIsLogIn}*//>
                    </>
                )}
            </>
        : props.page==="user"?
            <>
                <div className={s('navigation')}>
                    <div onClick={()=>{history.back()}}>
                        <svg className={s("return")} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                             p-id="2756" width="200" height="200">
                            <path
                                d="M795.91835938 490.13457031c-49.66523437-60.0609375-111.53320313-102.77578125-179.10878907-123.73857422a439.74755859 439.74755859 0 0 0-102.54902344-19.37988281V162.25859375a30.79335937 30.79335937 0 0 0-11.46972656-27.40429688c-7.91015625-5.47910156-17.74160156-4.12382812-24.40898437 3.27832032L139.31914062 448.32324219a35.08769531 35.08769531 0 0 0-8.92792968 23.33496093c0 9.4359375 3.84257812 18.24960937 10.28320312 23.39121094l340.41972657 312.50742188a17.96748047 17.96748047 0 0 0 23.10820312 3.27832031 32.60039063 32.60039063 0 0 0 11.41347656-27.34804688v-174.3046875c128.03203125 4.63183594 213.74472656 49.77773437 273.80390625 130.0078125 28.81582031 36.66972656 49.94824219 81.36210937 61.47421875 130.29257813 2.71142578 13.78652344 12.825 23.50371094 24.40898438 23.39121094h2.48554687c12.20449219-1.29902344 21.58242187-13.73027344 21.75292969-28.75957032 1.35527344-159.33339844-33.22265625-284.65136719-103.62304688-374.26289062v0.22675781z"
                                p-id="2757"></path>
                        </svg>
                    </div>
                    <div className={s("title")}>
                        <div className={s("name")}>我的主页</div>
                    </div>
                    <SearchBox/>
                    {global.UserSlice.isLogIn?<UserDisplay/>:<LogIn/>}
                </div>
                {showLogWindow && (
                    <>
                        <Overlay onClick={closeLogWindow} />
                        <LogWindow close={closeLogWindow} /*setUserId={setUserId} setIsLogIn={setIsLogIn}*//>
                    </>
                )}
            </>
        :
            <>
                <div className={s('navigation')}>
                    <div>
                        <svg className={s("home-icon")} viewBox="0 0 1024 1024" version="1.1"
                             xmlns="http://www.w3.org/2000/svg" p-id="2574" width="200" height="200">
                            <path
                                d="M947.2 422.4L572.8 115.2c-32-25.6-86.4-25.6-118.4 0L76.8 425.6c-12.8 6.4-16 22.4-9.6 35.2 3.2 12.8 16 19.2 28.8 19.2h32v364.8C128 892.8 163.2 928 211.2 928H416c19.2 0 32-12.8 32-32v-147.2c0-22.4 35.2-44.8 64-44.8 28.8 0 67.2 22.4 67.2 44.8V896c0 19.2 12.8 32 32 32h208c48 0 80-32 80-83.2V480h32c12.8 0 25.6-9.6 28.8-22.4 3.2-12.8 0-25.6-12.8-35.2z"
                                fill="#2c2c2c" p-id="2575"></path>
                        </svg>
                    </div>
                    <div className={s("title")}>
                        <div className={s("name")}>主页</div>
                    </div>
                    <SearchBox/>
                    {global.UserSlice.isLogIn?<UserDisplay/>:<LogIn/>}
                </div>
                {showLogWindow && (
                    <>
                        <Overlay onClick={closeLogWindow} />
                        <LogWindow close={closeLogWindow} /*setUserId={setUserId} setIsLogIn={setIsLogIn}*//>
                    </>
                )}
            </>
}
