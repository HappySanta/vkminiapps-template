import React, {Component} from "react"
import PropTypes from "prop-types"
import L from "../../lang/L"
import "./Popup.css"

function stopEvent(event) {
	event.stopPropagation()
}

class Popup extends Component {

	onClose = () => {
		this.props.onClose()
	}

	header() {
		if (this.props.header) {
			return <div className={"Popup__header " + (this.props.headerClassName || "")}>{this.props.header}</div>
		}
	}

	render() {
		return <div className="Popup" onClick={this.onClose}>
			<div className={"Popup__window " + (this.props.className || "")} onClick={stopEvent}>
				<button title={L.t('close')} onClick={this.onClose} className="Popup__close"/>
				{this.header()}
				{this.props.children}
			</div>
		</div>
	}
}

Popup.propTypes = {
	onClose: PropTypes.func
}


export default Popup
