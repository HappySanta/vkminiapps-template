import React from "react"
import ResizeableComponent from "../../containers/DesktopContainer/ResizeableComponent"
import {nToBr} from "../../tools/helpers"
import "./ErrorDesktop.css"
import L from "../../lang/L"
import {Button, Link} from "@happysanta/vk-app-ui"
import VkSdk from "@happysanta/vk-apps-sdk"
import PopupDesktop from "../PopupDesktop/PopupDesktop"
import {DEFAULT_SCROLL_SPEED} from "../../containers/DesktopContainer/DesktopContainer"

export default class ErrorDesktop extends ResizeableComponent {

	state = {
		details: false,
	}

	componentDidMount() {
		super.componentDidMount()
		VkSdk.scroll(0, DEFAULT_SCROLL_SPEED).then().catch()
	}

	toggleDetails() {
		this.setState({details: !this.state.details})
	}

	getTextErrorDetails() {
		let text = ''
		let e = this.props.error || {}
		if (e.message) {
			if (e.message instanceof Object) {
				text = JSON.stringify(e.message, null, 2)
				text += "\n"
			} else {
				text += e.message || ''
				text += "\n"
			}
		}
		if (e.code) {
			text += e.code || ''
			text += "\n"
		}
		if (e.stack) {
			text += e.stack
			text += "\n"
		}
		if (text === '') {
			try {
				text = JSON.stringify(e, null, 2)
			} catch (e) {
				text = "Empty text and cant't json stringify"
			}
		}
		text = window.navigator.userAgent + "\n\n" + text
		text = `user_id:  ${VkSdk.getStartParams().userId} \n\n${text}`
		return nToBr(text)
	}

	isNetwork() {
		let e = this.props.error || {}
		return e.network
	}

	getErrorHeader() {
		let e = this.props.error || {}
		return e.code ? e.code : L.t('error')
	}

	onRetry() {
		let {error} = this.props
		if (error.on_retry) {
			error.on_retry()
		}
		this.props.onClose()
	}

	render() {
		let {details} = this.state
		let {error} = this.props
		return <div className="ErrorDesktop" style={{height: 500}}>
			<div className="ErrorDesktop__body">
				<div className="ErrorDesktop__sad">
				</div>
				<div className="ErrorDesktop__title">
					{!this.isNetwork() ? nToBr(L.t('oops')) : L.t('network')}
				</div>
				{!(this.isNetwork() && !this.props.onClose) ? <div className="ErrorDesktop__bottom">
					{!this.isNetwork() ? <div className="ErrorDesktop__to-details">
						<Button type="secondary" onClick={() => this.toggleDetails()}>
							{L.t('error_details')}
						</Button>
					</div> : null}
						{this.isNetwork() && this.props.onClose && error.on_retry ? <div className="ErrorDesktop__to-details">
							<Button type="secondary" onClick={() => this.onRetry()}>
								{L.t('retry')}
							</Button>
						</div> : null}
					{this.props.onClose && !error.prevent_close ? <div className="ErrorDesktop__close">
						<Link onClick={() => this.props.onClose()}>{L.t('close')}</Link>
					</div> : null}
				</div> : null}
			</div>
			{details && !this.isNetwork() ?
				<PopupDesktop onClose={() => this.toggleDetails()}
							  showCross={true}
							  header={false}
							  footerRight={null}>
					<div className="ErrorDesktop__details">
						<div className="ErrorDesktop__details-header">
							{this.getErrorHeader()}
						</div>
						<div className="ErrorDesktop__details-text">
							{this.getTextErrorDetails()}
						</div>
					</div>
				</PopupDesktop> : null}
		</div>
	}
}
