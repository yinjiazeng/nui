Nui.define(['../tpls/index', 'template', '../menu'], function(tmpl, tpl, menu){
    var module = this;
    var router = module.require('{com}/router');
    var layer = module.require('{com}/layer/layerExt');
    module.imports('../../style/index');

    return {
        target:'#index',
        entry:true,
        path:'/index/',
        template:tmpl,
        data:{
            menu:menu
        },
        onChange:function(){
            console.log(this.data)
        },
        mapping:{
            'click a':function(e, elem){
                router.location(elem.attr('rel'), {
                    a:1
                })
            },
            'click h3':function(){
                var recordVoucher = module.require('./recordVoucher');
                var events = module.require('events');
                var _layer = layer({
                    content:tpl.render.call(recordVoucher.template, recordVoucher.template.layout, {
                        params:{
                            a:1
                        }
                    }),
                    isFull:true
                });
                recordVoucher.element = _layer._main; 
                events.call(recordVoucher)
            }
        }
    }
})