Nui.define(['../tpls/index', 'template'], function(tmpl, tpl){
    var module = this;
    return function(target, container, data){
        $('.m-menu-item a.s-crt').removeClass('s-crt');
        container.html(tpl.render(tmpl, data))
    }
})