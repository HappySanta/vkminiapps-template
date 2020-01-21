import React, {Component} from "react"
import {connect} from "react-redux"
import "./PanelExampleEntity.css"
import {PAGE_3_1, MODAL_MAIN} from "../../routing/routes"
import {Group, Panel} from "@vkontakte/vkui"
import Div from "@vkontakte/vkui/dist/components/Div/Div"
import CellButton from "@vkontakte/vkui/dist/components/CellButton/CellButton"
import {pushModal, pushPage} from "../../routing/methods"
import {Route} from "../../routing/Route"
import {withRouter} from "react-router-dom"
import PanelHeaderReturn from "../PanelHeaderReturn/PanelHeaderReturn"

class PanelExampleEntity extends Component {

	render() {
		const {location} = this.props
		const route = Route.fromLocation(location.pathname, location.state, location.search)
		return <Panel id={this.props.id}>
			{/*{this.renderBackPanelHeader('Сущность')}*/}
			{/*<PanelHeaderBack>Сущность</PanelHeaderBack>*/}
			<PanelHeaderReturn>Сущность</PanelHeaderReturn>
			<Group>
				<Div>
					Вы открыли карточку #{route.params.entityId}
					<br/>
					<br/>
					Значение search: {route.search}
				</Div>
			</Group>
			<Group>
				<CellButton onClick={() => pushModal(MODAL_MAIN)}>
					Открыть попап
				</CellButton>
				<CellButton onClick={() => pushPage(PAGE_3_1)}>
					Open View 3
				</CellButton>
			</Group>
		</Panel>
	}
}

function map(state) {
	return {

	}
}

export default withRouter(connect(map, {})(PanelExampleEntity))
