Nui.define(['{cpns}/router', 'util', 'template'], function(router, util, tpl){
    var renders = this.renders;

    var render = function(target, data){
        data.text = target.text();
        $('.content').html(tpl.render(renders({
            这是<% text %> ，页面url是<% path %>，传递的参数是 <% each param %><% $index %>：<% $value %>，<% /each %>
        }), data))
    }

    router({
        target:'#home',
        path:'/home/',
        enter:true,
        onRender:render
    })

    router({
        target:'#news',
        path:'/news/:newsid/',
        onRender:render
    })

    router({
        target:'#photo',
        path:'/photo/:pid/:type/',
        onRender:render
    })

    router({
        target:'#about',
        path:'/about/:id/',
        onRender:render
    })

})