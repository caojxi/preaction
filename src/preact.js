const EMPTY = {}
const EMPTY_BASE = ''
const NON_DIMENSION_PROPS = {}
'boxFlex boxFlexGroup columnCount fillOpacity flex flexGrow flexPositive flexShrink flexNegative fontWeight lineClamp lineHeight opacity order orphans strokeOpacity widows zIndex zoom'
	.split(' ').forEach(k => NON_DIMENSION_PROPS[k] = true)

let options = {
	syncComponentUpdates: true
}

let renderQueue = {
	items: [],
	itemsOffline: [],
	pending: false,
	add(component) {
		if (renderQueue.items.push(component) !== 1) return

		let d = hooks.debounceRendering
		if (d) d(renderQueue.process)
		else setTimeout(renderQueue.process, 0)
	},
	process() {
		let items = renderQueue.items
		let len = items.length

		if (!len) return

		renderQueue.items = renderQueue.itemsOffline
		renderQueue.items.length = 0;
		renderQueue.itemsOffline = items

		while (len--) {
			if (items[len]._dirty) items[len]._render()
		}
	}
}

export class Component {
	constructor() {
		this._dirty = this._disableRendering = false
		this.nextProps = this.base = null
		this.props = hook(this, 'getDefaultProps') || {}
		this.state = hook(this, 'getINitialState') || {}
		hook(this, 'initialize')
	}

	shouldComponentUpdate(nextProps, nextState) {
		return ture
	}

	setState(state) {
		extend(ths.state, state)
		this.triggerRender()
	}

	setProps(props, opts = EMPTY) {
		let d = this._disableRendering === true
		this._disableRendering = true
		hook(this, 'componentWillReceiveProps', props, this.props)
		this.nextProps = props
		this._disableRendering = d

		if (opts.renderSync === true && options.syncComponentUpdates === true) {
			this._render()
		} else if (opts.render !== false) {
			this.triggerRender()
		}
	}

	triggerRender() {
		if (this._dirty !== true) {
			this._dirty = true
			renderQueue.add(this)
		}
	}

	render(props, state) {
		return h('div', { component: this.constructor.name }, props.children)
	}

	_render(opts = EMPTY) {
		if (this._disableRendering === true) return

		this._dirty = false

		if (this.base && hook(this, 'shouldComponentUpdate', this.props, this.state) === false) {
			this.props = this.nextProps
			return
		}

		this.props = this.nextProps

		hook(this, 'componentWillUpdate')

		let rendered = hook(this, 'render', this.props, this.state)

		if (this.base || opts.build === true) {
			let base = build(this.base, rendered || EMPTY_BASE, this)

			if (this.base && base !== this.base) {
				let p = this.base.parentNode
				if (p) p.replaceChild(base, this.base)
			}

			this.base = base
		}

		hook(this, 'componentDidUpdate')
	}
}

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
		attributes.style = styleObjToCss(s)
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
			str += jsToCss(prop) + sep + val

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
				let	simple = notEmpty(child) && !isVNode(child)

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

function extend(obj, props) {
	for (const i in props) if (props.hasOwnProperty(i)) {
		obj[i] = props[i]
	}

	return obj
}

export { hooks }
export default { hooks, h }
