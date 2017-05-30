const NON_DIMENSION_PROPS = {}
'boxFlex boxFlexGroup columnCount fillOpacity flex flexGrow flexPositive flexShrink flexNegative fontWeight lineClamp lineHeight opacity order orphans strokeOpacity widows zIndex zoom'.split(' ').forEach(k => NON_DIMENSION_PROPS[k] = true)

export class VNode {
	constructor(nodeName, attributes, children) {
		this.nodeName = nodeName
		this.attributes = attributes
		this.children = children
	}
}
VNode.prototype.__isVNode = true

let hooks = {}

hooks.vnode = ({ attributes }) => {
	if (!attributes) return

	let s = attributes.style
	if (s && !s.substring) {
		attributes.style = styleObjToCss(S)
	}

	let c = attributes['class']
	if (attributes.hasOwnProperty('className')) {
		c = attributes['class'] = attributes.className
		delete attributes.className
	}

	if (c && !c.substring) {
		attributes['class'] = hashToClassName(c)
	}
}

let memoize = (fn, mem = {}) => k => mem.hasOwnProperty(k) ? mem[k] : (mem[k] = fn(k))

let jsToCss = memoize(s => s.replace(/([A-Z])/, '-$1').toLowerCase())

function styleObjToCss(s) {
	let str = '',
		sep = ': ',
		term = '; '

	for (const prop in s) {
		if (s.hasOwnProperty(prop)) {
			const val = s[prop]
			str += jsToCss(prop)
			str += sep
			str += val

			if (typeof val === 'number' && NON_DIMENSION_PROPS.hasOwnProperty(prop)) {
				str += 'px'
			}

			str += term
		}
	}

	return str;
}

function hashToClassName(c) {
	let str = ''

	for (const prop in c) {
		if (c[prop]) {
			if (str) str += ' '
			str += prop
		}
	}

	return str
}

export function h(nodeName, attributes, ...args) {
	let children,
		sharedArr = [],
		len = args.length,
		arr, lastSimple

	if (len) {
		children = []
		for (let i = 0; i < len; i++) {
			let p = args[i]

			if (p === null || p === undefined) continue

			if (p.join) {
				arr = p
			} else {
				arr = sharedArr
				arr[0] = p
			}

			for (let j = 0; j < arr.length; j++) {
				let child = arr[j]
					simple = notEmpty(child) && !isVNode(child)

				if (simple) child = String(child)

				if (simple && lastSimple) {
					children[children.length - 1] += child
				} else if (notEmpty(child)) {
					children.push(child)
				}

				lastSimple = simple
			}
		}
	}

	if (attributes && attributes.children) {
		delete attributes.children
	}

	let p = new VNode(nodeName, attributes || undefined, children || undefined)
	hook(hooks, 'vnode', p)

	return p
}

function hook(obj, name, ...args) {
	const fn = obj[name]
	if (fn && typeof fn === 'function') return fn.apply(obj, args)
}

function isVNode(obj) {
	return obj && obj.__isVNode === true
}

function notEmpty(x) {
	return x !== null && x !== undefined
}

export { hooks }
export default { hooks, h }
