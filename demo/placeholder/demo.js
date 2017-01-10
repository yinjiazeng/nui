Nui.define(['placeholder'], function(a){
    return ({
        init:function(){
            $(':text').placeholder('options', {
                color:'#f60',
                animate:false
            })
        }
    })
})