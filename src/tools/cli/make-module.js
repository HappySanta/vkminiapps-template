let moduleName = null

process.argv.forEach(function (val, index, array) {
	if (index === 2) {
		moduleName = val
	}
})

if (moduleName.indexOf('Module') === -1) {
	moduleName += "Module"
}

if (moduleName) {

	let basePath = 'src/modules/' + moduleName + '.js'


	let fs = require('fs');
	if (fs.existsSync(basePath)) {
		console.error(`Module ${basePath} already exists`)
		return
	}

	const snackCase = moduleName.replace(/(?:^|\.?)([A-Z])/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "").toUpperCase()

	let moduleFile = `const SET_${snackCase} = '${moduleName}.SET_${snackCase}'

const initState = {
    
}

export default function ${moduleName}(state = initState, action) {
    switch (action.type) {
		case SET_${snackCase}:
			return {...state, ...action.update}
		default:
			return state
    }
}

function set${moduleName}(update) {
	return {type: SET_${snackCase}, update}
}`


	fs.writeFile(`${basePath}`, moduleFile, function (err) {
		if (err) {
			return console.log(err)
		}
	})

	console.log(`All done with ${moduleName}`)

	let index = fs.readFileSync('src/modules/index.js')
	if (index) {
		index = `import ${moduleName} from "./${moduleName}"\n`+index
		if (index.indexOf('export default combineReducers({') !== -1) {
			index = index.replace('export default combineReducers({', `export default combineReducers({\n	${moduleName},`)
		}
		fs.writeFileSync('src/modules/index.js', index)
	}

} else {
	console.error("No module name passed")
}
