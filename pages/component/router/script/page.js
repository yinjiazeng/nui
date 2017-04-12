Nui.define(['{cpns}/router', 'util', 'template'], function(router, util, tpl){
    var renders = this.renders;

    var render = function(target, data){
        data.text = target.text();
        $('.content').html(tpl.render(renders({
            这是<% text %><% if path === '/photo/nui/' && param.id %>子分类页面<%/if%> ，页面url是<% path %>，
            <% if !param.id && path !== '/home' %>
            <a href="<% path %>/1111/" class="child f-cblue">子页面</a>
            <% if path === '/photo' %>
            <a href="<% path %>/nui/" id="nui" class="f-cblue"> 子分类</a>
            <% /if %>
            <% /if %>
            <% if param.id %>
            这是子页面，传递的参数是 
            <% each param %>
                <% $index %>：<% $value %>，
            <% /each %>
            <% /if %>
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
        path:'/news/',
        onRender:render
    })

    router({
        target:'.child',
        path:'/news/:id/',
        onRender:render
    })

    router({
        target:'#photo',
        path:'/photo/',
        onRender:render
    })

    router({
        target:'.child',
        path:'/photo/:id/',
        onRender:render
    })

    router({
        target:'#nui',
        path:'/photo/nui/',
        onRender:render
    })

    router({
        target:'.child',
        path:'/photo/nui/:id/',
        onRender:render
    })

    router({
        target:'#about',
        path:'/about/',
        onRender:render
    })

    router('trigger');
})