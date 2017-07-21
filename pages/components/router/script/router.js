Nui.define(['{cpns}/router'], function(router){
    var module = this;

    return function(){

        router.config({
            container:'.g-main',
            onAfter:function(){
                $('.m-menu-item a.s-crt').removeClass('s-crt');
                $(this.target).addClass('s-crt');
            }
        })

        router(module.require('./modules/index'))

        router(module.require('./modules/recordVoucher'))

        /*router({
            target:'#seeVoucher',
            path:'{list}',
            wrapper:false,
            level:2,
            onChange:module.require('./modules/seeVoucher')
        })*/

        router.start()
    }
})