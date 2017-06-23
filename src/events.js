Nui.define('events', function(){
    return function(opts){
        var that = this, opts = opts || {},
            elem = opts.element || that.element, 
            maps = opts.mapping || that.mapping, 
            calls = opts.callback || that.callback;
        if(!opts || !elem || !maps || !calls){
            return
        }
        if(!(elem instanceof jQuery)){
            elem = jQuery(elem)
        }
        var evt, ele, self = that.constructor;
        var callback = function(e, elem, cbs){
            Nui.each(cbs, function(cb, i){
                cb = calls[cb];
                if(typeof cb === 'function'){
                    return cb.call(that, e, elem)
                }
            }) 
        }

        Nui.each(maps, function(cbs, arrs){
            cbs = Nui.trim(cbs).split(/\s+/);
            arrs = Nui.trim(arrs).split(/\s+/);
            // keyup:kupdown:focus a => elem.on('keyup kupdown focus', 'a', callback)
            evt = arrs.shift().replace(/:/g, ' ');
            ele = arrs.join(' ');
            if(self && self.__component_name){
                that._on(evt, elem, ele, function(e){
                    callback(e, $(this), cbs)
                })
            }
            else{
                elem.on(evt, ele, function(e){
                    callback(e, $(this), cbs)
                })
            }
        })
        return that
    }
})