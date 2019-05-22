import React, {Component} from "react"
import {connect} from "react-redux"
import {removeFatalError} from "../../modules/FatalErrorModule"
import L from "../../lang/L"
import ErrorMobile from "../../components/ErrorMobile/ErrorMobile"
import Icon24Back from "@vkontakte/icons/dist/24/back"
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back"
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel'
import {Root, View, Panel, PanelHeader, HeaderButton, platform, IOS, Button} from "@vkontakte/vkui"
import "@vkontakte/vkui/dist/vkui.css"
import {Route} from "../../routing/Route"
import {PAGE_ENTITY, PAGE_POPUP, PANEL_ENTITY, PANEL_MAIN, VIEW_MAIN} from "../../routing/routes"
import BottomPopup from "../../components/BottomPopup/BottomPopup"
import {popPage, pushPage} from "../../index"
import {isDevEnv, isDeviceSupported} from "../../tools/helpers"

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
						Попап
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
		let route = Route.fromLocation(location.pathname, location.state)
		return <Root activeView={route.getViewId()}>
			<View id={VIEW_MAIN}
				  activePanel={route.getPanelId()}
				  history={this.getViewHistory(route, VIEW_MAIN)}
				  popout={this.renderPopup(route)}
				  onSwipeBack={() => popPage()}>
				<Panel id={PANEL_MAIN}>
					<PanelHeader>
						Главная страница
					</PanelHeader>
					<div style={{textAlign: 'center', paddingTop: 10}}>
						<Button onClick={() => pushPage(PAGE_ENTITY, {entityId: 0})}>
							На страницу сущности
						</Button>
					</div>
				</Panel>
				<Panel id={PANEL_ENTITY}>
					{this.renderBackPanelHeader('Сущность')}
					<div style={{textAlign: 'center', paddingTop: 10}}>
						<Button onClick={() => pushPage(PAGE_POPUP, {entityId: 0})}>
							Открыть попап
						</Button>
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
	}
}

export default connect(mapStateToProps, {
	removeFatalError,
	popPage,
	pushPage,
})(MobileContainer)
