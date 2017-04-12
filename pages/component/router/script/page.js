Nui.define(['{cpns}/router'], function(router){
    var module = this;

    router({
        target:'#home',
        path:'/home/',
        enter:true,
        onRender:module.require('./home').render
    })

    router({
        target:'#news',
        path:'/news/',
        onRender:module.require('./news').render
    })

    router({
        target:'.detail',
        path:'/news/:type/:id/',
        onRender:module.require('./detail').render
    })

    router('trigger');
})