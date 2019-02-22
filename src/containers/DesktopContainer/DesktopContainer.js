import React, {Component} from "react"
import {connect} from "react-redux"
import {removeFatalError} from "../../modules/FatalErrorModule"
import Error from "../../components/Error/Error"
import {Route} from "../../routing/Route"
import {PAGE_ENTITY, PAGE_MAIN, PAGE_POPUP} from "../../routing/routes"
import {popPage, pushPage} from "../../index"
import {Button} from "@vkontakte/vkui"
import Popup from "../../components/Popup/Popup"

class DesktopContainer extends Component {

	goBack() {
		popPage()
	}

	renderPopupHeader() {
		return <div>
			Мой попап
		</div>
	}

	renderPopup(route) {
		if (!route.isPopup()) {
			return false
		}
		switch (route.pageId) {
			case PAGE_POPUP:
				return <Popup onClick={() => this.goBack()} header={this.renderPopupHeader()} onClose={() => this.goBack()}>
					<div style={{background: '#FFF', minHeight: 200, padding: 16, borderRadius: '14px 14px 0 0'}}>
						Попап
					</div>
				</Popup>
			default:
				return false
		}
	}

	renderPage(route) {
		switch (route.getPageId()) {
			case PAGE_MAIN:
				return <div>
					Главная страница
					<div style={{textAlign: 'center', paddingTop: 10}}>
						<Button onClick={() => pushPage(PAGE_ENTITY, {entityId: 0})}>
							На страницу сущности
						</Button>
					</div>
				</div>
			case PAGE_ENTITY:
				return <div>
					Сущность
					<div style={{textAlign: 'center', paddingTop: 10}}>
						<Button onClick={() => pushPage(PAGE_POPUP, {entityId: 0})}>
							Открыть попап
						</Button>
					</div>
				</div>
			default:
				return null
		}
	}

	render() {
		let {fatal, location} = this.props
		if (fatal) {
			return <Error error={this.props.fatal} onClose={() => this.props.removeFatalError()}/>
		}
		let route = Route.fromLocation(location.pathname, location.state)
		return <div>
			{this.renderPage(route)}
			{this.renderPopup(route)}
		</div>
	}
}


function mapStateToProps(state) {
	return {

	}
}

export default connect(mapStateToProps, {removeFatalError})(DesktopContainer)
