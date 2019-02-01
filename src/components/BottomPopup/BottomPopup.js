import React, {Component} from 'react'
import {connect} from "react-redux"
import './BottomPopup.css'
import {PopoutWrapper} from "@vkontakte/vkui"

class BottomPopup extends Component {

	onClose() {
		this.props.onClose()
	}

	render() {
		let {showCross} = this.props
		return <PopoutWrapper v="bottom">
			<div style={this.props.style || {}} className="BottomPopup">
				<div className="BottomPopup__header">
					{showCross ? <div className="BottomPopup__close"
									  onClick={() => this.onClose()}>
					</div> : null}
				</div>
				{this.props.children}
				{this.props.footer ? <div className="BottomPopup__footer">
					{this.props.footer}
				</div>: null}
			</div>
		</PopoutWrapper>
	}

}

function mapStateToProps(state) {
	return {

	}
}

export default connect(mapStateToProps, {})(BottomPopup)
