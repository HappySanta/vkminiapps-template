let moduleName = null

process.argv.forEach(function (val, index, array) {
	if (index === 2) {
		moduleName = val
	}
})

if (moduleName) {

	let basePath = 'src/modules/' + moduleName + '.js'


	let fs = require('fs');
	if (fs.existsSync(basePath)) {
		console.error(`Directory ${basePath} already exists`)
		return
	}

	let moduleFile = `const UPDATE = '${moduleName}.UPDATE'

const initState = {
    
}

export default function ${moduleName}(state = initState, action) {
    switch (action.type) {
		case UPDATE:
			return {...state, ...action.update}
		default:
			return state
    }
}

function update(update) {
	return {type: UPDATE, update}
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
