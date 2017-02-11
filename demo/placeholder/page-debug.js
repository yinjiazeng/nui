Nui.define('./deps/b',['placeholder'], function(require, ph){
    var placeholder = Nui.copy(ph)
    return placeholder
})

Nui.define('./page',['./deps/b'], function(require){
    return ({
        init:function(){

            $('.content :text').b({
                color:'#f00'
            })
        }
    })
})
