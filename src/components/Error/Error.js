import React, {Component} from "react"
import {nToBr} from "../../tools/helpers"
import "./Error.css"
import L from "../../lang/L"
import {FixedLayout, Button, Link} from "@vkontakte/vkui"
import BottomPopup from "../BottomPopup/BottomPopup"

export default class Error extends Component {

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
			text += e.message || ''
			text += "\n"
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
		let href = window.location.href
			.replace(/sid=([A-z0-9]+)/, '[cut]')
			.replace(/access_token=([A-z0-9]+)/, '[cut]')
			.replace(/sign=([A-z0-9]+)/, '[cut]')
		text = href + "\n\n" + text
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

	render() {
		let {details} = this.state
		return <div className="Error">
				<div className="Error__body">
					<div className="Error__sad">
					</div>
					<div className="Error__title">
						{!this.isNetwork() ? nToBr(L.t('oops')) : L.t('network')}
					</div>
				</div>
			{!details && !this.isNetwork() ? <FixedLayout vertical="bottom">
				<div className="Error__bottom">
					<div className="Error__to-details">
						<Button stretched={true} size="l" level="secondary" onClick={() => this.toggleDetails()}>
							{L.t('error_details')}
						</Button>
					</div>
					{this.props.onClose ? <div className="Error__close">
						<Link onClick={() => this.props.onClose()}>{L.t('close')}</Link>
					</div> : null}
				</div>
			</FixedLayout> : null}
			{details && !this.isNetwork() ?
			<BottomPopup onClick={() => this.toggleDetails()} showCross={true} onClose={() => this.toggleDetails()}>
				<div className="Error__details">
					<div className="Error__details-header">
						{this.getErrorHeader()}
					</div>
					<div className="Error__details-text">
						{this.getTextErrorDetails()}
					</div>
				</div>
			</BottomPopup> : null}
		</div>
	}
}
