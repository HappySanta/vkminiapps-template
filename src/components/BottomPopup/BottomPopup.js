import React, {Component} from 'react'
import {connect} from "react-redux"
import './BottomPopup.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import ScrollablePopoutWrapper from "../ScrollablePopoutWrapper/ScrollablePopoutWrapper"

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

	onClose(e) {
		if (this.timer) {
			return
		}
		this.setState({rendered: false})
		this.timer = setTimeout(() => {
			this.props.onClose()
			this.timer = null
		}, 250)
		e.stopPropagation()
	}

	componentWillUnmount() {
		clearTimeout(this.timer)
	}

	render() {
		let {showCross, children} = this.props
		const childrenWithOnClose = React.Children.map(children, child =>
			React.cloneElement(child, {onClose: (e) => this.onClose(e)})
		)
		return <ScrollablePopoutWrapper v="bottom" onClick={(e) => this.onClose(e)}>
			<ReactCSSTransitionGroup transitionName="PopupAnimation"
									 className="PopupAnimationWrapper"
									 transitionEnterTimeout={200}
									 transitionLeaveTimeout={200}>
				{this.state.rendered ? <div style={this.props.style || {}} className="BottomPopup"
											onClick={(e) => {
												e.stopPropagation();
												return false
											}}>
					<div className="BottomPopup__header">
						{showCross ? <div className="BottomPopup__close"
										  onClick={(e) => this.onClose(e)}>
						</div> : null}
					</div>
					{childrenWithOnClose}
					{this.props.footer ? <div className="BottomPopup__footer">
						{this.props.footer}
					</div> : null}
				</div> : null}
			</ReactCSSTransitionGroup>
		</ScrollablePopoutWrapper>
	}
}

function mapStateToProps(state) {
	return {}
}

export default connect(mapStateToProps, {})(BottomPopup)
