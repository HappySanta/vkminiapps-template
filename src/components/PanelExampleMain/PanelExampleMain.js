import React, {Component} from "react"
import {connect} from "react-redux"
import "./PanelExampleMain.css"
import {PAGE_2_1, PAGE_ENTITY} from "../../routing/routes"
import {Group, Panel, PanelHeader} from "@vkontakte/vkui"
import Div from "@vkontakte/vkui/dist/components/Div/Div"
import CellButton from "@vkontakte/vkui/dist/components/CellButton/CellButton"
import {pushPage} from "../../routing/methods"

class PanelExampleMain extends Component {

	render() {
		return <Panel id={this.props.id}>
			<PanelHeader>
				Главная страница
			</PanelHeader>
			<Group>
				<Div>
					Ну приветик!
				</Div>
			</Group>
			<Group>
				<CellButton onClick={() => pushPage(PAGE_ENTITY, {entityId: 242})}>
					На страницу сущности
				</CellButton>
				<CellButton onClick={() => pushPage(PAGE_ENTITY, {entityId: 254}, "search=12")}>
					На страницу сущности + search
				</CellButton>
				<CellButton onClick={() => pushPage(PAGE_2_1)}>
					Open View 2
				</CellButton>
			</Group>
		</Panel>
	}
}

function map(state) {
	return {

	}
}

export default connect(map, {})(PanelExampleMain)
