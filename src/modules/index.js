import {combineReducers} from "redux"
import PageModule from "./PageModule"
import FatalErrorModule from "./FatalErrorModule"
import BootstrapModule from "./BootstrapModule"
import {connectRouter} from "connected-react-router"

export default (history) => combineReducers({
	router: connectRouter(history),
	PageModule,
    FatalErrorModule,
	BootstrapModule,
})
