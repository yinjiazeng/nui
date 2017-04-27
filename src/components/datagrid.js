Nui.define(['component'], function(component){
    var module = this;
    var paging = module.require('./paging');
    return module.extend(component, {
        static:{
            _init:function(){

            }
        },
        options:{
            url:'',
            type:'GET',
            data:null,
            fields:null
        },
        _init:function(){
            this._exec()
        },
        _exec:function(){
            var that = this, opts = that.options, target = that._getTarget();
            if(target && opts.fields && opts.fields.length){
                that.fields = opts.fields;
                if(!Nui.type(opts.fields[0], 'Array')){
                    that.fields = [that.fields]
                }
            }
        }
    })
})