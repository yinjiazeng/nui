Nui.define(function(){
    var module = this;
    return ({
        head:module.renders({
            <div class="f-fl m-head-main">
                <% var data = list[0] %>
                <p class="f-fl name"><% data.buname %></p>
                <p class="f-fl month"><% data.buaddress %></p>
            </div>
        }),
        menu:module.renders({
            <% each menu %>
            <dl class="m-menu-item">
                <dt>
                    <a href="<% $value.path || 'javascript:void(0)' %>"<% if $value.id %> id="<% $value.id %>"<% /if %>>
                        <em><i class="iconfont"></i></em>
                        <span><% $value.name %></span>   
                    </a>
                </dt>
                <% if $value.subs && $value.subs.length %>
                <dd>
                    <% each $value.subs %>
                    <a href="<% $value.path %>"<% if $value.id %> id="<% $value.id %>"<% /if %>>
                        <span><% $value.name %></span>
                    </a>
                    <% /each %>
                </dd>
                <% /if %>
            </dl>
            <% /each %>
        })
    })
})