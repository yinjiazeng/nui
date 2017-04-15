Nui.define(['component', '../tpls/recordVoucher', 'template', '{light}/javascript', '{cpns}/placeholder'], function(component, tmpl, tpl, js, p){
    var module = this;
    return function(target, container, data){
        $('.m-menu-item a.s-crt').removeClass('s-crt');
        target.addClass('s-crt');
        container.html(tpl.render(tmpl, data)).find('#aaa').click(function(){
            //js('trigger', container, 'destroy')
            component.static.trigger(container, 'destroy');
            setTimeout(function(){
                js('trigger', container, 'init')
            }, 5000)
            //js('trigger', container, 'destroy')
        })
        component.static.trigger(container, 'init')
    }
})