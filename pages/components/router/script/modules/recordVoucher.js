Nui.define(['../tpls/recordVoucher', 'template', '{light}/javascript', '{cpns}/placeholder'], function(tmpl, tpl){
    var module = this;
    return function(target, container, data){
        $('.m-menu-item a.s-crt').removeClass('s-crt');
        target.addClass('s-crt');
        container.html(tpl.render(tmpl, data))
        container.components();
    }
})