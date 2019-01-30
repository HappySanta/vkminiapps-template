import React, {Component} from "react"
import {Spinner as VkSpinner} from '@vkontakte/vkui'
import "./ScreenSpinner.css"

export default class ScreenSpinner extends Component {

	render() {
		let {h} = this.props
		let style = {}
		if (this.props.h) {
			style.minHeight = h
		}
		return <div className="ScreenSpinner" style={style}>
			<div className="ScreenSpinner__inner">
				<VkSpinner size="large"/>
			</div>
		</div>
	}
}
