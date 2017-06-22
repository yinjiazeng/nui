Nui.define(['component', '../tpls/recordVoucher', 'template', '{light}/javascript', '{cpns}/placeholder'], function(component, tmpl, tpl, js, ph){
    var module = this;
    var events = module.require('events');
    return function(target, wrapper, request){
        return ({
            init:function(){
                wrapper.html(tpl.render(tmpl, request))
                this.event()
            },
            event:function(){
                events.call(this, {
                    elem:wrapper,
                    maps:{
                        //'click b':'b',
                        'click .empty':'empty'
                        //'click a':'c a'
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
                        },
                        empty:function(){
                        ph('value', wrapper, '', 'aaa');
                        //ph('destroy', wrapper)
                        //ph('reset', wrapper)
                            //$('input').placeholder('value', null)
                        }
                    }
                })
            }
        }).init()
    }
})