import React, {Component} from "react"
import "./PanelExampleTwoOne.css"
import {PAGE_2_2} from "../../routing/routes"
import {Button, Panel} from "@vkontakte/vkui"
import {pushPage} from "../../routing/methods"
import PanelHeaderReturn from "../PanelHeaderReturn/PanelHeaderReturn"

export default class PanelExampleTwoOne extends Component {

	render() {
		return <Panel id={this.props.id}>
			<PanelHeaderReturn modal={true}>Panel 1 in View 2</PanelHeaderReturn>
			<div style={{textAlign: 'center', paddingTop: 10}}>
				<Button onClick={() => pushPage(PAGE_2_2)}>
					Go to Panel 2 in View 2
				</Button>
			</div>
		</Panel>
	}
}
