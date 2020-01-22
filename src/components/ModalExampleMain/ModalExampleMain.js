import React, {Component} from "react"
import {connect} from "react-redux"
import "./ModalExampleMain.css"
import {ModalPage} from "@vkontakte/vkui"
import {withRouter} from "react-router-dom"
import {Route} from "../../routing/Route"

class ModalExampleMain extends Component {

	render() {
		const {location} = this.props
		const route = Route.fromLocation(location.pathname, location.state, location.search)
		return <ModalPage id={this.props.id}
						  header={null}
						  onClose={() => this.props.onClose()}>
			<div style={{background: '#FFF', minHeight: 200, padding: 16, borderRadius: '14px 14px 0 0'}}>
				Модалка entityId: {route.params.entityId}
			</div>
		</ModalPage>
	}
}

function map() {
	return {}
}

export default withRouter(connect(map, {})(ModalExampleMain))
