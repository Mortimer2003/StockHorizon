import style from "./index.module.css";
import {makeStyle} from "../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect, useMemo, useContext} from "react";

import {Types} from "aptos";
import {Navigation, Overlay} from "../../components/Navigation";
import {useParams} from "react-router-dom";
import {userMgr} from "../../../../modules/user/UserManager";
import {stockMgr} from "../../../../modules/stock/StockManager";
import {Collect} from "../../../../modules/stock/StockSlice";
import {defaultUserSlice, UserContext} from "../../../root";
import axios from "axios";

const s = makeStyle(style);

export function Collected({id,list}:{id:string,list:Collect[]}) {

    if(list==null) list = [{stockCode : "", name : "", strategy : null, degree : null}]

    const stockCode = list?.map(obj => obj.stockCode);

    function RTP({index}) {
        const [stockRTP,setStockRTP] = useState({
            price: "",
            abChange: "",
            reChange: "",
        })
        const [color,setColor] = useState("")

        useEffect(()=>{

            //TODO:优化为一组股票发起一个RTP请求
            function makeRequest() {

                list && stockCode[index] && stockMgr().getRTP({stockCode:stockCode[index]}).then((value) => {
                    console.log("get RTP return: " + value)
                    setStockRTP(value);
                    Number(value.abChange)==0?setColor("")
                        :Number(value.abChange)>0?setColor("red"):setColor("green")
                }).catch((reason) => {
                    console.log("get RTP error: " + reason)
                });

            }

            makeRequest();
            const timer = setInterval(makeRequest, 60 * 1000);
            return () => {
                clearInterval(timer);
            };
        },[])

        return <>
            {stockRTP?.price ?
                <div className={s("price", color)}>{stockRTP.price}</div>
                :
                <div>{list[index].name ? "加载中..." : "-"}</div>
            }
            <div className={s(color)}>
                {stockRTP?.abChange && stockRTP?.reChange?
                    <>
                        <div>{stockRTP.abChange}</div>
                        <div>{stockRTP?.reChange}</div>
                    </>
                    :
                    <div>{list[index].name ? "加载中..." : "-"}</div>
                }
            </div>
        </>
    }


    return <>
        <div className={s("title")}>
            <div>名称</div>
            <div>当前价</div>
            <div>涨跌幅度</div>
            <div>推荐策略</div>
            <div>推荐度</div>
        </div>
        <div className={s("line")}></div>
        <div>
            <div>{list?.map(({name,stockCode,strategy,degree},index)=>
                <>
                    {index!==0 && <div className={s("line2")}></div>}
                    <div className={s("item")}>
                        <div>
                            {name?<div className={s("name")}>{name}</div>:<div>-</div>}
                            <div className={s("code")}>{stockCode}</div>
                        </div>
                        <RTP index={index}/>
                        {degree?<div className={s("strategy")}>{strategy==0?"推荐减仓":"推荐加仓"}</div>:<div>-</div>}
                        {degree?<div className={s("degree")}>{degree}</div>:<div>-</div>}
                    </div>
                </>
            )}</div>
        </div>
    </>
}

