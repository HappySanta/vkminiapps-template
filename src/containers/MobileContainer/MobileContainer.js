import React, {Component} from 'react'
import {connect} from 'react-redux'
import {removeFatalError} from "../../modules/FatalErrorModule"
import L from "../../lang/L"
import {
	popPage, pushPage,
} from "../../modules/PageModule"
import {withRouter} from "react-router"
import Error from "../../components/Error/Error"
import Icon24Back from '@vkontakte/icons/dist/24/back'
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back'
import {Root, View, Panel, PanelHeader, HeaderButton, platform, IOS, Button} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import ScreenSpinner from "../../components/ScreenSpinner/ScreenSpinner"
import {Route} from "../../routing/Route"
import {
	PAGE_ENTITY,
	PANEL_ENTITY,
	PANEL_MAIN, VIEW_ENTITY,
	VIEW_MAIN
} from "../../routing/routes"

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

	goBack(handed = false) {
		if (handed) {
			this.resetHandedPopup()
			return
		}
		this.props.popPage()
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

	getMainPanelHistory() {
        return []
	}

	render() {
		if (!this.props.loaded) {
			return <ScreenSpinner h={MobileContainer.deviceHeight + this.getPanelHeight()}/>
		}
		if (this.props.fatal) {
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
		let route = Route.fromLocation(this.props.location.pathname)
		return <Root activeView={route.getViewId()}>
			<View id={VIEW_MAIN}
				  onSwipeBack={() => this.goBack()}
				  history={this.getMainPanelHistory()}
				  activePanel={route.getPanelId()}>
				<Panel id={PANEL_MAIN}>
					<PanelHeader>
						Главная страница
					</PanelHeader>
					<div>
						<Button onClick={() => this.props.pushPage(PAGE_ENTITY, {entityId: 0})}>
							На страницу сущности
						</Button>
					</div>
				</Panel>
			</View>
			<View id={VIEW_ENTITY} activePanel={route.getPanelId()}>
				<Panel id={PANEL_ENTITY}>
					{this.renderBackPanelHeader('Сущность')}
					<div>
						Страница с какой-либо сущностью
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
	}
}

export default withRouter(connect(mapStateToProps, {
	removeFatalError,
	popPage,
    pushPage,
})(MobileContainer))
