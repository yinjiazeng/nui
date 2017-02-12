Nui.define('./deps/b',function(require){
    return ({
        init:function(){
            alert('b')
        }
    })
})

Nui.define('./deps/a',[1,2,3])

Nui.define('page',['./deps/a', './deps/b'], function(require, a, b){
    return ({
        init:function(){
            alert(a[2]) 
        }
    })
})
