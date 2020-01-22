import React, {Component} from "react"
import {nToBr} from "../../tools/helpers"
import "./FatalErrorMobile.css"
import L from "../../lang/L"
import {FixedLayout, Button, Link, Root, View, Panel, ModalRoot} from "@vkontakte/vkui"
import {
	MODAL_FATAL_ERROR,
	PANEL_FATAL_ERROR,
	ROOT_FATAL_ERROR,
	VIEW_FATAL_ERROR
} from "../../routing/routes"
import ModalFatalError from "../ModalFatalError/ModalFatalError"
import {isNetwork, onRetry} from "../../modules/FatalErrorModule"

export default class FatalErrorMobile extends Component {

	state = {
		details: false,
	}

	toggleDetails() {
		this.setState({details: !this.state.details})
	}

	renderModal() {
		const {noDetails, error} = this.props
		const {details} = this.state
		const activeModal = details && !isNetwork(error) && !noDetails ? MODAL_FATAL_ERROR : null
		return <ModalRoot activeModal={activeModal}>
			<ModalFatalError error={error} id={MODAL_FATAL_ERROR} onClose={() => this.toggleDetails()}/>
		</ModalRoot>
	}

	render() {
		let {details} = this.state
		let {noDetails, error, onClose} = this.props
		return <Root id={ROOT_FATAL_ERROR} activeView={VIEW_FATAL_ERROR}>
			<View id={VIEW_FATAL_ERROR} modal={this.renderModal()} activePanel={PANEL_FATAL_ERROR}>
				<Panel id={PANEL_FATAL_ERROR}>
					<div className="FatalErrorMobile">
						<div className="FatalErrorMobile__body">
							{!isNetwork(error) ? <div className="FatalErrorMobile__sad">
							</div> : null}
							<div className="FatalErrorMobile__title">
								{!isNetwork(error) ? nToBr(L.t('oops')) : L.t('network')}
							</div>
						</div>
						{!details && !(isNetwork(error) && !onClose) && !noDetails ? <FixedLayout vertical="bottom">
							<div className="FatalErrorMobile__bottom">
								{!isNetwork(error) ? <div className="FatalErrorMobile__to-details">
									<Button stretched={true} size="l" level="secondary" onClick={() => this.toggleDetails()}>
										{L.t('error_details')}
									</Button>
								</div> : null}
								{isNetwork(error) && onClose && error.on_retry ? <div className="FatalErrorMobile__to-details">
									<Button stretched={true} size="l" level="secondary" onClick={() => onRetry(error, onClose)}>
										{L.t('retry')}
									</Button>
								</div> : null}
								{onClose && !error.prevent_close ? <div className="FatalErrorMobile__close">
									<Link onClick={() => onClose()}>{L.t('close')}</Link>
								</div> : null}
							</div>
						</FixedLayout> : null}
					</div>
				</Panel>
			</View>
		</Root>
	}
}
