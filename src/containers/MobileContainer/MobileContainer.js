import React, {Component} from "react"
import {connect} from "react-redux"
import {removeFatalError} from "../../modules/FatalErrorModule"
import L from "../../lang/L"
import ErrorMobile from "../../components/ErrorMobile/ErrorMobile"
import Icon24Back from "@vkontakte/icons/dist/24/back"
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back"
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel'
import {Root, View, Panel, PanelHeader, HeaderButton, platform, IOS, Button, Group} from "@vkontakte/vkui"
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import PanelHeaderClose from '@vkontakte/vkui/dist/components/PanelHeaderClose/PanelHeaderClose';
import {Route} from "../../routing/Route"
import {
	PAGE_ENTITY, PAGE_POPUP, PANEL_ENTITY, PANEL_MAIN, VIEW_MAIN,
	VIEW_2, PANEL_2_1, PAGE_2_1, PANEL_2_2, PAGE_2_2,
	VIEW_3, PANEL_3_1, PAGE_3_1, PANEL_3_2, PAGE_3_2
} from "../../routing/routes"
import BottomPopup from "../../components/BottomPopup/BottomPopup"
import {popPage, pushPage} from "../../index"
import {isDevEnv, isDeviceSupported} from "../../tools/helpers"
import Div from "@vkontakte/vkui/dist/components/Div/Div"
import CellButton from "@vkontakte/vkui/dist/components/CellButton/CellButton"
import "@vkontakte/vkui/dist/vkui.css"

const osName = platform()

class MobileContainer extends Component {

	static deviceWidth = 0
	static deviceHeight = 0

	androidRecheckWidthBlocked = false

	state = {
		headerHeight: 0,
		loadedDimensionsChecked: false,
	}

	needRecheckDimensions() {
		return MobileContainer.deviceWidth < 10 ||
			!this.state.headerHeight
			|| (this.state.headerHeight === 44 && osName === IOS && !isDevEnv())
	}

	constructor(props) {
		super(props)

		if (MobileContainer.deviceWidth === 0) {
			MobileContainer.deviceWidth = window.innerWidth
		}

		if (MobileContainer.deviceHeight === 0 && window.innerHeight) {
			MobileContainer.deviceHeight = window.innerHeight
		}
		this.recheckDimensions()

		if ('onorientationchange' in window) {
			window.addEventListener("orientationchange", () => {
				this.androidRecheckWidthBlocked = true
				MobileContainer.deviceHeight = window.innerWidth
				MobileContainer.deviceWidth = window.innerHeight
				this.setState({time: Date.now()})
			}, false)
		}
	}

	componentDidMount() {
		this.setHeaderHeight()
	}

	componentDidUpdate() {
		this.setHeaderHeight()
		if (osName !== IOS && this.state.loadedDimensionsChecked && window.innerHeight !== MobileContainer.deviceHeight) {
			if (this.androidRecheckWidthBlocked) {
				this.androidRecheckWidthBlocked = false
				return
			}
			this.recheckDimensions(true)
		}
	}

	setHeaderHeight() {
		let header = document.querySelector('.View__header')
		if (!header) {
			return
		}
		if (!this.state.headerHeight || (header.offsetHeight !== this.state.headerHeight)) {
			this.setState({headerHeight: header.offsetHeight})
		}
	}

	getHeaderHeight() {
		return this.state.headerHeight
	}

	recheckDimensions(force = false) {
		if (this.needRecheckDimensions() || force) {
			let onReCheck = () => {
				try {
					MobileContainer.deviceHeight = window.innerHeight
					MobileContainer.deviceWidth = document.documentElement.offsetWidth
				} catch (e) {
					MobileContainer.deviceWidth = window.innerWidth
				}
				this.setState({time: Date.now()})
				this.recheckDimensions()
			}
			if (force) {
				onReCheck()
			} else {
				setTimeout(() => onReCheck(), 100)
			}
		} else {
			this.setState({loadedDimensionsChecked: true})
		}
	}

	goBack() {
		popPage()
	}

	getViewHistory(route, viewId) {
		let {viewHistory} = this.props
		return route.isPopup() ? [] : viewHistory[viewId]
	}

	getPanelIdInView(route, viewId) {
		const viewHistory = this.props.viewHistory[viewId],
			viewPanels = this.props.viewsPanels[viewId],
			panelId = route.getPanelId();

		return ~viewHistory.indexOf(panelId) ?
			panelId :
			viewHistory.length > 0 ?
				viewHistory[viewHistory.length - 1] :
				viewPanels[0]
	}

