Nui.define(function(){
    return this.renders({
        <% if !cache %>
        这是首页，页面完整url是：<% url %>，路径是：<% path %>
        <% else %>
        这是页面缓存<br>
        <% cache %>
        <% /if %>
    })
})