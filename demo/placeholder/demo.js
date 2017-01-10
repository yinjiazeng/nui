Nui.define(['../../src/placeholder'], function(){
    return ({
        init:function(){
            $(':text').placeholder('options', {
                color:'#f60',
                animate:false
            })
        }
    })
})