Nui.define(['./head', './menu', 'template'], function(head, menu, tpl){
    var module = this;

    if(head.result === 'success'){
        $('.name').text(head.data.username);
        $('.month').text(head.data.date);
    }

    var menus = tpl.render(module.renders({
        <% each $list %>
        <dl class="m-menu-item">
            <dt>
                <a href="<% $value.path || 'javascript:void(0)' %>">
                    <em><i class="iconfont"><% $value.icon %></i></em>
                    <span><% $value.name %></span>   
                </a>
            </dt>
            <% if $value.subs && $value.subs.length %>
            <dd>
                <% each $value.subs val %>
                <a href="<% val.path || 'javascript:void(0)' %>">
                    <span><% val.name %></span>
                </a>
                <% /each %>
            </dd>
            <% /if %>
        </dl>
        <% /each %>
    }), menu);

    $('.m-menu').html(menus)
})