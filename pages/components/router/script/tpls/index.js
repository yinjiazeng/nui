Nui.define(function(){
    return this.renders({
        <div class="m-main ui-bgw">
            <h3 class="ui-bdb ui-fcb">
                <em class="ui-animate ui-animate-fadeInDown ui-animate-fadeInDown-run1">欢</em>
                <em class="ui-animate ui-animate-fadeInDown ui-animate-fadeInDown-run2">迎</em>
                <em class="ui-animate ui-animate-fadeInDown ui-animate-fadeInDown-run3">使</em>
                <em class="ui-animate ui-animate-fadeInDown ui-animate-fadeInDown-run4">用</em>
                <em class="ui-animate ui-animate-fadeInDown ui-animate-fadeInDown-run5">云</em>
                <em class="ui-animate ui-animate-fadeInDown ui-animate-fadeInDown-run6">记</em>
                <em class="ui-animate ui-animate-fadeInDown ui-animate-fadeInDown-run7">账</em>
                <em class="ui-animate ui-animate-fadeInDown ui-animate-fadeInDown-run8">！</em>
            </h3>
            <ul>
                <% each $list %>
                <% if $value.index %>
                <li>
                    <a href="javascript:void(0)" rel="<% $value.path %>" id="<% $value.id %>Index">
                        <em><i class="iconfont ui-animate">&#xe62a;</i></em>
                        <span class="ui-animate"><% $value.name %></span>
                    </a>
                </li>
                <% /if %>
                <% /each %>
            </ul>
        </div>
    })
})