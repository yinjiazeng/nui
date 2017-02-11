Nui.define('./footer',function(){
    return ({
        init:function(){
            $('.footer a').click(function(){
                alert($(this).text())
            })
        }
    })
})

Nui.define('./header',['placeholder'], function(){
    return ({
        init:function(){
            $('.header a').click(function(){
                alert($(this).text())
            })
            $('.header :text').placeholder({
                color:'#f60000'
            })
        }
    })
})

Nui.define('common',['./header', './footer'], function(require, header, footer){
    return ({
        init:function(){
            header.init(1)
            footer.init(1111)
        }
    })
})
