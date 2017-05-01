Nui.define(['../tpls/seeVoucher', 'template'], function(tmpl, tpl){
    var module = this;
    return function(target, wrapper, request){
        wrapper.html(tpl.render(tmpl, request))
    }
})