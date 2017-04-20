Nui.define(['component', '../tpls/recordVoucher', 'template', '{light}/javascript', '{cpns}/placeholder'], function(component, tmpl, tpl, js){
    var module = this;
    return function(target, wrapper, data){
        wrapper.html(tpl.render(tmpl, data))
        .on('click', '#aaa', function(){
            js('destroy', wrapper)
            //component.static.trigger(null, 'destroy');
            setTimeout(function(){
                js('init', wrapper)
                js('set', wrapper, {
                    isLine:true
                })
            }, 2000)
            //js('trigger', container, 'destroy')
        })
        .on('click', 'b', function(){
            alert()
        })
    }
})