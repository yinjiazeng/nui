Nui.define(['template', './data'], function(tpl, data){
    var module = this;
    tpl.method('filter', function(type){
        return data[type]
    })
    return ({
        render:function(target, container, data){
            container.html(tpl.render(module.renders({
                <% if param.id === undefined %>
                <p>下面是<% filter | param.type %>新闻列表：</p>
                <ul>
                    <li class="e-mt10"><a class="detail" href="/news/<% param.type %>/1111">1111111111111111111</a></li>
                    <li class="e-mt10"><a class="detail" href="/news/<% param.type %>/2222">222222222222222222</a></li>
                    <li class="e-mt10"><a class="detail" href="/news/<% param.type %>/3333">3333333333333333</a></li>
                    <li class="e-mt10"><a class="detail" href="/news/<% param.type %>/4444">4444444444444444444</a></li>
                </ul>
                <% else %>
                <% var cols = new Array(8), lines = new Array(20) %>
                <% each lines %>
                <p>
                    <% each cols %>
                    <% param.id %>
                    <% /each %>
                </p>
                <% /each %>
                <% /if %>
            }), data))
        }
    })
})