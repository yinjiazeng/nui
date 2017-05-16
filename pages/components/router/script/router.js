Nui.define(['{cpns}/router'], function(router){
    var module = this;

    return function(){
        router('alias', {
            'list':'/voucher/list/:nickname/:career'
        })

        router('options', {
            container:'.g-main',
            //wrapper:true,
            onAfter:function(elem){
                $('.m-menu-item a.s-crt').removeClass('s-crt');
                elem.addClass('s-crt');
            }
        })

        router({
            target:'#index',
            enter:true,
            path:'/index',
            onRender:module.require('./modules/index')
        })

        router({
            target:'#recordVoucher',
            path:'/voucher/record',
            wrapper:false,
            onBefore:function(target, render){
                if(confirm('点击取消不会切换页面')){
                    render()
                }
                return false;
            },
            onRender:module.require('./modules/recordVoucher')
        })

        router({
            target:'#seeVoucher',
            path:'{list}',
            wrapper:false,
            splitLevel:2,
            onRender:module.require('./modules/seeVoucher')
        })

        router('init')
    }
})