Nui.define(['component', '../tpls/recordVoucher', 'template', '{light}/javascript'], function(component, tmpl, tpl, js){
    var module = this;
    return function(target, container, data){
        console.log(data)
        $('.m-menu-item a.s-crt').removeClass('s-crt');
        target.addClass('s-crt');
        container.html(tpl.render(tmpl, data)).find('#aaa').click(function(){
            js('destroy', container)
            //component.static.trigger(null, 'destroy');
            setTimeout(function(){
                js('init', container)
                js('set', container, {
                    isLine:true
                })
            }, 2000)
            //js('trigger', container, 'destroy')
        })
        component.static.init(container)
    }
})