import {combineReducers} from "redux"
import LocationModule from "./LocationModule"
import FatalErrorModule from "./FatalErrorModule"
import BootstrapModule from "./BootstrapModule"

export default combineReducers({
	LocationModule,
    FatalErrorModule,
	BootstrapModule,
})
