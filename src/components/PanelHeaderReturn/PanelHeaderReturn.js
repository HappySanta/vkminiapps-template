import React, {Component} from "react"
import PropTypes from "prop-types"
import "./PanelHeaderReturn.css"
import {HeaderButton, IOS, PanelHeader, platform} from "@vkontakte/vkui"
import Icon24Back from "@vkontakte/icons/dist/24/back"
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back"
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel'
import L from "../../lang/L"
import {popPage} from "../../routing/methods"

const osName = platform()

export default class PanelHeaderReturn extends Component {

	goBack() {
		popPage()
	}

	render() {
		const {modal, noShadow} = this.props
		return <PanelHeader
			noShadow={noShadow}
			left={<HeaderButton onClick={() => this.goBack()}>
				{!modal ? (osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>) : (osName === IOS ? L.t('cancel') :
					<Icon24Cancel/>)}
			</HeaderButton>}>
			{this.props.children}
		</PanelHeader>
	}
}

PanelHeaderReturn.propTypes = {
	modal: PropTypes.bool,
	noShadow: PropTypes.bool,
}
