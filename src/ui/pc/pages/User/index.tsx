import style from "./index.module.css";
import {makeStyle} from "../../../../utils/CSSUtils";

import React, {useState, useRef, useEffect, useMemo} from "react";

import {Types} from "aptos";
import {Navigation} from "../../components/Navigation";
import {useParams} from "react-router-dom";
import {userMgr} from "../../../../modules/user/UserManager";
import {stockMgr} from "../../../../modules/stock/StockManager";
import {Collect} from "../../../../modules/stock/StockSlice";
//import  "../../../../modules/user/UserSlice";

const s = makeStyle(style);

export function Collected({id,list}:{id:string,list:Collect[]}) {

    if(list==null) list = [{stockCode : "", name : "", strategy : null, degree : null,}]


    const stockCode = list?.map(obj => obj.stockCode);

    // const name = list.map(obj => obj.name);
    // const strategy = list.map(obj => obj.strategy);
    // const degree = list.map(obj => obj.degree);

    function RTP({index}) {
        const [stockRTP,setStockRTP] = useState({
            price: "",
            abChange: "",
            reChange: "",
        })
        const [color,setColor] = useState("")

        useEffect(()=>{

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
            <div className={s("price",color)}>{stockRTP?.price}</div>
            <div className={s(color)}>
                <div>{stockRTP?.abChange}</div>
                <div>{stockRTP?.reChange}</div>
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
                                <div className={s("name")}>{name}</div>
                                <div className={s("code")}>{stockCode}</div>
                            </div>
                            <RTP index={index}/>
                            {degree&&<div className={s("strategy")}>{strategy==0?"推荐减仓":"推荐加仓"}</div>}
                            {degree&&<div className={s("degree")}>{degree}</div>}
                        </div>
                    </>
                )}</div>
            </div>
    </>
}

export function User(props) {
    const address = useParams<{ address: string }>().address;

    const [pageIdx, setPageIdx] = useState(0);

    const [collectList, setCollectList] = useState<{collectList:Collect[],holdList:Collect[]}>({
        collectList:[{
            stockCode : "",
            name : "",
            strategy : null,
            degree : null,
        }],
        holdList:[{
            stockCode : "",
            name : "",
            strategy : null,
            degree : null,
        }],
    });

    const {id} = useParams<{ id: string }>() // 目标Address



    const menuNames=["持有","收藏"]

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

    useEffect(()=>{

        stockMgr().getCollect({id:address}).then((value) => {
            console.log("getCollect return: " + value)
            // @ts-ignore
            setCollectList(value);
        }).catch((reason) => {
            console.log("getCollect error: " + reason)
        });

    },[pageIdx])

    return <div className={s('user')}>
        <Navigation page={"user"}/>
        <div className={s('content')}>
            <div className={s("avatar")}>
                <img onDoubleClick={changeAvatar} src={global.UserSlice.avatar?global.UserSlice.avatar:require("../../../../assets/icons/user.png")}/>
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
            <div className={s("collected")}>
                 <Collected id={id} list={pageIdx==0?collectList.holdList:collectList.collectList}/>
            </div>
        </div>
    </div>
}
