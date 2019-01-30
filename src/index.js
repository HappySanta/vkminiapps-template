import React from 'react'
import mount from "./tools/mount"
import VkSdk from "./Vk/VkSdk"
import store, {history} from './store'
import {Provider} from "react-redux"
import MobileContainer from "./containers/MobileContainer/MobileContainer"
import L from "./lang/L"
import './style/index.css'
import {ConnectedRouter} from 'connected-react-router'
import {handleLocation, subscribeToHistory} from "./modules/PageModule"
import Error from "./components/Error/Error"
import registerServiceWorker from "./registerServiceWorker"
import * as VkConnect from "@vkontakte/vkui-connect/index"
import {ConfigProvider} from "@vkontakte/vkui"

VkConnect.send("VKWebAppInit", {})
/**
 * @type {VkStartParams}
 */
let startParams = VkSdk.getStartParams()
L.init(startParams.getLangCode()).then(() => {
	store.dispatch(subscribeToHistory(history))
	store.dispatch(handleLocation(history.location.pathname))
	mount(<Provider store={store}>
		<ConfigProvider isWebView={true}>
			<ConnectedRouter history={history}>
				<MobileContainer/>
			</ConnectedRouter>
		</ConfigProvider>
	</Provider>)
}).catch(e => {
	mount(<Error error={e}/>)
})

registerServiceWorker()
