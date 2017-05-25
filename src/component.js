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
    Nui.define('component', ['template', 'delegate'], function(tpl, events){
        var module = this;

        var statics = {
            _index:0,
            _instances:{},
            _options:{},
            _init:null,
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
                    return this._getSize(selector, dir) + this._getSize(selector, dir, 'padding')
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
                            var value = parseInt(selector.css(attr+v));
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
                mod('init', Nui.doc)
            },
            options:function(key, value){
                if(Nui.type(key, 'Object')){
                    jQuery.extend(true, this._options, key)
                }
                else if(Nui.type(key, 'String')){
                    this._options[key] = value
                }
            }
        }

        statics.setMethod = function(method, object){
            if(!object){
                object = {}
            }
            if(!method){
                return object
            }
            object[method] = function(){
                var that = this, args = arguments, container = args[0], name = that._component_name_;
                if(name && name !== 'component'){
                    if(container && container instanceof jQuery){
                        if(method === 'init'){
                            var mod = module.components(name);
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
                                var object;
                                if(this.nui && (object = this.nui[name]) && object[method]){
                                    object[method].apply(object, Array.prototype.slice.call(args, 1))
                                }
                            })
                        }
                    }
                    else{
                        Nui.each(that._instances, function(val){
                            if(typeof val[method] === 'function'){
                                val[method].apply(val, args)
                            }
                        })
                    }
                }
                else{
                    Array.prototype.unshift.call(args, method);
                    Nui.each(module.components(), function(v, k){
                        v.apply(v, args)
                    })
                }
            }
            return object
        }

        Nui.each(['init', 'set', 'reset', 'destroy'], function(method){
            statics.setMethod(method, statics)
        })

        return ({
            static:statics,
            options:{
                target:null,
                id:'',
                skin:''
            },
            _template:{},
            _init:jQuery.noop,
            _exec:jQuery.noop,
            _getTarget:function(){
                var that = this;
                if(!that.target){
                    var target = that.options.target;
                    var self = that.constructor;
                    if(!target){
                        return null
                    }
                    target = self._jquery(target);
                    var attr = 'nui_component_'+self._component_name_;
                    that.target = target.attr(attr, '');
                    that.target.each(function(){
                        if(!this.nui){
                            this.nui = {};
                        }
                        this.nui[self._component_name_] = that
                    })
                }
                return that.target
            },
            _tplData:function(){
                var opts = this.options, 
                    self = this.constructor,
                    name = 'nui-' + self._component_name_, 
                    skin = Nui.trim(opts.skin),
                    getName = function(_class, arrs){
                        if(_class._parent){
                            var _pclass = _class._parent('class');
                            var _name = _pclass._component_name_;
                            if(_name !== 'component'){
                                if(skin){
                                    arrs.unshift('nui-'+_name+'-'+skin);
                                }
                                arrs.unshift('nui-'+_name);
                                return getName(_pclass, arrs)
                            }
                        }
                        return arrs
                    }, className = getName(self, []);

                className.push(name);
                if(skin){
                    className.push(name+'-'+skin)
                }
                return ({
                    className:className.join(' ')
                })
            },
            _event:function(){
                var _events = this._events;
                if(typeof _events === 'function'){
                    _events = _events.call(this);
                    if(!_events || _events instanceof this.constructor){
                        return this
                    }
                }
                return events.call(this, _events)
            },
            _on:function(type, dalegate, selector, callback, trigger){
                var that = this;
                if(typeof selector === 'function'){
                    trigger = callback;
                    callback = selector;
                    selector = dalegate;
                    dalegate = null;
                    selector = that.constructor._jquery(selector)
                }

                var _callback = function(e){
                    return callback.call(this, e, jQuery(this))
                }

                if(dalegate){
                    if(typeof selector !== 'string'){
                        selector = selector.selector;
                        if(!selector){
                            selector = that.options.target
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

                that._eventList.push({
                    dalegate:dalegate,
                    selector:selector,
                    type:type,
                    callback:_callback
                });

                return that
            },
            _off:function(){
                var that = this, _eventList = that._eventList;
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
                that._eventList = [];
                return that
            },
            _delete:function(){
                var that = this;
                var self = that.constructor;
                var attr = 'nui_component_'+self._component_name_;
                that.target.removeAttr(attr).each(function(){
                    if(this.nui){
                        this.nui[self._component_name_] = null;
                        delete this.nui[self._component_name_];
                    }
                })
                self._instances[that.index] = null;
                delete self._instances[that.index]
            },
            _reset:function(){
                this._off();
                if(this.element){
                    this.element.remove();
                }
                return this
            },
            _tpl2html:function(name, data){
                return tpl.render.call(this._template, this._template[name], data, {
                    openTag:'<%',
                    closeTag:'%>'
                })
            },
            set:function(name, value){
                this._reset();
                if(name || value){
                    if(jQuery.isPlainObject(name)){
                        this.options = jQuery.extend(true, this.options, name)
                    }
                    else{
                        this.options[name] = value
                    }
                    this._exec()
                }
                return this
            },
            get:function(key){
                if(!key){
                    return this.options
                }
                else{
                    return this.options[key]
                }
            },
            reset:function(){
                return this.set(that.optionsCache)
            },
            destroy:function(id){
                if(id && this.options.id !== id){
                    return
                }
                this._reset();
                this._delete();
            }
        })
    })
})(this);
