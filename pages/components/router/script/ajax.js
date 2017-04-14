Nui.define(function(){
    var ajax = $.ajax;
    return function(options){
        if(typeof options === 'string'){
            options = {
                url:options,
                dataType:'json'
            }
        }
        var success = options.success || $.noop;
        var error = options.error || $.noop;
        options.success = function(){
            success.apply(this, arguments)
        }
        options.error = function(){
            error.apply(this, arguments)
        }
        return ajax($.extend(true, {
            cache:false,
            dataType:'json',
            statusCode:{
                '404':function(){

                },
                '502':function(){

                }
            }
        }, options))
    }
})