!function(t,e,n){if(!t.Nui){var r=t.Nui={type:function(t,e){if(null===t||void 0===t)return!1;if(o(e)){var n=!1;return r.each(e,function(e){if(i(e)(t))return n=!0,!1}),n}return i(e)(t)},each:function(t,e){var n;if(o(t)){var r=t.length;for(n=0;n<r&&!1!==e(t[n],n);n++);}else for(n in t)if(!1===e(t[n],n))break},browser:function(){var t=navigator.userAgent.toLowerCase(),e=/(edge)[ \/]([\w.]+)/.exec(t)||/(chrome)[ \/]([\w.]+)/.exec(t)||/(webkit)[ \/]([\w.]+)/.exec(t)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(t)||/(msie) ([\w.]+)/.exec(t)||t.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(t)||[],n=e[1]||"",r=e[2]||"0",i={};return"mozilla"===n&&/trident/.test(t)&&(n="msie",r="11.0"),n&&(i[n]=!0,i.version=r),i.chrome||i.edge?i.webkit=!0:i.webkit&&(i.safari=!0),i}()},i=function(t){return function(e){return{}.toString.call(e)==="[object "+t+"]"}},o=r.isArray=Array.isArray||i("Array");r.each({trim:/^\s+|\s+$/g,trimLeft:/^\s+/g,trimRight:/\s+$/g},function(t,e){r[e]=function(){return String.prototype[e]?function(t){return t[e]()}:function(e){return e.replace(t,"")}}()});var a=function(){};r.bsie6=r.browser.msie&&r.browser.version<=6,r.bsie7=r.browser.msie&&r.browser.version<=7;var u,s,c=function(t){var e=[],n={};return r.each(t,function(t){n[t]||(n[t]=!0,e.push(t))}),e},l=function(){var t,e,n,i,a,u,s=arguments[0]||{},c=1,p=arguments.length,d=!1;for("boolean"==typeof s&&(d=s,s=arguments[1]||{},c=2),"object"==typeof s||r.type(s,"Function")||(s={}),p===c&&(s={},--c);c<p;c++)if(null!=(a=arguments[c]))for(i in a)t=s[i],n=a[i],s!==n&&(d&&n&&(f(n)||(e=o(n)))?(e?(e=!1,u=t&&o(t)?t:[]):u=t&&f(t)?t:{},s[i]=l(d,u,n)):void 0!==n&&(s[i]=n));return s},f=function(t){return!(!t||!r.type(t,"Object")||t.nodeType)},p=function(t){var e;for(e in t)return!1;return!0},d=location.protocol+"//"+location.host,h=function(){var t=(d+location.pathname).replace(/\\/g,"/"),e=t.lastIndexOf("/");return t.substr(0,e+1)}(),m=function(){return"_module_"+y++},g=e.head||e.getElementsByTagName("head")[0]||e.documentElement,v="onload"in e.createElement("script"),y=0,_={},b={},N=[],x={},j={paths:{},alias:{},maps:{}};if(r.browser.msie&&r.browser.version<=9)var $,w=function(){return s||($&&"interactive"===$.readyState?$:(r.each(g.getElementsByTagName("script"),function(t){if("interactive"===t.readyState)return $=t,!1}),$))};t.console=t.console||{log:a,debug:a,error:a,info:a},r.bsie7&&e.execCommand("BackgroundImageCache",!1,!0),void 0!==typeof jQuery&&(r.win=jQuery(t),r.doc=jQuery(e));var O=function(t,e){var n=this;n.deps=e||[],n.alldeps=n.deps,n.depmodules={},n.id=t[0],n.name=t[1],n.version="",n.suffix=t[2],n.uri=n.id.substr(0,n.id.lastIndexOf("/")+1)};O.prototype.load=function(){var t=this;if(t.loaded||/_module_\d+$/.test(t.id))return t.onload();var n=e.createElement("script"),r=j.maps[t.name]||"";return r&&!/^\?/.test(r)&&(r="?v="+r),t.url=t.id+t.suffix+".js"+(r||t.version),n.src=t.url,n.id=t.id,s=n,g.appendChild(n),s=null,v?n.onload=n.onerror=t.onload(n):n.onreadystatechange=function(){/loaded|complete/.test(n.readyState)&&t.onload(n)()},t.resolve()},O.prototype.resolve=function(){var t=this;return t.alldeps.length&&p(t.depmodules)&&r.each(t.alldeps,function(e){var n=O.getModule(e,[],t.uri);n.version=t.version,t.depmodules[e]=n.loaded?n:n.load()}),t},O.prototype.onload=function(t){var e=this;return t?function(){if(u=t.moduleData||u,t.onload=t.onerror=t.onreadystatechange=null,g.removeChild(t),t=null,e.loaded=!0,u)return r.each(u,function(t,n){t&&(e[n]=t)}),u=null,e.resolve().runcallback()}:(e.loaded=!0,e.resolve().runcallback())},O.prototype.runcallback=function(){var t=this,e=t.getloaded();return e&&r.each(e,function(t){t.root.callback&&t.root.callback(t.modules)}),t},O.prototype.getModules=function(t){var e=this;return t||(t=[]),t.unshift(e.id),e.alldeps.length&&r.each(e.depmodules,function(e){t=e.getModules(t)}),t},O.prototype.getloaded=function(){var t=[],e=[];r.each(N,function(n){var r=c(n.getModules());e=e.concat(r),t.push({root:n,modules:r})}),e=c(e);for(var n;n=e.shift();)if(!_[n].loaded)return!1;return t},O.prototype.setFactory=function(){var t=this,e=t.factory;return e.require=function(e){var n=t.depmodules[e];if(n)return n.module},e.extend=function(t,n,i){var u;if(t){if("string"==typeof t){var s=e.require(t);if(void 0===s)return t;t=s}return o(t)?(u=l(!0,[],t),!0===i&&(o(n)?u=u.concat(n):u.push(n))):r.type(t,"Function")?t.exports?(u=l(!0,{},t.exports,n),u.static._ancestry_names_||(u.static._ancestry_names_=[]),u.static._ancestry_names_.push(t.exports.static._component_name_)):u=l(!0,a,t,n):u=r.type(t,"Object")?l(!0,{},t,n):t,o(i)&&r.type(u,["Object","Function"])&&r.each(i,function(t){if(t.method&&t.content){for(var e,n,i=t.method.split("->"),o=i[i.length-1];(n=i.shift())&&(e=e||u,n!==o);)e=e[n];var a=e[o];if(r.type(a,"Function")){var s=a.toString().replace(/(\})$/,";"+t.content+"$1");a=new Function("return "+s),e[o]=a()}}}),u}},e.imports=a,e.renders=function(t){return t},e.exports={},"component"===t.name&&(e.components=function(t){return t?x[t]:x}),e},O.prototype.exec=function(){var t=this;if(!t.module&&r.type(t.factory,"Function")){var e=t.setFactory(),n=[];r.each(t.deps,function(t){n.push(e.require(t))});var i=e.apply(e,n);if(void 0===i&&(i=e.exports),"component"!==t.name&&r.type(i,"Object")&&r.type(i._init,"Function")){var o={static:{},attr:{},proto:{}};r.each(i,function(t,e){"static"===e?o[e]=t:r.type(t,"Function")?o.proto[e]=t:o.attr[e]=t});var a=t.name.substr(t.name.lastIndexOf("/")+1).replace(/\W/g,"");x[a]?t.module=x[a]:(o.static._component_name_=a,t.module=x[a]=O.createClass(t,o),t.module.exports=i,r.each(["_$fn","_$ready"],function(e){t.module.call(t,e,a,t.module)}))}else t.module=i}return t},O.prototype.loadcss=function(){var t=this;return t.styles&&t.styles.length&&r.each(t.styles,function(n){var r=O.getAttrs(n,t.uri)[0];if(!b[r]){b[r]=!0,r=r+".css"+t.version;var i=e.createElement("link");i.rel="stylesheet",i.href=r,g.appendChild(i)}}),t},O.replacePath=function(t){t=t.replace(/([^:])\/{2,}/g,"$1/"),t=t.replace(/\.{2,}/g,"..");var e=function(t){return/([\w]+\/?)(\.\.\/)/g.test(t)?(t=t.replace(/([\w]+\/?)(\.\.\/)/g,function(t,e,n){return t==e+n?"":t}),e(t)):t};return t=e(t),t.replace(/([\w]+)\/?(\.\/)+/g,"$1/")},O.createClass=function(t,e){var n=function(t){var r=this;l(!0,r,e.attr,{_index:n._index++,_eventList:[]}),r.options=l(!0,{},r.options,n._options,t||{}),r.optionsCache=l(r.options),n._instances[r._index]=r,r.static=null,r._init()};return l(!0,n,e.static),l(!0,n.prototype,e.proto),"function"==typeof n._init&&n._init(),function(){var t=arguments,e=t.length,r=t[0];if("string"!=typeof r)return new n(r);if(!/^_/.test(r)||this instanceof O){var i=n[r];return"function"==typeof i?i.apply(n,Array.prototype.slice.call(t,1)):e>1?n[r]=t[1]:i}}},O.setPath=function(t){var e=/\{([^\{\}]+)\}/.exec(t);if(e){var n=j.paths[e[1]];n&&(t=t.replace(e[0],n).replace(/(\.(js|css))?(\?[\s\S]*)?$/g,""))}return t},O.getAttrs=function(t,e){var n,r=t.replace(/(\.(js|css))?(\?[\s\S]*)?$/g,""),i=r.match(/(-debug|-min)$/g),o="";return i&&(r=r.replace(/(-debug|-min)$/g,""),o=i[0]),t=O.setPath(j.alias[r]||r),/^((https?|file):)?\/\//.test(t)||(n=O.replacePath(h+t),t=(e||h)+t),t=O.replacePath(t),[t,r,o,n]},O.getModule=function(t,e,n){var r=O.getAttrs(t,n),i=r[0];return _[r[1]]||_[i]||_[r[3]]||(_[i]=new O(r,e))},O.load=function(t,e,n){if(r.type(t,"String")&&r.trim(t)){var i=t.match(/(\?[\s\S]+)$/),o=_[O.getAttrs(t)[0]]||O.getModule(n,[t]);i&&(o.version=i[0]),N.push(o),o.callback=function(t){var i=o,a=o.suffix;o.name===n&&r.each(o.depmodules,function(t){i=t,a=t.suffix}),r.each(t,function(t){var e=_[t].exec();a||e.loadcss()}),r.type(e,"Function")&&e.call(r,i.module),delete o.callback},o.load()}},O.getdeps=function(t){var e=[],n=[],i=t.match(/(require|extend|imports)\(('|")[^'"]+\2/g);return i&&r.each(i,function(t){/^(require|extend)/.test(t)?e.push(t.replace(/^(require|extend)|[\('"]/g,"")):n.push(t.replace(/^imports|[\('"]/g,""))}),[c(e),c(n)]},O.define=function(t,e,n){r.type(t,"Function")?(n=t,t=void 0,e=[]):r.type(e,"Function")&&(n=e,r.type(t,"String")?e=[]:(e=t,t=void 0));var i=O.getdeps(n.toString()),o=e.concat(i[0]),a=i[1];if(t&&!_[t]&&!_[O.getAttrs(t)[0]]){var s=O.getModule(t,o);s.deps=e,s.styles=a,s.factory=n,s.loaded=!0,s.load()}if(u={name:t,deps:e,styles:a,alldeps:o,factory:n},void 0!==w){var c=w();c&&(c.moduleData=u)}},r.load=function(t,e){return O.load(t,e,m()),r},r.define=function(){var t=arguments,e=t.length,n=[];!e||1===e&&!r.type(t[0],"Function")?n.push(function(){return t[0]}):2===e&&!r.type(t[1],"Function")||3==e&&!r.type(t[2],"Function")?(n.push(t[0]),n.push(function(){return t[1]})):2===e&&!r.type(t[0],["Array","String"])&&r.type(t[1],"Function")?n.push(t[1]):3===e&&!o(t[1])&&r.type(t[2],"Function")?(n.push(t[0]),n.push(t[2])):n=t,O.define.apply(O,n)},r.config=function(t,e){if(r.type(t,"Object"))j=l({},j,t);else{if(!e||!r.type(t,"String"))return;if(j[t]=e,"paths"!==t)return}var n=j.base||j.paths.base||"";/^((https?|file):)?\/\//.test(n)||(n=j.paths.base=d+n),r.each(j.paths,function(t,e){"base"===e||/^((https?|file):)?\/\//.test(t)||(j.paths[e]=n+"/"+t)})}}}(this,document),Nui.define("util",{regex:{mobile:/^0?(13|14|15|17|18)[0-9]{9}$/,tel:/^[0-9-()（）]{7,18}$/,email:/^\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,idcard:/^\d{17}[\d|x]|\d{15}$/,cn:/^[\u4e00-\u9fa5]+$/,taxnum:/^[a-zA-Z0-9]{15,20}$/},getParam:function(t,e){var n=decodeURI(e||location.href),r={};if(startIndex=n.indexOf("?"),startIndex++>0){var i,o=n.substr(startIndex).split("&");Nui.each(o,function(t){i=t.split("="),r[i[0]]=i[1]})}return"string"==typeof t&&t&&(r=void 0!==(i=r[t])?i:""),r},setParam:function(t,e,n){var r;if(Nui.type(t,"Object"))r=e||location.href,Nui.each(t,function(t,e){t&&(Nui.type(t,"Object")&&(t=tools.getJSON(t)),r=tools.setParam(e,t,r))});else if(r=n||location.href,-1===r.indexOf("?")&&(r+="?"),Nui.type(e,"Object")&&(e=tools.getJSON(e)),-1!==r.indexOf(t+"=")){var i=new RegExp("("+t+"=)[^&]*");r=r.replace(i,"$1"+e)}else{var o="";-1!==r.indexOf("=")&&(o="&"),r+=o+t+"="+e}return r},supportCss3:function(t){var e,n=["webkit","Moz","ms","o"],r=[],i=document.documentElement.style,o=function(t){return t.replace(/-(\w)/g,function(t,e){return e.toUpperCase()})};for(e in n)r.push(o(n[e]+"-"+t));r.push(o(t));for(e in r)if(r[e]in i)return!0;return!1},supportHtml5:function(t,e){return t in document.createElement(e)},location:function(t,e){t&&jQuery('<a href="'+t+'"'+(e?'target="'+(e||"_self")+'"':"")+"><span></span></a>").appendTo("body").children().click().end().remove()},formatDate:function(t,e){if(t=parseInt(t)){if(!e)return t;var n=new Date(t),r={"M":n.getMonth()+1,"d":n.getDate(),"h":n.getHours(),"m":n.getMinutes(),"s":n.getSeconds()};return e=e.replace(/([yMdhms])+/g,function(t,e){var i=r[e];return void 0!==i?(t.length>1&&(i="0"+i,i=i.substr(i.length-2)),i):"y"===e?(n.getFullYear()+"").substr(4-t.length):t})}return"-"},getJSON:function(t){if("undefined"!=typeof JSON){var e=JSON.stringify(t);return Nui.browser.msie&&"8.0"==Nui.browser.version?e.replace(/\\u([0-9a-fA-F]{2,4})/g,function(t,e){return String.fromCharCode(parseInt(e,16))}):e}if(Nui.isArray(t)){var n=[];return Nui.each(t,function(t){n.push(tools.getJSON(t))}),"["+n.join(",")+"]"}if(Nui.type(t,"Object")){var r=[];return Nui.each(t,function(t,e){r.push('"'+e+'":'+tools.getJSON(t))}),"{"+r.join(",")+"}"}return'"'+t+'"'},getData:function(t){var e={result:{},total:0,voidTotal:0},n=t.serializeArray(),r=n.length,i=0;for(i;i<r;i++){var o=Nui.trim(n[i].value);e.all++,o||e.voidTotal++,e.result[n[i].name]=o}return e}}),Nui.define("template",["util"],function(t){var e=function(t,e,r){if(this.tplid=t){if(n[t])return f.call(this,n[t],e,r);var i=document.getElementById(t);if(i&&"SCRIPT"===i.nodeName&&"text/html"===i.type)return f.call(this,n[t]=i.innerHTML,e,r)}return""},n={},r={openTag:"<%",closeTag:"%>"},i={trim:Nui.trim,formatDate:t.formatDate,setParam:t.setParam},o=!!"".trim,a=";$that.out = function(){return $that.code";a=(o?'""'+a:"[]"+a+'.join("")')+"}";var u=function(t){return o?t?function(t){return"$that.code += "+t+";"}:function(t,e){return t+=e}:t?function(t){return"$that.code.push("+t+");"}:function(t,e){return t.push(e),t}},s=u(!0),c=u(),l=function(t,n,r,i){var o=this,a=n.replace(/([^\s])/g,"\\$1"),u=r.replace(/([^\s])/g,"\\$1");return t.replace(new RegExp(a+"\\s*include\\s+['\"]([^'\"]*)['\"]\\s*"+u,"g"),function(t,n){if(n){var r=o[n];return"function"==typeof r&&(r=r()),"string"==typeof r?f.call(o,r,null,i):e(n,null,i)}return""})},f=function(t,e,n){var u=this;if("string"==typeof t){n=n||{};var s=n.openTag||r.openTag,f=n.closeTag||r.closeTag;if(t=l.call(u,t,s,f),e&&"object"==typeof e){Nui.isArray(e)&&(e={$list:e});var h=o?"":[];t=t.replace(/\s+/g," "),Nui.each(t.split(s),function(t,e){t=t.split(f),e>=1?h=c(h,d(Nui.trim(t[0]),!0)):t[1]=t[0],h=c(h,d(t[1].replace(/'/g,"\\'").replace(/"/g,'\\"')))});var m=o?"":[];Nui.each(e,function(t,e){m=c(m,e+"=$data."+e+",")}),o||(h=h.join(""),m=m.join("")),h="var "+m+"$that=this; $that.line=4; $that.code="+a+";\ntry{\n"+h+";}\ncatch(e){\n$that.error(e, $that.line)\n};";try{var g=new Function("$data",h);g.prototype.methods=i,g.prototype.error=p(h,e,u.tplid),t=new g(e).out(),g=null}catch(t){p(h,e,u.tplid)(t)}}return t}return""},p=function(t,e,n){return function(r,i){var o="\n",a=[];t="function anonymous($data){\n"+t+"\n}",t=t.split("\n"),Nui.each(t,function(t,e){a.push(e+1+"      "+t.replace("$that.line++;",""))}),o+="code\n",o+=a.join("\n")+"\n\n",void 0!==typeof JSON&&(o+="data\n",o+=JSON.stringify(e)+"\n\n"),n&&(o+="templateid\n",o+=n+"\n\n"),i&&(o+="line\n",o+=i+"\n\n"),o+="message\n",o+=r.message,console.error(o)}},d=function(t,e){if(!t)return"";var n;return(e?void 0!==(n=h(t,"if"))?"if("+n+"){":void 0!==(n=h(t,"elseif"))?"\n}\nelse if("+n+"){":"else"===t?"\n}\nelse{":"/if"===t?"}":void 0!==(n=h(t,"each ",/\s+/))?"Nui.each("+n[0]+", function("+(n[1]||"$value")+","+(n[2]||"$index")+"){":"/each"===t?"});":void 0!==(n=h(t," | ",/\s*,\s*/))?s("$that.methods."+n[0]+"("+n.slice(1).toString()+")"):0===t.indexOf("var ")?t+";":s(t):s("'"+t+"'"))+"\n$that.line++;"},h=function(t,e,n){var r;if(0===t.indexOf(e)?r="":" | "===e&&t.indexOf(e)>0&&(r=","),void 0!==r)return t=Nui.trimLeft(t.replace(e,r)),n?t.split(n):t};return e.method=function(t,e){i[t]||(i[t]=e)},e.config=function(){var t=arguments;Nui.type(t[0],"Object")?Nui.each(t[0],function(t,e){r[e]=t}):t.length>1&&"string"==typeof t[0]&&(r[t[0]]=t[1])},e.render=f,e}),Nui.define("delegate",function(){return function(t){var e=this,n=t.elem,r=t.maps,i=t.calls;if(t&&n&&r&&i){n instanceof jQuery||(n=jQuery(n));var o,a,u=function(t,e){var n=this,r=$(n);Nui.each(e,function(e,o){if("function"==typeof(e=i[e]))return e.call(n,t,r)})},s=e.constructor&&e.constructor._component_name_;return Nui.each(r,function(t,r){t=Nui.trim(t).split(/\s+/),r=Nui.trim(r).split(/\s+/),o=r.shift().replace(/:/g," "),a=r.join(" "),s?e._on(o,n,a,function(e){u.call(this,e,t)}):n.on(o,a,function(e){u.call(this,e,t)})}),e}}}),Nui.define("component",["template","delegate"],function(tpl,events){var module=this,statics={_index:0,_instances:{},_options:{},_init:null,_jquery:function(t){return t instanceof jQuery?t:jQuery(t)},_getSize:function(t,e,n){var r=0;if(n=n||"border",e=e||"tb","all"===n)return this._getSize(t,e)+this._getSize(t,e,"padding");var i={l:["Left"],r:["Right"],lr:["Left","Right"],t:["Top"],b:["Bottom"],tb:["Top","Bottom"]},o=[{border:{l:["LeftWidth"],r:["RightWidth"],lr:["LeftWidth","RightWidth"],t:["TopWidth"],b:["BottomWidth"],tb:["TopWidth","BottomWidth"]}},{padding:i},{margin:i}];return Nui.each(o,function(i){i[n]&&Nui.each(i[n][e],function(e){var i=parseInt(t.css(n+e));r+=isNaN(i)?0:i})}),r},_$fn:function(t,e){module.components(t)||(jQuery.fn[t]=function(){var n=arguments,r=n[0];return this.each(function(){if("string"!=typeof r)Nui.type(r,"Object")?r.target=this:r={target:this},e(r);else if(r){var i=this.nui[t];if(0!==r.indexOf("_"))if("options"===r)i.set(n[1],n[2]);else{var o=i[r];"function"==typeof o&&o.apply(i,Array.prototype.slice.call(n,1))}}})})},_$ready:function(t,e){e("init",Nui.doc)},options:function(t,e){Nui.type(t,"Object")?jQuery.extend(!0,this._options,t):Nui.type(t,"String")&&(this._options[t]=e)}};return Nui.each(["init","set","reset","destroy"],function(method){statics[method]=function(){var that=this,args=arguments,container=args[0],name=that._component_name_;if(name)if(container&&container instanceof jQuery)if("init"===method){var mod=module.components(name);mod&&container.find("[data-"+name+"-options]").each(function(){if(!this.nui||!this.nui[name]){var elem=jQuery(this),options=elem.data(name+"Options")||{};"string"==typeof options&&(options=eval("("+options+")")),options.target=elem,mod(options)}})}else container.find("[nui_component_"+name+"]").each(function(){var t;this.nui&&(t=this.nui[name])&&t[method]&&t[method].apply(t,Array.prototype.slice.call(args,1))});else Nui.each(that._instances,function(t){"function"==typeof t[method]&&t[method].apply(t,args)});else Array.prototype.unshift.call(args,method),Nui.each(module.components(),function(t){t.apply(t,args)})}}),{static:statics,options:{target:null,id:"",skin:""},_init:jQuery.noop,_exec:jQuery.noop,_getTarget:function(){var t=this;if(!t.target){var e=t.options.target,n=t.constructor;if(!e)return null;e=n._jquery(e);var r="nui_component_"+n._component_name_;t.target=e.attr(r,""),t.target.each(function(){this.nui||(this.nui={}),this.nui[n._component_name_]=t})}return t.target},_tplData:function(){var t=this.options,e=this.constructor,n="nui-"+e._component_name_,r=Nui.trim(t.skin),i=[];return e._ancestry_names_&&Nui.each(e._ancestry_names_,function(t){i.push("nui-"+t),r&&i.push("nui-"+t+"-"+r)}),i.push(n),r&&i.push(n+"-"+r),{className:i.join(" ")}},_event:function(){var t=this._events;return"function"==typeof t&&(!(t=t.call(this))||t instanceof this.constructor)?this:events.call(this,t)},_on:function(t,e,n,r,i){var o=this;"function"==typeof n&&(i=r,r=n,n=e,e=null,n=o.constructor._jquery(n));var a=function(t){return r.call(this,t,jQuery(this))};return e?("string"!=typeof n&&((n=n.selector)||(n=o.options.target)),e.on(t,n,a),i&&e.find(n).trigger(t)):(n.on(t,a),i&&n.trigger(t)),o._eventList.push({dalegate:e,selector:n,type:t,callback:a}),o},_off:function(){var t=this,e=t._eventList;return Nui.each(e,function(t,n){t.dalegate?t.dalegate.off(t.type,t.selector,t.callback):t.selector.off(t.type,t.callback),e[n]=null,delete e[n]}),t._eventList=[],t},_delete:function(){var t=this,e=t.constructor,n="nui_component_"+e._component_name_;t.target.removeAttr(n).each(function(){this.nui&&(this.nui[e._component_name_]=null,delete this.nui[e._component_name_])}),e._instances[t.index]=null,delete e._instances[t.index]},_reset:function(){return this._off(),this.element&&this.element.remove(),this},_tpl2html:function(t,e){return tpl.render.call(this,t,e,{openTag:"<%",closeTag:"%>"})},set:function(t,e){return this._reset(),(t||e)&&(jQuery.isPlainObject(t)?this.options=jQuery.extend(!0,this.options,t):this.options[t]=e,this._exec()),this},get:function(t){return t?this.options[t]:this.options},reset:function(){return this.set(that.optionsCache)},destroy:function(t){t&&this.options.id!==t||(this._reset(),this._delete())}}});