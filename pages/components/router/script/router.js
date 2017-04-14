Nui.define(['{cpns}/router'], function(router){
    var module = this;

    router({
        target:'#index',
        enter:true,
        path:'/index',
        container:'.g-main',
        onRender:module.require('./modules/index')
    })

    router({
        target:'#recordVoucher, #recordVoucherIndex',
        path:'/voucher/record',
        container:'.g-main',
        onRender:module.require('./modules/recordVoucher')
    })

    router({
        target:'#seeVoucher, #seeVoucherIndex',
        path:'/voucher/list/:nickname/:career',
        container:'.g-main',
        split:true,
        onRender:module.require('./modules/seeVoucher')
    })

    return router
})