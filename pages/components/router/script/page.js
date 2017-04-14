Nui.define(['./render', './router', './ajax'], function(render, router, ajax){
    var module = this;
    module.imports('../style/base');
    module.imports('../style/index');
    ajax({
        url:'http://127.0.0.1/data/',
        success:function(res){
            render(res);
            router('trigger')
        }
    })
})