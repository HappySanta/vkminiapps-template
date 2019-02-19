import React, {Component} from 'react'
import {connect} from "react-redux"
import './BottomPopup.css'
import {PopoutWrapper} from "@vkontakte/vkui"
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class BottomPopup extends Component {

	state = {
		rendered: false
	}

	timer = null

	componentDidMount() {
		this.timer = setTimeout(() => {
			this.setState({rendered: true})
			this.timer = null
		}, 200)
	}

	onClose() {
		if (this.timer) {
			return
		}
		this.setState({rendered: false})
		this.timer = setTimeout(() => {
			this.props.onClose()
			this.timer = null
		}, 250)
	}

	render() {
		let {showCross} = this.props
		return <PopoutWrapper v="bottom">
			<ReactCSSTransitionGroup transitionName="PopupAnimation"
									 className="PopupAnimationWrapper"
									 transitionEnterTimeout={200}
									 transitionLeaveTimeout={200}>
				{this.state.rendered ? <div style={this.props.style || {}} className="BottomPopup">
					<div className="BottomPopup__header">
						{showCross ? <div className="BottomPopup__close"
										  onClick={() => this.onClose()}>
						</div> : null}
					</div>
					{this.props.children}
					{this.props.footer ? <div className="BottomPopup__footer">
						{this.props.footer}
					</div>: null}
				</div> : null}
			</ReactCSSTransitionGroup>
		</PopoutWrapper>
	}

}

function mapStateToProps(state) {
	return {

	}
}

export default connect(mapStateToProps, {})(BottomPopup)
