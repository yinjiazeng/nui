Nui.define(['./menu', './tpls/layout', 'template'], function(menu, layout, tpl){
    var module = this;
    return function(data){
        $('.m-headbox').html(tpl.render(layout.head, data))
        data.menu = menu;
        $('.m-menu').html(tpl.render(layout.menu, data))
    }
})