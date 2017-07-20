Nui.define(['component', '../tpls/recordVoucher', 'template', '{light}/javascript', '{cpns}/placeholder'], function(component, tmpl, tpl, js, ph){
    var module = this;
    var events = module.require('events');
    
    return function(target, wrapper, request){
        return ({
            init:function(){
                wrapper.html(tpl.render(tmpl, request))
                this.event();
            },
            event:function(){
                events.call(this, {
                    element:wrapper,
                    mapping:{
                        //'click b':'b',
                        'click .empty':'empty',
                        'click a':'c a'
                    },
                    callback:{
                        a:function(){
                            //js.destroy(wrapper, 'b')
                            component.destroy(wrapper);
                            setTimeout(function(){
                                js.init(wrapper)
                                ph.init(wrapper)
                            }, 1000)
                        },
                        b:function(){
                            //alert()
                        },
                        c:function(){
                            //return confirm('哈哈')
                        },
                        empty:function(){
                            ph.value(wrapper, '');
                        }
                    }
                })
            }
        }).init()
    }
})