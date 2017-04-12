Nui.define(['template'], function(tpl){
    var module = this;
    return ({
        render:function(target, data){
            $('.content').html(tpl.render(module.renders({
                Hi！欢迎来到首页。
            }), data))
        }
    })
})