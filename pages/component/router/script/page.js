Nui.define(['{cpns}/router'], function(router){
    var module = this;
    var container = $('.content');
    router({
        target:'#home',
        path:'/home/',
        enter:true,
        container:container,
        onRender:module.require('./home').render
    })

    router({
        target:'#news',
        path:'/news/',
        container:container,
        onRender:module.require('./news').render
    })

    router({
        target:'.detail',
        path:'/news/:type/:id/',
        container:container,
        onBefore:function(target){
            if(target.text() === '娱乐'){
                alert('该板块尚未开通')
                return false
            }
        },
        onRender:module.require('./detail').render
    })

    router('trigger');
})