	renderBackPanelHeader(title, noShadow = false, modal = false) {
		return <PanelHeader
			noShadow={noShadow}
			left={<HeaderButton onClick={() => this.goBack()}>
				{!modal ? (osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>) : (osName === IOS ? L.t('cancel') : <Icon24Cancel/>)}
			</HeaderButton>}>
			{title}
		</PanelHeader>
	}

	renderPopup(route) {
		if (!route.isPopup()) {
			return false
		}
		switch (route.getPopupId()) {
			case PAGE_POPUP:
				return <BottomPopup onClick={() => this.goBack()} showCross={true} onClose={() => this.goBack()}>
					<div style={{background: '#FFF', minHeight: 200, padding: 16, borderRadius: '14px 14px 0 0'}}>
						Попап entityId: {route.params.entityId}
					</div>
				</BottomPopup>
			default:
				return false
		}
	}

	renderDeviceNotSupportedScreen() {
		return <div className="not-supported" style={{
			width: MobileContainer.deviceWidth,
			height: MobileContainer.deviceHeight,
		}}>
			<div className="plak-wrapper">
				<div className="plak">
				</div>
				<div className="plak-text">
					{L.t('not_supported')}
				</div>
			</div>
		</div>
	}

	render() {
		let {fatal, location} = this.props
		if (fatal) {
			return <ErrorMobile error={this.props.fatal} onClose={() => this.props.removeFatalError()}/>
		}
		if (!isDeviceSupported()) {
			return this.renderDeviceNotSupportedScreen()
		}
		let route = Route.fromLocation(location.pathname, location.state, location.search)
		return <Root activeView={route.getViewId()}>
			<View id={VIEW_MAIN}
				  activePanel={this.getPanelIdInView(route, VIEW_MAIN)}
				  history={this.getViewHistory(route, VIEW_MAIN)}
				  popout={this.renderPopup(route)}
				  onSwipeBack={() => popPage()}>
				<Panel id={PANEL_MAIN}>
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
				<Panel id={PANEL_ENTITY}>
					{this.renderBackPanelHeader('Сущность')}
					<Group>
						<Div>
							Вы открыли карточку #{route.params.entityId}
							<br/>
							<br/>
							Значение search: {route.search}
						</Div>
					</Group>
					<Group>
						<CellButton onClick={() => pushPage(PAGE_POPUP, {entityId: 12})}>
							Открыть попап
						</CellButton>
						<CellButton onClick={() => pushPage(PAGE_3_1)}>
							Open View 3
						</CellButton>
					</Group>
				</Panel>
			</View>
			<View id={VIEW_2}
				  activePanel={this.getPanelIdInView(route, VIEW_2)}
				  history={this.getViewHistory(route, VIEW_2)}
				  popout={this.renderPopup(route)}
				  onSwipeBack={() => popPage()}>
				<Panel id={PANEL_2_1}>
					<PanelHeader left={<PanelHeaderClose onClick={() => popPage()} />}>
						Panel 1 in View 2
					</PanelHeader>
					<div style={{textAlign: 'center', paddingTop: 10}}>
						<Button onClick={() => pushPage(PAGE_2_2)}>
							Go to Panel 2 in View 2
						</Button>
					</div>
				</Panel>
				<Panel id={PANEL_2_2}>
					<PanelHeader left={<PanelHeaderBack onClick={() => popPage()} />}>
						Panel 2 in View 2
					</PanelHeader>
					<div style={{textAlign: 'center', paddingTop: 10}}>
						Hello
					</div>
				</Panel>
			</View>
			<View id={VIEW_3}
				  activePanel={this.getPanelIdInView(route, VIEW_3)}
				  history={this.getViewHistory(route, VIEW_3)}
				  popout={this.renderPopup(route)}
				  onSwipeBack={() => popPage()}>
				<Panel id={PANEL_3_1}>
					<PanelHeader left={<PanelHeaderClose onClick={() => popPage()} />}>
						Panel 1 in View 3
					</PanelHeader>
					<div style={{textAlign: 'center', paddingTop: 10}}>
						<Button onClick={() => pushPage(PAGE_3_2)}>
							Go to Panel 2 in View 3
						</Button>
					</div>
				</Panel>
				<Panel id={PANEL_3_2}>
					<PanelHeader left={<PanelHeaderBack onClick={() => popPage()} />}>
						Panel 2 in View 3
					</PanelHeader>
					<div style={{textAlign: 'center', paddingTop: 10}}>
						Hello
					</div>
				</Panel>
			</View>
		</Root>
	}
}

function mapStateToProps(state) {
	return {
		fatal: state.FatalErrorModule,
		viewHistory: state.LocationModule.viewHistory,
		viewsPanels: state.LocationModule.viewsPanels,
	}
}

export default connect(mapStateToProps, {
	removeFatalError,
	popPage,
	pushPage,
})(MobileContainer)
