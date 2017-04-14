Nui.define(['../tpls/index', 'template', '../menu'], function(tmpl, tpl, menu){
    var module = this;
    module.imports('../../style/index')
    return function(target, container, data){
        $('.m-menu-item a.s-crt').removeClass('s-crt');
        container.html(tpl.render(tmpl, menu))
    }
})