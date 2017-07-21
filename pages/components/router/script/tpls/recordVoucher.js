Nui.define(function(){
    return {
        layout:this.renders({
            <input type="text" placeholder="aaaaaaaaaaa" value="11" data-placeholder-options='{"color":"#f60", "animate":true}' />
            <input type="text" placeholder="111" data-placeholder-options='{"color":"#f60", "animate":true, "id":"aaa"}' />
            <input type="text" placeholder="222" data-placeholder-options='{"color":"#f60", "animate":true}' />
            <input type="text" placeholder="333" data-placeholder-options='{"color":"#f60", "animate":true, "id":"aaa"}' />
            <div class="empty">还原</div>
            <script type="text/highlight" data-javascript-options="{id:'b'}">
            var a = 1;
            var b = 2;
            </script> 
            <div class="box nui-router-back">返回<%a??%><%params.a??%></div>
            <a id="aaa">aaaaaaaaaaa</a>
            <%include 'show'%>
        }),
        show:this.renders({
            1111111111111111112
        })
    }
})