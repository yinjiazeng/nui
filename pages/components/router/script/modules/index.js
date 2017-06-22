Nui.define(['../tpls/index', 'template', '../menu'], function(tmpl, tpl, menu){
    var module = this;
    var router = module.require('{cpns}/router');
    var events = module.require('events', function(d){
        
    });
    module.imports('../../style/index')
    return function(target, wrapper, request){
        wrapper.html(tpl.render(tmpl, menu));
        events({
            elem:wrapper,
            maps:{
                'click a':'seturl'
            },
            calls:{
                seturl:function(e, elem){
                    router('href', elem.attr('rel'))
                }
            }
        })
    }
})