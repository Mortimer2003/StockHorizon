import React, {useEffect, useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./common.css";
import {Home} from "./pc/pages/Home";
import {User} from "./pc/pages/User";
import {Detail} from "./pc/pages/Detail";
import {None} from "./pc/pages/None";


const mobileAgents = ["Android", "iPhone", "iPad", "iPod", "Symbian"];
const userAgent = navigator.userAgent;

global.UserSlice = {
	isLogIn:false, //TODO:改为false
	userId: "",
	name:"user",
	avatar:require("../assets/icons/user.png"),
	phone:"",
}

window.onbeforeunload = function(event) {
	// 将对象转换为 JSON 字符串并存储到本地存储中
	localStorage.setItem('userData', JSON.stringify(global.UserSlice));
}

let savedData = localStorage.getItem('userData');
if (savedData) {
	global.UserSlice = JSON.parse(savedData);
}

//————————————————————————————————————————————————————————————————————————————————

global.SearchSlice = {
	code:"null",
	name:"null"
}

window.onbeforeunload = function(event) {
	// 将对象转换为 JSON 字符串并存储到本地存储中
	localStorage.setItem('searchData', JSON.stringify(global.SearchSlice));
}

savedData = localStorage.getItem('searchData');
if (savedData) {
	global.SearchSlice = JSON.parse(savedData);
}

//——————————————————————————————————————————————————————————————————————

console.error = (function() {
	let error = console.error;

	return function(exception) {
		if (
			typeof exception === "string" &&
			exception.indexOf("Each child in a list should have a unique") !== -1
		) {
			// do nothing
			return;
		}

		// Call the original console.error function with all other types of exceptions
		error.apply(console, arguments);
	};
})();

export function Root() {
	const [width, setWidth] = useState(window.innerWidth);
	const [height, setHeight] = useState(window.innerHeight);
	//const [searchResult, setSearchResult] = useState<{code:string,name:string}>(null)

	const onResize = (e: UIEvent) => {
		console.log("onResize", e, e.detail, window.innerWidth, window.innerHeight)
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
	}

	useEffect(() => window.addEventListener('resize', onResize), []);

	const ratio = width / height;
	const isMobile = ratio <= 0.75 || mobileAgents.some(ag => userAgent.includes(ag));

	return isMobile ?
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<></>}/>
			</Routes>
		</BrowserRouter>
		:
		<BrowserRouter>
			<Routes>
				<Route path='' element={<Home/>}/>
				<Route path='/home' element={<Home/>}/>
				<Route path='/none' element={<None/>}/>
				<Route path='/user/:address' element={<User/>}/>
				<Route path='/stock/:stockCode' element={<Detail/>}/>
			</Routes>

		</BrowserRouter>
}
