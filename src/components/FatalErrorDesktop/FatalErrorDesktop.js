import React from "react"
import ResizeableComponent from "../../containers/DesktopContainer/ResizeableComponent"
import {nToBr} from "../../tools/helpers"
import "./FatalErrorDesktop.css"
import L from "../../lang/L"
import {Button, Link} from "@happysanta/vk-app-ui"
import VkSdk from "@happysanta/vk-apps-sdk"
import PopupDesktop from "../PopupDesktop/PopupDesktop"
import {DEFAULT_SCROLL_SPEED} from "../../containers/DesktopContainer/DesktopContainer"
import {getErrorHeader, getTextErrorDetails, isNetwork, onRetry} from "../../modules/FatalErrorModule"

export default class FatalErrorDesktop extends ResizeableComponent {

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

	render() {
		let {details} = this.state
		let {error, onClose} = this.props
		return <div className="FatalErrorDesktop" style={{height: 500}}>
			<div className="FatalErrorDesktop__body">
				<div className="FatalErrorDesktop__sad">
				</div>
				<div className="FatalErrorDesktop__title">
					{!isNetwork(error) ? nToBr(L.t('oops')) : L.t('network')}
				</div>
				{!(isNetwork(error) && !onClose) ? <div className="FatalErrorDesktop__bottom">
					{!isNetwork(error) ? <div className="FatalErrorDesktop__to-details">
						<Button type="secondary" onClick={() => this.toggleDetails()}>
							{L.t('error_details')}
						</Button>
					</div> : null}
						{isNetwork(error) && onClose && error.on_retry ? <div className="FatalErrorDesktop__to-details">
							<Button type="secondary" onClick={() => onRetry(error, onClose)}>
								{L.t('retry')}
							</Button>
						</div> : null}
					{onClose && !error.prevent_close ? <div className="FatalErrorDesktop__close">
						<Link onClick={() => onClose()}>{L.t('close')}</Link>
					</div> : null}
				</div> : null}
			</div>
			{details && !isNetwork(error) ?
				<PopupDesktop onClose={() => this.toggleDetails()}
							  showCross={true}
							  header={false}
							  footerRight={null}>
					<div className="FatalErrorDesktop__details">
						<div className="FatalErrorDesktop__details-header">
							{getErrorHeader(error)}
						</div>
						<div className="FatalErrorDesktop__details-text">
							{getTextErrorDetails(error)}
						</div>
					</div>
				</PopupDesktop> : null}
		</div>
	}
}
