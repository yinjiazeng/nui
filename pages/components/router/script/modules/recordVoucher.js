Nui.define(['component', '../tpls/recordVoucher', 'template', '{light}/javascript', '{cpns}/placeholder'], function(component, tmpl, tpl, js){
    var module = this;
    var delegate = module.require('delegate');
    return function(target, wrapper, request){

        wrapper.html(tpl.render(tmpl, request))
        delegate({
            elem:wrapper,
            maps:{
                'click b':'b',
                'click a':'c a'
            },
            calls:{
                a:function(){
                    js('destroy', wrapper, 'b')
                    component.static.destroy(wrapper);
                    setTimeout(function(){
                        js('init', wrapper)
                        js('set', wrapper, {
                            isLine:true
                        }) 
                    }, 2000)
                },
                b:function(){
                    alert()
                },
                c:function(){
                    return confirm('哈哈')
                }
            }
        })
    }
})