const TEXT_NODE = 3
const ELEMENT_NODE = 1
const EMPTY = {}
const EMPTY_BASE = ''
const NON_DIMENSION_PROPS = {}
'boxFlex boxFlexGroup columnCount fillOpacity flex flexGrow flexPositive flexShrink flexNegative fontWeight lineClamp lineHeight opacity order orphans strokeOpacity widows zIndex zoom'
	.split(' ').forEach(k => NON_DIMENSION_PROPS[k] = true)

let slice = Array.prototype.slice

let options = {
	syncComponentUpdates: true
}

let hooks = {}

// build(this.base, rendered || EMPTY_BASE, this)
function build(dom, vnode, rootComponent) {
	let out = dom
	let nodeName = vnode.nodeName

	if (typeof nodeName === 'function') {
		return buildComponentFromVNode(dom, vnode)
	}

	if (typeof vnode === 'string') {
		if (dom) {
			if (dom.nodeType === TEXT_NODE) {
				dom.textContent = vnode
				return dom
			} else {
				if (dom.nodeType === ELEMENT_NODE) {
					recycler.collect(dom)
				}
			}
		}

		return document.createTextNode(vnode)
	}

	if (nodeName === null || nodeName === undefined) {
		nodeName = 'x-undefined-element'
	}

	if (!dom) {
		out = recycler.create(nodeName)
	} else if (dom.nodeName.toLowerCase() !== nodeName) {
		out = recycler.create(nodeName)
		appendChildren(out, slice.call(dom.childNotes))

		if (dom.nodeType === TEXT_NODE) recycler.collect(dom)
	} else if (dom._component && dom._component !== rootComponent) {
		unmountComponent(dom, dom._component)
	}

	// apply attributes
	let old = getNodeAttributes(out) || EMPTY
	let attrs = vnode.attributes || EMPTY

	// removed attributes
	if (old !== EMPTY) {
		for (const name in old) {
			const o = attrs[name]
			if (o === undefined || o === null || o === false) {
				setAccessor(out, name, null, old[name])
			}
		}
	}

	// new & updated attributes
	if (attrs !== EMPTY) {
		for (const name in attrs) {
			if (attrs.hasOwnProperty(name)) {
				const value = attrs[name]
				if (value !== undefined && value !== null && value !== false) {
					let prev = getAccessor(out, name, old[name])

					if (value !== prev) {
						setAccessor(out, name, value, prev)
					}
				}
			}
		}
	}

	// build children
	let children = slice.call(out.childNotes)
	let keyed = {}

	for (let i = children.length; i--;) {
		let t = children[i].nodeType
		let key

		if (t === TEXT_NODE) {
			key = t.key
		} else if (t === ELEMENT_NODE) {
			key = children[i].getAttribute('key')
		} else continue

		if (key) keyed[key] = children.splice(i, 1)[0]
	}

	let newChildren = []

	if (vnode.children) {
		for (let i = 0, vlen = vnode.children.length; i < vlen; i++) {
			let vchild = vnode.children[i]
			let attrs = vchild.attributes
			let key, child

			if (attrs) {
				key = attrs.key
				child = key && keyed[key]
			}

			// attempt to pluck a node of the same typo from the existing children
			if (!child) {
				let len = children.length
				if (len) {
					for (let j = 0; j < len; j++) {
						if (isSameNodeType(children[j], vchild)) {
							child = children.splice(j, 1)[0]
							break
						}
					}
				}
			}

			// morph the matched/found/created DOM child to match vchild (deep)
			newChildren.push(build(child, vchild))
		}
	}

	// apply the constructed/enhanced ordered list to the parent
	for (let i = 0, len = newChildren.length; i < len; i++) {
		if (out.childNotes[i] !== newChildren[i]) {
			let child = newChildren[i]
			let c = child._component
			let next = out.childNotes[i + 1]

			if (c) hook(c, 'componentWillMount')

			if (next) {
				out.insertBefore(child, next)
			} else {
				out.appendChild(child)
			}

			if (c) hook(c, 'componentDidMount')
		}
	}

	// remove orphaned children
	for (let i = 0, len = children.length; i < len; i++) {
		let child = children[i]
		let c = child._component

		if (c) hook(c, 'componentWillUnmount')

		child.parentNode.removeChild(child)

		if (c) {
			hook(c, 'componentDidUnmount')
			componentRecycler.collect(c)
		} else if (child.nodeType === ELEMENT_NODE) {
			recycler.collect(child)
		}
	}

	return out
}

function isSameNodeType(a, b) {

}

function getAccessor(out, name, oldName) {

}

function setAccessor(out, name, value, oldName) {

}

function getNodeAttributes(out) {

}

function unmountComponent(dom, component) {

}

function appendChildren(out, childNotes) {

}

function buildComponentFromVNode(dom, vnode) {

}

let componentRecycler = {
	components: [],
	collect(component) {
		let name = component.constructor.name
		let list = componentRecycler.component[name] || (componentRecycler.components[name] = [])

		list.push(component)
	},
	create(ctor) {
		let name = ctor.name
		let list = componentRecycler.components[name]

		if (list && list.length) {
			return list.splice(0, 1)[0]
		}

		return new ctor()
	}
}

let recycler = {
	nodes: {},
	collect(node) {
		recycler.clean(node)
		let name = recycler.normalizeName(node.nodeName)
		let list = recycler.nodes[name]

		if (list) list.push(node)
		else recycler.nodes[name] = [node]
	},
	create(nodeName) {
		let name = recycler.normalizeName(nodeName)
		let list = recycler.nodes[name]

		return list && list.pop() || document.createElement(nodeName)
	},
	clean(node) {
		node.remove()
		let len = node.attributes && node.attributes.length
		if (len) for (let i = len; i--;) {
			node.removeAttribute(node.attributes[i].name)
		}
	},
	normalizeName: memoize(name => name.toUpperCase())
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
		this.state = hook(this, 'getInitialState') || {}
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

		this.props = this.nextProps

		if (this.base && hook(this, 'shouldComponentUpdate', this.props, this.state) === false) {
			return
		}

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
