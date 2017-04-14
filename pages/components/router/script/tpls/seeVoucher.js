Nui.define(function(){
    return this.renders({
        这是查凭证页面，页面完整url是：<% url %>，路径是：<% path %>
        <% if param %>
        <br>
        参数分别是：
        <% each param %>
        <% $index %>=<% $value %>，
        <% /each %>
        <% /if %>
    })
})