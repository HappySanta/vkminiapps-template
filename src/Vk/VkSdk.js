import queryString from 'query-string'
import VkStartParamsBuilder from "./VkStartParamsBuilder"
import {VkConnectRequest} from "../tools/VkConnectRequest"

export default class VkSdk {

    static startParams = null
    static startSearch = ""

	/**
	 * @returns {VkStartParams}
	 */
	static getStartParams() {
		if (VkSdk.startParams === null) {
			VkSdk.startParams = VkStartParamsBuilder.fromQueryParams(queryString.parse(window.location.search))
			VkSdk.startSearch = window.location.search
		}
		return VkSdk.startParams
	}

	static allowNotifications(onSuccess, onFail) {
		let request = new VkConnectRequest('VKWebAppAllowNotifications', {}, 'VKWebAppAllowNotificationsResult', 'VKWebAppAllowNotificationsFailed')
		request.send().then(r => onSuccess(r)).catch(e => onFail(e))
	}
}
