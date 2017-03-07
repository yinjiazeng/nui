/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 组件基类
 */

Nui.define('component', ['template'], function(tpl){
    return ({
        static:{
            _index:0,
            _instances:{},
            _options:{},
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
                $.each(arr, function(key, val){
                    if(val[attr]){
                        $.each(val[attr][dir], function(k, v){
                            var value = parseInt(selector.css(attr+v));
                            size += isNaN(value) ? 0 : value
                        });
                    }
                });
                return size
            },
            $:function(name, module){
                $[name] = function(options){
                    if(options){
                        return module(options)
                    }
                }
            },
            $fn:function(name, module){
                $.fn[name] = function(){
                    var args = arguments;
                    var options = args[0];
                    return this.each(function(){
                        var that = this;
                        if(!that.nui){
                            that.nui = {}
                        }
                        var me = $(that);
                        var obj = that.nui[name];
                        if(!obj){
                            var opts = options;
                            if(Nui.type(opts, 'Object')){
                                options.target = that
                            }
                            else{
                                opts = {
                                    target:that
                                }
                            }
                            obj = that.nui[name] = module(opts)
                        }

                        if(typeof options === 'string'){
                            if(options.indexOf('_') !== 0){
                                if(options === 'options'){
                                    if(typeof args[1] === 'object'){
                                        obj.set(args[1])
                                    }
                                    else if(typeof args[1] === 'string'){
                                        obj.set(args[1], args[2])
                                    }
                                }
                                else{
                                    var attr = obj[options];
                                    if(typeof attr === 'function'){
                                        attr.apply(obj, Array.prototype.slice.call(args, 1))
                                    }
                                }
                            }
                        }
                    })
                }
            },
            $ready:function(name, module){
                var attr = 'options-'+name;
                var _$fn = $.fn[name];
                var _$ = $[name];
                $('['+ attr +']').each(function(index, item){
                    var ele = $(item);
                    var options = ele.attr(attr)
                    options = options ? eval('('+ ele.attr(attr) +')') : {};
                    options.target = item;
                    if(_$fn){
                        ele[name](options)
                    }
                    else if(_$){
                        $[name](options)
                    }
                    else{
                        module(options)
                    }
                })
            },
            options:function(key, value){
                if(Nui.type(key, 'Object')){
                    $.extend(true, this._options, key)
                }
                else if(Nui.type(key, 'String')){
                    this._options[key] = value
                }
            }
        },
        options:{
            target:null,
            theme:''
        },
        _init:$.noop,
        _exec:$.noop,
        _getTarget:function(){
            return this.options.target ? $(this.options.target) : null
        },
        _on:function(type, target, callback, trigger){
            var that = this;
            target.on(type, callback);
            trigger === true && target[type]();
            that._eventArray.push({
                target:target,
                type:type,
                callback:callback
            });
            return that
        },
        _off:function(){
            var that = this;
            $.each(that._eventArray, function(key, val){
                val && val.target.off(val.type, val.callback)
            });
            that._eventArray = [];
            return that
        },
        _delete:function(){
            var that = this;
            var self = that.constructor;
            var dom = that.target[0];
            if(dom && dom.nui){
                dom.nui[that.constructor._componentname_] = null;
                delete dom.nui[that.constructor._componentname_];
            }
            self._instances[that.index] = null;
            delete self._instances[that.index]
        },
        _reset:function(){
            var that = this;
            that._off();
            if(that.elem){
                that.elem.remove();
            }
            return that
        },
        _tpl2html:function(tpls, data){
            return tpl.render(tpls, data)
        },
        set:function(name, value){
            var that = this;
            that._reset();
            if(name || value){
                if($.isPlainObject(name)){
                    that.options = $.extend(true, that.options, name)
                }
                else{
                    that.options[name] = value
                }
                that._exec()
            }
            return that
        },
        get:function(key){
            var that = this;
            if(!key){
                return that.options
            }
            else{
                return that.options[key]
            }
        },
        reset:function(){
            return this.set(that.optionsCache)
        },
        destroy:function(){
            var that = this;
            that._reset();
            that._delete();
        }
    })
})
