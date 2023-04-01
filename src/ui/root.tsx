import React, {useEffect, useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./common.css";
import {Home} from "./pc/pages/Home";
import {User} from "./pc/pages/User";
import {Detail} from "./pc/pages/Detail";

const mobileAgents = ["Android", "iPhone", "iPad", "iPod", "Symbian"];
const userAgent = navigator.userAgent;

export function Root() {
	const [width, setWidth] = useState(window.innerWidth);
	const [height, setHeight] = useState(window.innerHeight);

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
				<Route path='/user/:address' element={<User/>}/>
				<Route path='/stock/:stockId' element={<Detail/>}/>
			</Routes>
		</BrowserRouter>
}
