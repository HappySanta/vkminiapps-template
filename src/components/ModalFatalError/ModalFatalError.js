import React, {Component} from "react"
import "./ModalFatalError.css"
import {ModalPage, PanelHeaderButton, ModalPageHeader, Div} from "@vkontakte/vkui"
import {getErrorHeader, getTextErrorDetails} from "../../modules/FatalErrorModule"
import Icon24Dismiss from "@vkontakte/icons/dist/24/dismiss"

export default class ModalFatalError extends Component {

	render() {
		let {error} = this.props
		return <ModalPage id={this.props.id}
						  className="ModalFatalError"
						  style={{paddingTop: 0}}
						  header={<ModalPageHeader
							  left={<Div className="ModalFatalError__header">
								  {getErrorHeader(error)}
							  </Div>}
							  right={<PanelHeaderButton onClick={() => this.props.onClose()}><Icon24Dismiss/></PanelHeaderButton>}
						  >
						  </ModalPageHeader>}
						  onClose={() => this.props.onClose()}>
			<Div className="ModalFatalError__wrapper">
				{getTextErrorDetails(error)}
			</Div>
		</ModalPage>
	}
}
