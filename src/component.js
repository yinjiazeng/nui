/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 组件基类
 */

;!(function(window, undefined){
    if(typeof jQuery === 'undefined'){
        return
    }
    Nui.define('component', ['template', 'events'], function(tpl, events){
        var module = this;
        var callMethod = function(method, args, obj){
            //实参大于形参，最后一个实参表示id
            if(args.length > method.length){
                var id = args[method.length];
                if(id && obj.options.id !== id && obj.__id !== id){
                    return
                }
            }
            method.apply(obj, args)
        }
        //去除IE67按钮点击黑边
        if(Nui.bsie7){
            Nui.doc.on('focus', 'button, input[type="button"]', function(){
                this.blur()
            })
        }
        /**
         * 单和双下划线开头表示私有方法或者属性，只能在内部使用，
         * 单下划线继承后可重写或修改，双下划线为系统预置无法修改
         * 系统预置属性方法：__id, __instances, __parent, __component_name, __setMethod
         */
        var statics = {
            //实例对象唯一标记
            __id:0,
            //实例对象容器
            __instances:{},
            /*
            * 将实例方法接口设置为静态方法，这样可以操作多个实例，
            * 默认有 init, option, reset, destroy
            * init表示初始化组件，会查询容器内包含属性为 data-组件名-options的dom元素，并调用组件
            */
            __setMethod:function(apis, components){
                var self = this;
                Nui.each(apis, function(val, methodName){
                    if(self[methodName] === undefined){
                        self[methodName] = function(){
                            var self = this, args = arguments, container = args[0], name = self.__component_name;
                            if(name && name !== 'component'){
                                if(container && container instanceof jQuery){
                                    if(methodName === 'init'){
                                        var mod = components[name];
                                        if(mod){
                                            container.find('[data-'+name+'-options]').each(function(){
                                                //不能重复调用
                                                if(this.nui && this.nui[name]){
                                                    return
                                                }
                                                var elem = jQuery(this);
                                                var options = elem.data(name+'Options') || {};
                                                if(typeof options === 'string'){
                                                    options = eval('('+ options +')')
                                                }
                                                options.target = elem;
                                                mod(options)
                                            })
                                        }
                                    }
                                    else{
                                        container.find('[nui_component_'+ name +']').each(function(){
                                            var obj, method;
                                            if(this.nui && (obj = this.nui[name]) && typeof (method = obj[methodName]) === 'function'){
                                                callMethod(method, Array.prototype.slice.call(args, 1), obj)
                                            }
                                        })
                                    }
                                }
                                else{
                                    Nui.each(self.__instances, function(obj){
                                        var method = obj[methodName];
                                        if(typeof method === 'function'){
                                            callMethod(method, args, obj)
                                        }
                                    })
                                }
                            }
                            else{
                                Nui.each(components, function(v, k){
                                    if(k !== 'component' && typeof v[methodName] === 'function'){
                                        v[methodName].apply(v, args)
                                    }
                                })
                            }
                        }
                    }
                })
                return self
            },
            //对所有实例设置默认选项
            _options:{},
            //创建组件模块时会调用一次，可用于在document上绑定事件操作实例
            _init:jQuery.noop,
            _jquery:function(elem){
                if(elem instanceof jQuery){
                    return elem
                }
                return jQuery(elem)
            },
            _getSize:function(selector, dir, attr){
                var size = 0;
                attr = attr || 'border';
                dir = dir || 'tb';
                if(attr === 'all'){
                    return (this._getSize(selector, dir) + 
                           this._getSize(selector, dir, 'padding') +
                           this._getSize(selector, dir, 'margin'))
                }
                var group = {
                    l:['Left'],
                    r:['Right'],
                    lr:['Left', 'Right'],
                    t:['Top'],
                    b:['Bottom'],
                    tb:['Top', 'Bottom']
                }
                var arr = [{
                    border:{
                        l:['LeftWidth'],
                        r:['RightWidth'],
                        lr:['LeftWidth', 'RightWidth'],
                        t:['TopWidth'],
                        b:['BottomWidth'],
                        tb:['TopWidth', 'BottomWidth']
                    }
                }, {
                    padding:group
                }, {
                    margin:group
                }];
                Nui.each(arr, function(val){
                    if(val[attr]){
                        Nui.each(val[attr][dir], function(v){
                            var value = parseFloat(selector.css(attr+v));
                            size += isNaN(value) ? 0 : value
                        });
                    }
                });
                return size
            },
            _$fn:function(name, mod){
                jQuery.fn[name] = function(){
                    var args = arguments;
                    var options = args[0];
                    return this.each(function(){
                        if(typeof options !== 'string'){
                            if(Nui.type(options, 'Object')){
                                options.target = this
                            }
                            else{
                                options = {
                                    target:this
                                }
                            }
                            mod(options);
                        }
                        else if(options){
                            var object;
                            if(this.nui && (object=this.nui[name]) && options.indexOf('_') !== 0){
                                if(options === 'options'){
                                    object.set(args[1], args[2])
                                }
                                else{
                                    var attr = object[options];
                                    if(typeof attr === 'function'){
                                        attr.apply(object, Array.prototype.slice.call(args, 1))
                                    }
                                }
                            }
                        }
                    })
                }
            },
            _$ready:function(name, mod){
                if(typeof this.init === 'function'){
                    this.init(Nui.doc)
                }
            },
            config:function(){
                var args = arguments;
                var len = args.length;
                var attr = args[0];
                if(Nui.type(attr, 'Object')){
                    return this._options = jQuery.extend(true, this._options, attr)
                }
                else if(Nui.type(attr, 'String')){
                    if(args.length === 1){
                        return this._options[attr]
                    }
                    return this._options[attr] = args[1]
                }
                
            }
        }

        return ({
            static:statics,
            options:{
                target:null,
                id:'',
                skin:'',
                onInit:null,
                onReset:null,
                onDestroy:null
            },
            _template:{},
            _init:jQuery.noop,
            _exec:jQuery.noop,
            _getTarget:function(){
                var self = this;
                if(!self.target){
                    var target = self.options.target;
                    var _class = self.constructor;
                    if(!target){
                        return null
                    }
                    target = _class._jquery(target);
                    var attr = 'nui_component_'+_class.__component_name;
                    self.target = target.attr(attr, '');
                    self.target.each(function(){
                        if(!this.nui){
                            this.nui = {};
                        }
                        this.nui[_class.__component_name] = self
                    })
                }
                return self.target
            },
            _tplData:function(data){
                var opts = this.options, 
                    _class = this.constructor,
                    name = 'nui-' + _class.__component_name, 
                    skin = Nui.trim(opts.skin),
                    getName = function(_class, arrs){
                        if(_class.__parent){
                            var _pclass = _class.__parent.constructor;
                            var _name = _pclass.__component_name;
                            if(_name !== 'component'){
                                if(skin){
                                    arrs.unshift('nui-'+_name+'-'+skin);
                                }
                                arrs.unshift('nui-'+_name);
                                return getName(_pclass, arrs)
                            }
                        }
                        return arrs
                    }, className = getName(_class, []);

                className.push(name);
                if(skin){
                    className.push(name+'-'+skin)
                }
                if(opts.id){
                    className.push(_class.__component_name + '-' + opts.id)
                }
                if(!data){
                    data = {}
                }
                data.className = className.join(' ');
                return data
            },
            _event:function(){
                return events.call(this)
            },
            _on:function(type, dalegate, selector, callback, trigger){
                var self = this;
                if(typeof selector === 'function'){
                    trigger = callback;
                    callback = selector;
                    selector = dalegate;
                    dalegate = null;
                    selector = self.constructor._jquery(selector)
                }

                var _callback = function(e){
                    return callback.call(this, e, jQuery(this))
                }

                if(dalegate){
                    if(typeof selector !== 'string'){
                        selector = selector.selector;
                        if(!selector){
                            selector = self.options.target
                        }
                    }
                    dalegate.on(type, selector, _callback);
                    if(trigger){
                        dalegate.find(selector).trigger(type)
                    }
                }
                else{
                    selector.on(type, _callback);
                    if(trigger){
                        selector.trigger(type)
                    }
                }

                self._eventList.push({
                    dalegate:dalegate,
                    selector:selector,
                    type:type,
                    callback:_callback
                });

                return self
            },
            _off:function(){
                var self = this, _eventList = self._eventList;
                Nui.each(_eventList, function(val, key){
                    if(val.dalegate){
                        val.dalegate.off(val.type, val.selector, val.callback)
                    }
                    else{
                        val.selector.off(val.type, val.callback)
                    }
                    _eventList[key] = null;
                    delete _eventList[key]
                });
                self._eventList = [];
                return self
            },
            _delete:function(){
                var self = this, _class = self.constructor;
                if(self.target){
                    var attr = 'nui_component_'+_class.__component_name;
                    self.target.removeAttr(attr).each(function(){
                        if(this.nui){
                            this.nui[_class.__component_name] = null;
                            delete this.nui[_class.__component_name];
                        }
                    })
                }
                _class.__instances[self.__id] = null;
                delete _class.__instances[self.__id]
            },
            _reset:function(){
                this._off();
                if(this.element){
                    this.element.remove();
                    this.element = null;
                }
                return this
            },
            _tpl2html:function(id, data){
                var opts = {
                    openTag:'<%',
                    closeTag:'%>'
                }
                if(arguments.length === 1){
                    return tpl.render(this._template, id, opts)
                }
                return tpl.render.call(this._template, this._template[id], data, opts)
            },
            option:function(option, value){
                var flag = false;
                if(jQuery.isPlainObject(option)){
                    jQuery.extend(true, this.options, option);
                    flag = true
                }
                else if(option && typeof option === 'string'){
                    this.options[option] = value;
                    flag = true
                }
                if(flag){
                    this._reset();
                    this._exec();
                }
                return this
            },
            reset:function(){
                this.option(this._defaultOptions);
                if(typeof this.options.onReset === 'function'){
                    this.options.onReset.call(this)
                }
                return this;
            },
            destroy:function(){
                this._delete();
                this._reset();
                if(typeof this.options.onDestroy === 'function'){
                    this.options.onDestroy.call(this)
                }
            }
        })
    })
})(this);
