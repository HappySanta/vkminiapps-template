import React, {Component} from "react"
import {connect} from "react-redux"
import {getOnErrorClose, removeFatalError} from "../../modules/FatalErrorModule"
import FatalErrorDesktop from "../../components/FatalErrorDesktop/FatalErrorDesktop"
import {Route} from "../../routing/Route"
import {PAGE_ENTITY, PAGE_MAIN, MODAL_MAIN} from "../../routing/routes"
import {popPage, pushModal, pushPage} from "../../routing/methods"
import {Button,PageRoot} from "@happysanta/vk-app-ui"
import PopupDesktop from "../../components/PopupDesktop/PopupDesktop"
import '@happysanta/vk-app-ui/dist/vkappui.css'

export const CONTENT_WIDTH = 660
export const DEFAULT_SCROLL_SPEED = 1500

class DesktopContainer extends Component {

	render() {
		let {fatal, location} = this.props
		if (fatal) {
			return <FatalErrorDesktop error={fatal} onClose={getOnErrorClose(fatal, () => this.props.removeFatalError())}/>
		}
		let route = Route.fromLocation(location.pathname, location.state, location.search)
		return <PageRoot popup={<PageRoot activePage={route.getActiveModal()}>
			<PopupDesktop showCross={true} id={MODAL_MAIN} onClick={popPage} onClose={popPage}>
				<div style={{background: '#FFF', minHeight: 200, padding: 16}}>
					Попап
				</div>
			</PopupDesktop>
		</PageRoot>} activePage={route.getPageId()}>
			<div id={PAGE_MAIN}>
				Главная страница
				<div style={{textAlign: 'center', paddingTop: 10}}>
					<Button onClick={() => pushPage(PAGE_ENTITY, {entityId: 0})}>
						На страницу сущности
					</Button>
				</div>
			</div>
			<div id={PAGE_ENTITY}>
				Сущность
				<div style={{textAlign: 'center', paddingTop: 10}}>
					<Button onClick={() => pushModal(MODAL_MAIN)}>
						Открыть попап
					</Button>
				</div>
			</div>
		</PageRoot>
	}
}


function mapStateToProps(state) {
	return {
		fatal: state.FatalErrorModule,
	}
}

export default connect(mapStateToProps, {removeFatalError})(DesktopContainer)
