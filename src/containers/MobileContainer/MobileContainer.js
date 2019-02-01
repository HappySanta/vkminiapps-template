import React, {Component} from "react"
import {connect} from "react-redux"
import {removeFatalError} from "../../modules/FatalErrorModule"
import L from "../../lang/L"
import Error from "../../components/Error/Error"
import Icon24Back from "@vkontakte/icons/dist/24/back"
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back"
import {Root, View, Panel, PanelHeader, HeaderButton, platform, IOS, Button} from "@vkontakte/vkui"
import "@vkontakte/vkui/dist/vkui.css"
import ScreenSpinner from "../../components/ScreenSpinner/ScreenSpinner"
import {Route} from "../../routing/Route"
import {
	PAGE_ENTITY, PAGE_ENTITY_NEXT,
	PAGE_NEXT,
	PAGE_POPUP,
	PANEL_ENTITY, PANEL_ENTITY_NEXT,
	PANEL_MAIN, PANEL_NEXT,
	VIEW_ENTITY,
	VIEW_MAIN
} from "../../routing/routes"
import BottomPopup from "../../components/BottomPopup/BottomPopup"
import {setBootstrap} from "../../modules/BootstrapModule"
import {popPage, pushPage} from "../../index"

const osName = platform()

class MobileContainer extends Component {

	static deviceWidth = 0
	static deviceHeight = 0

	constructor(props) {
		super(props)

		if (MobileContainer.deviceWidth === 0) {
			MobileContainer.deviceWidth = window.innerWidth
		}

		if (MobileContainer.deviceHeight === 0 && window.innerHeight) {
			MobileContainer.deviceHeight = window.innerHeight - this.getPanelHeight()
		}

		if (MobileContainer.deviceWidth < 10) {
			this.recheckDimensions()
		}

		if ('onorientationchange' in window) {
			window.addEventListener("orientationchange", () => {
				MobileContainer.deviceHeight = window.innerWidth - this.getPanelHeight()
				MobileContainer.deviceWidth = window.innerHeight
				this.setState({time: Date.now()})
			}, false)
		}
	}

	componentDidMount() {
		window.addEventListener("scroll", () => {
			if (window.pageYOffset > 50) {
				document.querySelector('.View__header').style.opacity = 1
			} else {
				document.querySelector('.View__header').style.opacity = 0
			}
		});
	}

	getPanelHeight() {
		return osName === IOS ? 44 : 56
	}

	getAndroidVersion() {
		let ua = (window.navigator.userAgent).toLowerCase()
		// eslint-disable-next-line
		let match = ua.match(/android\s([0-9\.]*)/)
		if (ua.indexOf('chrome/6') !== -1) {
			return false
		}
		return match ? parseInt(match[1], 10) : false
	}

	getIosVersion() {
		if (/iP(hone|od|ad)/.test(navigator.platform)) {
			let v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/)
			return parseInt(v[1], 10)
		} else {
			return false
		}
	}

	recheckDimensions() {
		if (MobileContainer.deviceWidth < 10) {
			setTimeout(() => {
				try {
					MobileContainer.deviceHeight = window.innerHeight - this.getPanelHeight()
					MobileContainer.deviceWidth = document.documentElement.offsetWidth
				} catch (e) {
					MobileContainer.deviceWidth = window.innerWidth
				}
				this.setState({time: Date.now()})
				this.recheckDimensions()
			}, 100)
		}
	}

	goBack() {
		popPage()
	}

	renderBackPanelHeader(title, noShadow = false) {
		return <PanelHeader
			noShadow={noShadow}
			left={<HeaderButton onClick={() => this.goBack()}>
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</HeaderButton>}>
			{title}
		</PanelHeader>
	}

	renderPopup(route) {
		if (!route.isPopup) {
			return false
		}
		switch (route.pageId) {
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

	render() {
		let {loaded, fatal, location, viewHistory} = this.props
		if (!loaded) {
			return <ScreenSpinner h={MobileContainer.deviceHeight + this.getPanelHeight()}/>
		}
		if (fatal) {
			return <Error error={this.props.fatal} onClose={() => this.props.removeFatalError()}/>
		}
		if ((this.getAndroidVersion() && this.getAndroidVersion() <= 4) || (this.getIosVersion() && this.getIosVersion() <= 8)) {
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
		let route = Route.fromLocation(location.pathname)
		return <Root activeView={route.getViewId()}>
			<View id={VIEW_MAIN}
				  activePanel={route.getPanelId()}
				  history={viewHistory[VIEW_MAIN]}
				  onSwipeBack={() => popPage()}>
				<Panel id={PANEL_MAIN}>
					<PanelHeader>
						Главная страница
					</PanelHeader>
					<div>
						<Button onClick={() => pushPage(PAGE_ENTITY, {entityId: 0})}>
							На страницу сущности
						</Button>
					</div>
					<div>
						<Button onClick={() => pushPage(PAGE_NEXT)}>
							Следующая страница
						</Button>
					</div>
				</Panel>
				<Panel id={PANEL_NEXT}>
					{this.renderBackPanelHeader('Следующая страница')}
				</Panel>
			</View>
			<View history={viewHistory[VIEW_ENTITY]} id={VIEW_ENTITY} popout={this.renderPopup(route)} activePanel={route.getPanelId()}>
				<Panel id={PANEL_ENTITY}>
					{this.renderBackPanelHeader('Сущность')}
					<div>
						Страница с какой-либо сущностью
					</div>
					<div>
						<Button onClick={() => pushPage(PAGE_ENTITY_NEXT, {entityId: 0})}>
							На след. страницу сущности
						</Button>
					</div>
				</Panel>
				<Panel id={PANEL_ENTITY_NEXT}>
					{this.renderBackPanelHeader('Следующая страница сущности')}
					<div>
						<Button onClick={() => pushPage(PAGE_POPUP, {entityId: 0, myId: 0})}>
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
		loaded: state.BootstrapModule.loaded,
		viewHistory: state.LocationModule.viewHistory,
	}
}

export default connect(mapStateToProps, {
	removeFatalError,
	popPage,
	pushPage,
	setBootstrap,
})(MobileContainer)