export function User(props) {

    const {userSlice, setUserSlice}=useContext(UserContext)
    const [isLogin, setIsLogin] = useState(userSlice.isLogIn)
    const address = useParams<{ address: string }>().address;

    const [pageIdx, setPageIdx] = useState(0);

    const noneList:Collect[]=[{
        stockCode : "",
        name : "",
        strategy : null,
        degree : null,
    }]

    const [collectList, setCollectList] = useState<{collectList:Collect[]}>({collectList:noneList});

    const {id} = useParams<{ id: string }>() // 目标Address

    const menuNames=["我的收藏"]

    const handleMenuClick = (index, name) => setPageIdx(index);

    const [selectedFile, setSelectedFile] = useState(null);

    const [showEditWindow,setShowEditWindow] = useState(false)

    const closeEditWindow = () => {
        setShowEditWindow(false);
    }

    const handleEdit = () => {
        setShowEditWindow(true);
    };



    function EditWindow({close}) {
        const id=userSlice.userId;

        const [avatar, setAvatar] = useState();
        const [previewURL, setPreviewURL] = useState(userSlice.avatar?userSlice.avatar:defaultUserSlice.avatar);
        const [name, setName] = useState(userSlice.name);

        const handleAvatarChange = (event) => {
            const file = event.target.files[0];
            setAvatar(file);

            // 使用FileReader读取图片文件并生成预览URL
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewURL(reader.result);
            };
            reader.readAsDataURL(file);
            // TODO:防止保存后图片url消失
        };

        const handleNameChange = (event) => {
            const value = event.target.value;
            setName(value);
        };

        const handleSubmit = (event) => {
            event.preventDefault();
            // 在这里处理提交逻辑，例如上传头像和保存昵称到后端
            const formData = new FormData();
            formData.append('id', id);
            formData.append('avatar', avatar);
            formData.append('name', name);

            // 发送 POST 请求
            userMgr().editUserInfo(formData)
                .then(value => {
                    // 请求成功处理逻辑
                    // value.state: 0失败 1仅头像更新 2仅昵称更新 3头像与昵称都更新
                    const currentUserSlice = userSlice;
                    switch (value.state){
                        case 0: alert("修改失败！");
                            break;
                        case 1: currentUserSlice.avatar=value.avatarUrl;
                            setUserSlice({...currentUserSlice});
                            alert("修改成功！");
                            break;
                        case 2: currentUserSlice.name=value.name;
                            setUserSlice({...currentUserSlice});
                            alert("修改成功！");
                            break;
                        case 3: currentUserSlice.avatar=value.avatarUrl;
                            currentUserSlice.name=value.name;
                            setUserSlice({...currentUserSlice});
                            alert("修改成功！");
                            break;
                    }
                    console.log(userSlice)
                    close();

                    // 清空表单
                    setAvatar(null);
                    setPreviewURL(userSlice.avatar);
                    setName(userSlice.name);
                })
                .catch(error => {
                    // 请求失败处理逻辑
                    console.log("修改信息失败："+error);

                });
        };


        return <div className={s("edit-window")}>
            <form onSubmit={handleSubmit}>
                <h2>修改信息</h2>
                <div className={s("forms")}>
                    <div className={s("form-group1")}>
                        <label className={s("left")} htmlFor="avatar">新头像：</label>
                        <div className={s("right")}>
                            <div className={s("avatar")}><img src={previewURL} alt="Avatar Preview" /></div>
                            <input type="file" id="avatar" name="avatar" onChange={handleAvatarChange} accept="image/*"/>
                        </div>
                    </div>
                    <div className={s("form-group2")}>
                        <label className={s("left")} htmlFor="name">新昵称：</label>
                        <div className={s("right")}>
                            <input type="text" id="name" name="name" placeholder={userSlice.name?userSlice.name:defaultUserSlice.name} onChange={handleNameChange}/>
                        </div>
                    </div>
                </div>
                <button type="submit">保存</button>
            </form>
        </div>
    }

    useEffect(()=>{

        stockMgr().getCollect({id:address}).then((value) => {
            console.log("getCollect return: " + value)
            // @ts-ignore
            setCollectList(value);
        }).catch((reason) => {
            console.log("getCollect error: " + reason)
        });

    },[pageIdx])

    useEffect(()=>{
        if(!userSlice.isLogIn)
        {
            setIsLogin(false)
            alert("请先登录！");
        }
        else {
            setIsLogin(true);
        }
    },[userSlice.isLogIn])

    return <div className={s('user')}>
            <Navigation page={"user"} setUserSlice={setUserSlice}/>
            <div className={s('content')}>
                <div className={s("avatar")}>
                    <img src={isLogin&&userSlice.avatar?userSlice.avatar:defaultUserSlice.avatar}/>
                </div>
                <div className={s("name")}><span id={"user-name"}>{userSlice.isLogIn?userSlice.name:defaultUserSlice.name}</span></div>

                {isLogin && <>

                    <div className={s("edit")} onClick={handleEdit}>编辑信息</div>

                    <div className={s("collected")}>
                        <Collected id={id} list={collectList.collectList}/>
                    </div>

                    {showEditWindow && (
                        <>
                            <Overlay onClick={closeEditWindow}/>
                            <EditWindow close={closeEditWindow}/>
                        </>
                    )}
                </>
                }
            </div>
        </div>
}
