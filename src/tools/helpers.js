import React from 'react'

export function devErrorLog(e) {
	if (process.env.NODE_ENV === 'development') {
		console.error(e)
	}
}

export function devLog(any) {
	if (process.env.NODE_ENV === 'development') {
		console.log(any)
	}
}

export function throwDevError(error) {
	if (process.env.NODE_ENV === 'development') {
		throw error
	}
}

export function isRetina() {
	return window.devicePixelRatio > 1
}

export function isMobile() {
	return true
}

function parseLink(text,pref,cfg = {}) {
    let parts = text.split(/(\[[idclubpage0-9\-_]+\|.*?\]|<.*?>)/gmu)
    if (parts.length === 1) {
        return parts[0]
    }
    let res = []
    parts.forEach( (t,i) => {
        if (t.match(/^\[[idclubpage0-9\-_]+\|.*?\]$/gmu) && !cfg['noLink']) {
            let tag = t.split('|')
            let href = 'https://vk.com/' + tag[0].replace('[', '')
            let text = tag[1].replace(']', '')
            res.push(<a href={href} rel="noopener noreferrer" target="_blank" key={pref + '_' + i}>{text}</a>)
        } else if (t.match(/^<.*?>$/gmu) && !cfg['noStrong']) {
            res.push(<strong key={pref + '_' + i}>{t.substr(1, t.length-2)}</strong>)
        } else {
            res.push(t)
        }
    } )
    return res
}

export function nToBr(string, cfg = {}) {
	string = string || ""
	if (!cfg['noTypography']) {
        string = string.replace(/&shy;/g, "\u00AD")
        string = string.replace(/&nbsp;/g, "\u00A0")
        string = string.replace(/&#8209;/g, "\u2011")
    }
    let stringArray = string.split('\n')
    let length = stringArray.length
    let result = []
    for (let i = 0; i < length; i++) {
		result.push(parseLink(stringArray[i], i, cfg))
        if (i !== length - 1) {
            result.push(<br key={i}/>)
        }
    }
    return result
}
