Nui.define(['template', './data'], function(tpl, data){
    var module = this;
    return ({
        render:function(target, container, result){
            result.data = data;
            container.html(tpl.render(module.renders({
                <p>下面是新闻分类：</p>
                <% each data %>
                <a href="/news/<% $index %>" class="detail e-ml10"><% $value %></a>
                <% /each %>
            }), result))
        }
    })
})