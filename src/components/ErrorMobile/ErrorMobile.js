import React, {Component} from "react"
import {nToBr} from "../../tools/helpers"
import "./ErrorMobile.css"
import L from "../../lang/L"
import {FixedLayout, Button, Link} from "@vkontakte/vkui"
import BottomPopup from "../BottomPopup/BottomPopup"
import VkSdk from "@happysanta/vk-apps-sdk"

export default class ErrorMobile extends Component {

	state = {
		details: false,
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
		let {h, noDetails, error} = this.props
		let detailsStyle = {}
		if (h) {
			detailsStyle.maxHeight = 0.8 * h
		}
		return <div className="ErrorMobile">
				<div className="ErrorMobile__body">
					{!this.isNetwork() ? <div className="ErrorMobile__sad">
					</div> : null}
					<div className="ErrorMobile__title">
						{!this.isNetwork() ? nToBr(L.t('oops')) : L.t('network')}
					</div>
				</div>
			{!details && !(this.isNetwork() && !this.props.onClose) && !noDetails ? <FixedLayout vertical="bottom">
				<div className="ErrorMobile__bottom">
					{!this.isNetwork() ? <div className="ErrorMobile__to-details">
						<Button stretched={true} size="l" level="secondary" onClick={() => this.toggleDetails()}>
							{L.t('error_details')}
						</Button>
					</div> : null}
					{this.isNetwork() && this.props.onClose && error.on_retry ? <div className="ErrorMobile__to-details">
						<Button stretched={true} size="l" level="secondary" onClick={() => this.onRetry()}>
							{L.t('retry')}
						</Button>
					</div> : null}
					{this.props.onClose && !error.prevent_close ? <div className="ErrorMobile__close">
						<Link onClick={() => this.props.onClose()}>{L.t('close')}</Link>
					</div> : null}
				</div>
			</FixedLayout> : null}
			{details && !this.isNetwork() && !noDetails ?
			<BottomPopup showCross={true} onClose={() => this.toggleDetails()}>
				<div className="ErrorMobile__details">
					<div className="ErrorMobile__details-header">
						{this.getErrorHeader()}
					</div>
					<div className="ErrorMobile__details-text" style={detailsStyle}>
						{this.getTextErrorDetails()}
					</div>
				</div>
			</BottomPopup> : null}
		</div>
	}
}
