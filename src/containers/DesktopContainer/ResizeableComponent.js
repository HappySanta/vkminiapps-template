import {Component} from "react"

export default class ResizeableComponent extends Component {

	componentDidMount() {
		ResizeableComponent.afterUpdate()
	}

	componentDidUpdate() {
		ResizeableComponent.afterUpdate()
	}

	static afterUpdate() {
		if (window.onChangeHeight) {
			window.onChangeHeight()
		}
	}
}
