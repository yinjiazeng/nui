Nui.define('events', function(){
    return function(opts){
        var that = opts || this,
            self = that.constructor,
            isComponent = self && self.__component_name,
            elem = this.element || that.element || Nui.doc, 
            events = isComponent ? that._events : that.events;
            
        if(!elem || !events){
            return that
        }

        if(typeof events === 'function'){
            events = events.call(that)
        }

        if(!(elem instanceof jQuery)){
            elem = jQuery(elem)
        }

        var evt, ele, ret;
        var callback = function(e, elem, cbs){
            if(typeof cbs === 'function'){
                cbs.call(that, e, elem);
            }
            else{
                Nui.each(cbs, function(cb, i){
                    cb = that[cb];
                    if(typeof cb === 'function'){
                        return ret = cb.call(that, e, elem, ret);
                    }
                })
            }
        }

        Nui.each(events, function(cbs, evts){
            if(cbs && (typeof cbs === 'string' || typeof cbs === 'function')){
                if(typeof cbs === 'string'){
                    cbs = Nui.trim(cbs).split(/\s+/);
                }
                evts = Nui.trim(evts).split(/\s+/);
                // keyup:kupdown:focus a => elem.on('keyup kupdown focus', 'a', callback)
                evt = evts.shift().replace(/:/g, ' ');
                ele = evts.join(' ');
                //组件内部处理
                if(isComponent){
                    that._on(evt, elem, ele, function(e){
                        callback(e, $(this), cbs)
                    })
                }
                else{
                    elem.on(evt, ele, function(e){
                        callback(e, $(this), cbs)
                    })
                }
            }
        })
        return that
    }
})