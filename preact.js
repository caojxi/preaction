!function(e,t){if("function"==typeof define&&define.amd)define(["exports"],t);else if("undefined"!=typeof exports)t(exports);else{var n={exports:{}};t(n.exports),e.preact=n.exports}}(this,function(e){"use strict";function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){var n=p(null,e),r=n._component;return r&&o(r,"componentWillMount"),t.appendChild(n),r&&o(r,"componentDidMount"),p}function r(e,t){for(var n=arguments.length,r=Array(n>2?n-2:0),a=2;a<n;a++)r[a-2]=arguments[a];var c=void 0,l=[],d=r.length,p=void 0,u=void 0;if(d){c=[];for(var f=0;f<d;f++){var h=r[f];if(null!==h&&void 0!==h){h.join?p=h:(p=l,p[0]=h);for(var v=0;v<p.length;v++){var m=p[v],y=s(m)&&!i(m);y&&(m=String(m)),y&&u?c[c.length-1]+=m:s(m)&&c.push(m),u=y}}}}t&&t.children&&delete t.children;var g=new W(e,t||void 0,c||void 0);return o(A,"vnode",g),g}function o(e,t){for(var n=e[t],r=arguments.length,o=Array(r>2?r-2:0),i=2;i<r;i++)o[i-2]=arguments[i];if(n&&"function"==typeof n)return n.apply(e,o)}function i(e){return e&&!0===e.__isVNode}function s(e){return null!==e&&void 0!==e}function a(e,t){if(3===e.nodeType)return"string"==typeof t;var n=t.nodeName;return"function"==typeof n?e._componentConstructor===n:e.nodeName.toLowerCase()===n}function c(e,t){var n=e&&e._component;if(n&&e._componentConstructor===t.nodeName){var r=b(t);return n.setProps(r,P),e}return n&&d(e,n),l(t)}function l(e){var t=E.create(e.nodeName),n=b(e);t.setProps(n,w),t._render(O);var r=t.base;return r._component=t,r._componentConstructor=e.nodeName,r}function d(e,t){delete e._component,o(t,"componentWillUnmount");var n=t.base;n&&n.parentNode&&n.parentNode.removeChild(n),o(t,"componentDidUnmount"),E.collect(t)}function p(e,t,n){var r=e,i=t.nodeName;if("function"==typeof i)return c(e,t);if("string"==typeof t){if(e){if(3===e.nodeType)return e.textContent=t,e;1===e.nodeType&&S.collect(e)}return document.createTextNode(t)}null!==i&&void 0!==i||(i="x-undefined-element"),e?e.nodeName.toLowerCase()!==i?(r=S.create(i),u(r,U.call(e.childNodes)),1===e.nodeType&&S.collect(e)):e._component&&e._component!==n&&d(e,e._component):r=S.create(i);var s=y(r)||C,l=t.attributes||C;if(s!==C)for(var v in s)if(s.hasOwnProperty(v)){var m=l[v];void 0!==m&&null!==m&&!1!==m||h(r,v,null,s[v])}if(l!==C)for(var g in l)if(l.hasOwnProperty(g)){var b=l[g];if(void 0!==b&&null!==b&&!1!==b){var _=f(r,g,s[g]);b!==_&&h(r,g,b,_)}}for(var N=U.call(r.childNodes),x={},w=N.length;w--;){var P=N[w].nodeType,O=void 0;if(3===P)O=P.key;else{if(1!==P)continue;O=N[w].getAttribute("key")}O&&(x[O]=N.splice(w,1)[0])}var T=[];if(t.children)for(var w=0,R=t.children.length;w<R;w++){var k=t.children[w],A=k.attributes,O=void 0,D=void 0;if(A&&(O=A.key,D=O&&x[O]),!D){var W=N.length;if(N.length)for(var z=0;z<W;z++)if(a(N[z],k)){D=N.splice(z,1)[0];break}}T.push(p(D,k))}for(var w=0,W=T.length;w<W;w++)if(r.childNodes[w]!==T[w]){var D=T[w],L=D._component,M=r.childNodes[w+1];L&&o(L,"componentWillMount"),M?r.insertBefore(D,M):r.appendChild(D),L&&o(L,"componentDidMount")}for(var w=0,W=N.length;w<W;w++){var D=N[w],L=D._component;L&&o(L,"componentWillUnmount"),D.parentNode.removeChild(D),L?(o(L,"componentDidUnmount"),E.collect(L)):1===D.nodeType&&S.collect(D)}return r}function u(e,t){var n=t.length;if(n<=2)return e.appendChild(t[0]),void(2===n&&e.appendChild(t[1]));for(var r=document.createDocumentFragment(),o=0;o<n;o++)r.appendChild(t[o]);e.appendChild(r)}function f(e,t,n){return"class"===t?e.className:"style"===t?e.style.cssText:n}function h(e,t,n,r){"class"===t?e.className=n:"style"===t?e.style.cssText=n:v(e,t,n,r)}function v(e,t,n,r){if("on"===t.substring(0,2)){var o=t.substring(2).toLowerCase(),i=e._listeners||(e._listeners={});return i[o]||e.addEventListener(o,m),void(i[o]=n)}var s=typeof n;null===n?e.removeAttribute(t):"function"!==s&&"object"!==s&&e.setAttribute(t,n)}function m(e){var t=this._listeners,n=t[M(e.type)];if(n)return n.call(this,o(A,"event",e)||e)}function y(e){var t=e.attributes;return t&&t.getNamedItem?t.length?g(t):void 0:t}function g(e){for(var t={},n=e.length;n--;){var r=e[n];t[r.name]=r.value}return t}function b(e){var t=x({},e.attributes);return e.children&&(t.children=e.children),e.text&&(t._content=e.text),t}function _(e){var t="";for(var n in e)if(e.hasOwnProperty(n)){var r=e[n];t+=F(n),t+=": ",t+=r,"number"!=typeof r||T.hasOwnProperty(n)||(t+="px"),t+="; "}return t}function N(e){var t="";for(var n in e)e[n]&&(t&&(t+=" "),t+=n);return t}function x(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}e.render=n,e.h=r;var C={},w={render:!1},P={renderSync:!0},O={build:!0},T={};"boxFlex boxFlexGroup columnCount fillOpacity flex flexGrow flexPositive flexShrink flexNegative fontWeight lineClamp lineHeight opacity order orphans strokeOpacity widows zIndex zoom".split(" ").forEach(function(e){return T[e]=!0});var U=Array.prototype.slice,R=function(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];return function(n){return t.hasOwnProperty(n)?t[n]:t[n]=e(n)}},k={syncComponentUpdates:!0},A={};A.vnode=function(e){var t=e.attributes;if(t){var n=t.style;n&&!n.substring&&(t.style=_(n));var r=t.class;t.hasOwnProperty("className")&&(r=t.class=t.className,delete t.className),r&&!r.substring&&(t.class=N(r))}};var D=function(){function e(){t(this,e),this._dirty=this._disableRendering=!1,this.nextProps=this.base=null,this.props=o(this,"getDefaultProps")||{},this.state=o(this,"getInitialState")||{},o(this,"initialize")}return e.prototype.shouldComponentUpdate=function(e,t){return!0},e.prototype.setState=function(e){x(this.state,e),this.triggerRender()},e.prototype.setProps=function(e){var t=arguments.length<=1||void 0===arguments[1]?C:arguments[1],n=!0===this._disableRendering;this._disableRendering=!0,o(this,"componentWillReceiveProps",e,this.props),this.nextProps=e,this._disableRendering=n,!0===t.renderSync&&!0===k.syncComponentUpdates?this._render():!1!==t.render&&this.triggerRender()},e.prototype.triggerRender=function(){!0!==this._dirty&&(this._dirty=!0,z.add(this))},e.prototype.render=function(e,t){return r("div",{component:this.constructor.name},e.children)},e.prototype._render=function(){var e=arguments.length<=0||void 0===arguments[0]?C:arguments[0];if(!0!==this._disableRendering){if(this._dirty=!1,this.base&&!1===o(this,"shouldComponentUpdate",this.props,this.state))return void(this.props=this.nextProps);this.props=this.nextProps,o(this,"componentWillUpdate");var t=o(this,"render",this.props,this.state);if(this.base||!0===e.build){var n=p(this.base,t||"",this);if(this.base&&n!==this.base){var r=this.base.parentNode;r&&r.replaceChild(n,this.base)}this.base=n}o(this,"componentDidUpdate")}},e}();e.Component=D;var W=function e(n,r,o){t(this,e),this.nodeName=n,this.attributes=r,this.children=o};e.VNode=W,W.prototype.__isVNode=!0;var z={items:[],itemsOffline:[],pending:!1,add:function(e){if(1===z.items.push(e)){var t=A.debounceRendering;t?t(z.process):setTimeout(z.process,0)}},process:function(){var e=z.items,t=e.length;if(t)for(z.items=z.itemsOffline,z.items.length=0,z.itemsOffline=e;t--;)e[t]._dirty&&e[t]._render()}},L=z.process,S={nodes:{},collect:function(e){S.clean(e);var t=S.normalizeName(e.nodeName),n=S.nodes[t];n?n.push(e):S.nodes[t]=[e]},create:function(e){var t=S.normalizeName(e),n=S.nodes[t];return n&&n.pop()||document.createElement(e)},clean:function(e){e.remove();var t=e.attributes&&e.attributes.length;if(t)for(var n=t;n--;)e.removeAttribute(e.attributes[n].name)},normalizeName:R(function(e){return e.toUpperCase()})},E={components:{},collect:function(e){var t=e.constructor.name;(E.components[t]||(E.components[t]=[])).push(e)},create:function(e){var t=e.name,n=E.components[t];return n&&n.length?n.splice(0,1)[0]:new e}},M=R(function(e){return e.toLowerCase()}),F=R(function(e){return e.replace(/([A-Z])/,"-$1").toLowerCase()});e.options=k,e.hooks=A,e.rerender=L,e.default={options:k,hooks:A,render:n,rerender:L,h:r,Component:D}});
//# sourceMappingURL=preact.js.map