import React, {Component} from "react"
import {Spinner as VkSpinner} from '@vkontakte/vkui'
import "./ScreenSpinner.css"

export default class ScreenSpinner extends Component {

	render() {
		const {minHeight, desktop, background, withHeader} = this.props
		const style = {}
		if (minHeight) {
			style.minHeight = minHeight
		} else if (!desktop && !withHeader) {
			style.minHeight = '100vh'
		}
		if (background) {
			style.background = background
		}
		const classList = ['ScreenSpinner']
		if (withHeader) {
			classList.push('ScreenSpinner--with-header')
		}
		return <div className={classList.join(' ')} style={style}>
			<div className="ScreenSpinner__inner">
				<VkSpinner size="large"/>
			</div>
		</div>
	}
}
