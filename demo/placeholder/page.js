Nui.define(['placeholder', './deps/b'], function(require){
    return ({
        init:function(){
            $('.content :text').placeholder({
                color:'#f00'
            })
        }
    })
})
