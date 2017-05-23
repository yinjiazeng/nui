Nui.define(['../tpls/index', 'template', '../menu'], function(tmpl, tpl, menu){
    var module = this;
    var router = module.require('{cpns}/router');
    var delegate = module.require('delegate');
    module.imports('../../style/index')
    return function(target, wrapper, request){
        wrapper.html(tpl.render(tmpl, menu));
        delegate({
            elem:wrapper,
            maps:{
                'click a':'seturl'
            },
            calls:{
                seturl:function(e, elem){
                    router('load', elem.attr('rel'))
                }
            }
        })
    }
})