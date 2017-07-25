Nui.define(['component', '../tpls/recordVoucher', 'template', '{light}/javascript', '{com}/placeholder'], function(component, tmpl, tpl, js, ph){
    var module = this;
    return {
        target:'#recordVoucher',
        path:'/voucher/record',
        template:tmpl,
        onChange:function(){
            delete this.data.a
        },
        onData:function(data){
            this.data.a = data.a;
        },
        events:{
            //'click b':'b',
            'click .empty':'empty',
            'click a':'c a'
        },
        a:function(){
            var that = this;
            component.destroy(that.element);
            setTimeout(function(){
                js.init(that.element)
                ph.init(that.element)
            }, 1000)
        },
        b:function(){
            //alert()
        },
        c:function(){
            //return confirm('哈哈')
        },
        empty:function(){
            ph.value(this.element, '');
        }
    }
})