Nui.define(['./deps/a', './deps/b'], function(require, a, b){
    return ({
        init:function(){
            alert(a[2]) 
        }
    })
})
