import React, {Component} from "react"
import "./PanelExampleTwoTwo.css"
import {Panel} from "@vkontakte/vkui"
import PanelHeaderReturn from "../PanelHeaderReturn/PanelHeaderReturn"

export default class PanelExampleTwoTwo extends Component {

	render() {
		return <Panel id={this.props.id}>
			<PanelHeaderReturn>Panel 2 in View 2</PanelHeaderReturn>
			<div style={{textAlign: 'center', paddingTop: 10}}>
				Hello
			</div>
		</Panel>
	}
}
