import React, {Component} from "react"
import {Spinner as VkSpinner} from '@vkontakte/vkui'
import "./ScreenSpinner.css"

export default class ScreenSpinner extends Component {

	render() {
		let {height, desktop} = this.props
		let style = {}
		if (height) {
			style.minHeight = height
		} else if (!desktop) {
			style.minHeight = '100vh'
		}
		if (desktop) {
			style.background = '#FFF'
		}
		return <div className="ScreenSpinner" style={style}>
			<div className="ScreenSpinner__inner">
				<VkSpinner size="large"/>
			</div>
		</div>
	}
}
