Nui.define(['./placeholder'], function(placeholder){
    return this.extend(placeholder, {
        _options:{
            /**
             * @func 是否显示清除按钮
             * @type <Boolean>
             */
            clear:false,
            /**
             * @func 是否显示查看密码按钮
             * @type <Boolean>
             */
            reveal:false
        },
        _template:{

        },
        _events:{
            
        },
        _condition:function(){
            var opts = this._options;
            return placeholder._condition.call(this) || opts.clear || opts.reveal
        },
        _createClear:function(){

        },
        _createReveal:function(){
            
        }
    })
}); 