Nui.define(['../tpls/index', 'template', '../menu'], function(tmpl, tpl, menu){
    var module = this;
    module.imports('../../style/index')
    return function(target, wrapper, request){
        wrapper.html(tpl.render(tmpl, menu))
    }
})