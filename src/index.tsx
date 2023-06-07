import React,{Component,createContext} from 'react'
import ReactDOM from 'react-dom/client';

import "antd/dist/antd.css";
import { Provider } from "react-redux";
import {Root} from "./ui/root";

const App = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

export const defaultUserSlice= {
	isLogIn:false,
	userId: "",
	name: "user",
	avatar:require("./assets/icons/user.png"),
	phone: "",
}

export const UserContext = React.createContext(defaultUserSlice)

App.render(
	<UserContext.Provider value={defaultUserSlice}>
		<Root/>
	</UserContext.Provider>
)


