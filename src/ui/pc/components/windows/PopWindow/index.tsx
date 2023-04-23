import React, {useState} from "react";
import Modal from "antd/lib/modal/Modal";
import './ant-modal.css';
import {makeStyle} from "../../../../../utils/CSSUtils";
import style from "./index.module.css";
const s = makeStyle(style);

type Params = {
	// id?: string
	className?: string
	style?: React.CSSProperties
	width?: string
	isShow: boolean
	children: JSX.Element
	onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}

export function PopWindow({width, isShow, children, onCancel,
							  // id = null,
							  className = null, style = null }: Params) {
	const maskStyle = {backdropFilter: 'blur(5px)' }

	return <Modal className={s(className)}
				  width={width}
				  style={style}
				  visible={isShow}
				  getContainer={false}
				  closable={false}
				  keyboard={true}
				  mask={true}
				  maskClosable={true}
				  maskStyle={maskStyle}
				  footer={null}
				  centered={true} onCancel={onCancel}
				  forceRender={true} wrapClassName="wrap-modal">
		{/*<div id={id} style={{*/}
		{/*	width: "auto", height: "auto", background: "transparent", ...style*/}
		{/*}}>*/}
		{children}
		{/*</div>*/}
	</Modal>
}


