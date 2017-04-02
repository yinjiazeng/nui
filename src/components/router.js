/**
 * @author Aniu[2017-02-27 23:46]
 * @update Aniu[2017-02-27 23:46]
 * @version 1.0.1
 * @description 路由
 */

Nui.define(function(){
    return this.extend('component', {
        options:{
            /**
             * @func 路由地址
             * @type <String>
             */
            href:null
        },
        _init:function(){
            var that = this;
            that.target = that._getTarget();
            return that._event()
        },
        _event:function(){
            var that = this, opts = that.options;
            that._on('click', that.target, function(e){
                if(opts.href !== null){
                    
                }
            })
        },
        _reset:function(){
            var that = this;

        }
    })
})
