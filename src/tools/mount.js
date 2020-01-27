import ReactDOM from 'react-dom'
import mVKMiniAppsScrollHelper from '@vkontakte/mvk-mini-apps-scroll-helper'

export default function mount(component, rootNodeId = 'root') {
	removeLoaderCenteringClass()
	let rootNode = document.getElementById(rootNodeId)
	if (window.reactMounted) {
		ReactDOM.unmountComponentAtNode(rootNode)
	}
	window.reactMounted = true
	mVKMiniAppsScrollHelper(rootNode)
	ReactDOM.render(component, rootNode)
}

function removeLoaderCenteringClass() {
	document.body.parentNode.classList.remove('h')
}
