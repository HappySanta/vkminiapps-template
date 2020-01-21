import React, {Component} from "react"
import {connect} from "react-redux"
import {removeFatalError} from "../../modules/FatalErrorModule"
import ErrorDesktop from "../../components/ErrorDesktop/ErrorDesktop"
import {Route} from "../../routing/Route"
import {PAGE_ENTITY, PAGE_MAIN, MODAL_MAIN} from "../../routing/routes"
import {popPage, pushModal, pushPage} from "../../routing/methods"
import {Button} from "@happysanta/vk-app-ui"
import PopupDesktop from "../../components/PopupDesktop/PopupDesktop"
import '@happysanta/vk-app-ui/dist/vkappui.css'

export const CONTENT_WIDTH = 660
export const DEFAULT_SCROLL_SPEED = 1500

class DesktopContainer extends Component {

	goBack() {
		popPage()
	}

	renderPopup(route) {
		switch (route.getActiveModal()) {
			case MODAL_MAIN:
				return <PopupDesktop showCross={true} onClick={() => this.goBack()} onClose={() => this.goBack()}>
					<div style={{background: '#FFF', minHeight: 200, padding: 16}}>
						Попап
					</div>
				</PopupDesktop>
			default:
				return null
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
						<Button onClick={() => pushModal(MODAL_MAIN)}>
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
			return <ErrorDesktop error={fatal} onClose={() => this.props.removeFatalError()}/>
		}
		let route = Route.fromLocation(location.pathname, location.state, location.search)
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
