let componentName = null
let blank = false

process.argv.forEach(function (val, index, array) {
	if (index === 2) {
		componentName = val
	}
	if (index === 3) {
		blank = !!val
	}
})

if (componentName) {

	let basePath = 'src/components/' + componentName

	let componentClassName = componentName.split('/').pop()

	let fs = require('fs')
	if (fs.existsSync(basePath)) {
		console.error(`Directory ${basePath} already exists`)
		return
	}

	fs.mkdirSync(basePath)
	// fs.mkdirSync(basePath + "/style")
	// fs.mkdirSync(basePath + "/style/img")

	let styleFile = `.${componentClassName} \{\n`
	styleFile += "\t\n"
	styleFile += "}"

	let componentFile = `import "./${componentClassName}.css"\n`
	componentFile += 'import React, {Component} from "react"\n'
	if (!blank) {
		componentFile += 'import {connect} from "react-redux"\n'
	}
	componentFile += '// import PropTypes from "prop-types"\n'
	componentFile += `\n`
	if (!blank) {
		componentFile += `class ${componentClassName} extends Component {\n`
	} else {
		componentFile += `export default class ${componentClassName} extends Component {\n`
	}
	componentFile += `\n`
	componentFile += `\trender() {\n`
	componentFile += `\t\treturn <div className="${componentClassName}">\n\t\t\t\n\t\t</div>\n`
	componentFile += `\t}\n`
	componentFile += `}\n`
	componentFile += `\n`

	componentFile += `/*\n${componentClassName}.propTypes = {\n\t\n}\n*/`
	if (!blank) {
		componentFile += `function map(state) {\n`
		componentFile += `\treturn {\n`
		componentFile += `\n`
		componentFile += `\t}\n`
		componentFile += `}\n`
		componentFile += `\n`

		componentFile += `export default connect(map, {})(${componentClassName})\n`
	}

	fs.writeFile(`${basePath}/${componentClassName}.js`, componentFile, function (err) {
		if (err) {
			return console.log(err)
		}
	})


	fs.writeFile(`${basePath}/${componentClassName}.scss`, styleFile, function (err) {
		if (err) {
			return console.log(err)
		}
	})

	console.log(`All done with ${componentName}`)
	if (!blank) {
		console.log(`Use\n> npm run make:component ${componentName} default\nfor create component without redux`)
	}
} else {
	console.error("No component name passed")
}
