/**
 * @filename component.js
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 组件基类
 */

Nui.define('component', ['template'], function(tpl){
    return ({
        static:{
            index:0,
            box:{},
            options:{},
            $:function(name, module){
                $[name] = function(options){
                    if(options && options.target){
                        return new module(options)
                    }
                }
            },
            $fn:function(name, module){
                $.fn[name] = function(){
                    var args = arguments;
                    var param = args.length > 1 ? Array.prototype.slice.call(args, 1) : [];
                    var options = args[0]||{}
                    return this.each(function(){
                        var that = this;
                        if(!that.nui){
                            that.nui = {}
                        }
                        var me = $(that);
                        var obj = that.nui[name];
                        if(!obj){
                            var opts = options;
                            if(typeof options === 'object'){
                                options.target = that
                            }
                            else{
                                opts = {
                                    target:that
                                }
                            }
                            obj = that.nui[name] = new module(opts)
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
                                    obj[options].apply(obj, param)
                                }
                            }

                        }
                    })
                }
            },
            $ready:function(name, module){
                var attr = name+'-options';
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
                })
            }
        },
        options:{
            target:null,
            theme:''
        },
        _init:$.noop,
        _getTarget:function(){
            return $(this.options.target)
        },
        _on:function(eventType, target, callback, EventInit){
            var that = this;
            target.on(eventType, callback);
            EventInit === true && target[eventType]();
            that.eventArray.push({
                target:target,
                eventType:eventType,
                callback:callback
            })
        },
        _off:function(){
            var that = this;
            $.each(that.eventArray, function(key, val){
                val && val.target.off(val.eventType, val.callback)
            });
            that.eventArray = []
        },
        _delete:function(){
            var nuis = that.target[0].nui;
            if(nuis){
                delete nuis[that.moduleName]
            }
            delete that._self.box[that.index]
        },
        _reset:function(){
            var that = this;
            that._off();
            if(that.elem){
                that.elem.remove();
            }
        },
        _tpl2html:function(html, data){
            return tpl.render(html, data)
        },
        set:function(name, value){
            var that = this;
            that._reset();
            if(name || value){
                if($.isPlainObject(name)){
                    that.options = $.extend(that.options, name)
                }
                else{
                    that.options[name] = value
                }
                that._init()
            }
        },
        get:function(){
            var that = this;
        },
        reset:function(){
            var that = this;
            that.options = $.extend(that.options, that.optionsCache);
            return that
        },
        destroy:function(){
            var that = this;
            that._off();
            that._reset();
            that._delete();
        }
    })
})
