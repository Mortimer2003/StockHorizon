import style from "./index.module.css";
import {makeStyle} from "../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect, useMemo} from "react";

import {Types} from "aptos";
import {Navigation} from "../../components/Navigation";
import {useParams} from "react-router-dom";
import {userMgr} from "../../../../modules/user/UserManager";
//import  "../../../../modules/user/UserSlice";

const s = makeStyle(style);

//TODO: 调用EditUserInfo接口，添加编辑用户信息功能


export function Own({id}) {
    return <></>
}

export function Collected({id}) {
    return <></>
}


export function User() {


    const {id} = useParams<{ id: string }>() // 目标Address

    const [pageIdx, setPageIdx] = useState(0);

    const menuNames=["持有","收藏"]
    const page = useMemo(() => {
        switch (pageIdx) {
            case 0: return <Own id={id}/>
            case 1: return <Collected id={id}/>
        }
    }, [pageIdx]);

    const handleMenuClick = (index, name) => setPageIdx(index);

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        const formData = new FormData();
        formData.append('image', event.target.files[0]);
        userMgr().editUserInfo({id: global.UserSlice.userId, avatar: formData})
            .then((value)=>{
                value.state?alert("编辑成功"):alert("编辑失败")
            })
            .catch((reason)=>{
                console.log("头像更新错误："+reason)
            });
        global.UserSlice.avatar=URL.createObjectURL(event.target.files[0]);

    };

    const changeAvatar = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.addEventListener('change', handleFileChange);
        fileInput.click();
    }

    const changeName = (event) => {
        //TODO:补充昵称提交
        event.preventDefault();

        const ele = document.getElementById('user-name');
        ele.contentEditable = 'true';
        ele.focus();


        // 添加keydown事件监听器
        ele.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                // 按下了回车键，退出编辑状态
                ele.contentEditable = 'false';
                // 执行保存操作
                if(global.UserSlice.name!==ele.textContent)
                {
                    global.UserSlice.name=ele.textContent;
                    userMgr().editUserInfo({id: global.UserSlice.userId, name: global.UserSlice.name})
                        .then((value)=>{
                            value.state?alert("编辑成功"):alert("编辑失败")
                        })
                        .catch((reason)=>{
                            console.log("昵称更新错误："+reason)
                        });
                }
            }
        });
    }


    return <div className={s('user')}>
        <Navigation page={"user"}/>
        <div className={s('content')}>
            <div className={s("avatar")}>
                <img onDoubleClick={changeAvatar} src={global.UserSlice.avatar /*|| require("../../../../assets/test/avatar.jpg")*/}/>
            </div>
            <div className={s("name")}><span onDoubleClick={changeName} id={"user-name"}>{global.UserSlice.name}</span></div>


            <div className={s("menu")}>
                {menuNames.map((name, index) => (
                    <div key={index}
                         onClick={() => handleMenuClick(index, name)}
                         className={s(`item${index+1}`, pageIdx == index && "current", 'option')}>
                        {name}
                    </div>
                ))}
            </div>
            <div> {page} </div>
        </div>
    </div>
}
