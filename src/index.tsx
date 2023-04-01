import React from 'react';
import ReactDOM from 'react-dom/client';

import "antd/dist/antd.css";
import { Provider } from "react-redux";
//import {Store} from "./modules/redux/StoreConfig";
import {Root} from "./ui/root";
//import {RainbowKit} from "./modules/web3/ui/RainbowKit";

const App = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

App.render(
	// <Provider store={Store}>
		<Root/>
	// </Provider>
)


