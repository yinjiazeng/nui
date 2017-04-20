Nui.define(['../tpls/seeVoucher', 'template'], function(tmpl, tpl){
    var module = this;
    return function(target, wrapper, data){
        wrapper.html(tpl.render(tmpl, data))
    }
})