Nui.define(['placeholder'], function(){
    return ({
        init:function(){
            $('.header a').click(function(){
                alert($(this).text())
            })
            $('.header :text').placeholder({
                color:'#f60'
            })
        }
    })
})
