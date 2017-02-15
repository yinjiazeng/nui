Nui.define('./deps/b',['placeholder'], function(p){
    return p.extend({
        
    })
})

Nui.define('{base}demo/placeholder/page',['placeholder', './deps/b'], function(a, b){
    console.log(a)
    return a.extend({

    })
})
