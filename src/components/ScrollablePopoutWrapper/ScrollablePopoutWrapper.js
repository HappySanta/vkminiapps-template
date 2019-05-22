import {PopoutWrapper} from "@vkontakte/vkui"
import "./ScrollablePopoutWrapper.css"

export default class ScrollablePopoutWrapper extends PopoutWrapper {

	state = {...super.state, scrolled: 0}

	componentDidMount() {
		this.waitAnimationFinish(this.el, this.onFadeInEnd)
	}

	componentWillMount() {
		const scrolled = window.pageYOffset
		this.setState({scrolled})
		document.querySelector('#root').classList.add('root_blocked_scroll')
		document.querySelector('body').classList.add('body_blocked_scroll')
		document.querySelector('body').classList.add('body_opened_popup')
		const panel = document.querySelector('.Panel')
		if (panel) {
			panel.style.top = `-${scrolled}px`
		}
	}

	componentWillUnmount() {
		document.querySelector('#root').classList.remove('root_blocked_scroll');
		document.querySelector('body').classList.remove('body_blocked_scroll');
		document.querySelector('body').classList.remove('body_opened_popup');
		const panel = document.querySelector('.Panel')
			if (panel) {
				panel.style.top = '0';
			}
		window.scrollTo(0, this.state.scrolled)
		clearTimeout(this.animationFinishTimeout)
		window.removeEventListener('touchstart', this.onTouchStart)
	}
}
