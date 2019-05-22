import React from "react"
import PropTypes from "prop-types"
import L from "../../lang/L"
import "./PopupDesktop.css"
import {CONTENT_WIDTH, DEFAULT_SCROLL_SPEED} from "../../containers/DesktopContainer/DesktopContainer"
import ResizeableComponent from "../../containers/DesktopContainer/ResizeableComponent"
import {scrollDesktopToPopupHeader} from "../../tools/helpers"
import VkSdk from "@happysanta/vk-apps-sdk"

function stopEvent(event) {
	event.stopPropagation()
}

class PopupDesktop extends ResizeableComponent {

	state = {
		lastResizedHeight: 0,
		hasPopup: false,
	}

	constructor(props) {
		super(props)
		let popup = document.querySelector('.PopupDesktop__window')
		this.initialHeight = document.body.clientHeight
		if (popup && popup.clientHeight > this.initialHeight) {
			this.initialHeight = popup.clientHeight  + 40
		}
		this.waitPopup()
	}

	waitPopup() {
		if (!this.popup) {
			this.t = setTimeout(() => {
				this.waitPopup()
			}, 100)
		} else {
			clearTimeout(this.t)
			this.setState({hasPopup: true})
		}
	}

	componentDidMount() {
		scrollDesktopToPopupHeader(DEFAULT_SCROLL_SPEED)
	}

	componentDidUpdate() {
		this.fixHeight()
	}

	fixHeight() {
		if (this.popup) {
			let height = this.popup.clientHeight + 40
			if (document.body.clientHeight < this.popup.clientHeight &&
				(height) !== this.state.lastResizedHeight) {
				VkSdk.resizeWindow(CONTENT_WIDTH, height).then().catch()
				this.setState({lastResizedHeight: height})
			}
		}
	}

	componentWillUnmount() {
		clearTimeout(this.t)
		if (this.initialHeight) {
			VkSdk.resizeWindow(CONTENT_WIDTH, this.initialHeight).then().catch()
		}
	}

	onClose = () => {
		this.props.onClose()
	}

	render() {
		let {header, showCross} = this.props
		return <div className="PopupDesktop" onClick={this.onClose}>
			<div className={"PopupDesktop__window " + (this.props.className || "" + (this.state.hasPopup ? " rendered" : ""))}
				 ref={ref => this.popup = ref}
				 onClick={stopEvent}>
				{header ?
					<div className="PopupDesktop__header">
						<div className="PopupDesktop__header-text">{header}</div>
						<div onClick={ (e) => this.onClose(e) } className="PopupDesktop__close"/>
					</div>
					: (showCross ?
						<button title={L.t('close')}
								onClick={this.onClose}
								className="PopupDesktop__close PopupDesktop__close--body"/>
						: null)}
				{this.props.children}
				{this.props.renderBottom ? <div className="PopupDesktop__bottom">
						{this.props.renderBottom}
				</div> : null}
			</div>
		</div>
	}
}

PopupDesktop.propTypes = {
	onClose: PropTypes.func
}


export default PopupDesktop
