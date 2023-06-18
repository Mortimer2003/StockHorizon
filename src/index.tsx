import React,{Component,createContext} from 'react'
import ReactDOM from 'react-dom/client';

import "antd/dist/antd.css";
import { Provider } from "react-redux";
import {Root} from "./ui/root";

const App = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);


App.render(
	<Root/>
)

/*
export const UserContext = React.createContext(null)
const [userSlice, setUserSlice] = useState(defaultUserSlice);

App.render(
	<UserContext.Provider value={{userSlice, setUserSlice}}>
		<Root/>
	</UserContext.Provider>
)
*/
