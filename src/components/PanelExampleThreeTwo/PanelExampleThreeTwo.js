import React, {Component} from "react"
import "./PanelExampleThreeTwo.css"
import {Panel} from "@vkontakte/vkui"
import PanelHeaderReturn from "../PanelHeaderReturn/PanelHeaderReturn"

export default class PanelExampleThreeTwo extends Component {

	render() {
		return <Panel id={this.props.id}>
			<PanelHeaderReturn>Panel 2 in View 3</PanelHeaderReturn>
			<div style={{textAlign: 'center', paddingTop: 10}}>
				Hello
			</div>
		</Panel>
	}
}
