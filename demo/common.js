Nui.define('footer', function(){
    return ({
        init:function(){
            $('.footer a').click(function(){
                alert($(this).text())
            })
        }
    })
})
Nui.define(['header', 'footer'], function(header, footer){
    return ({
        init:function(){
            header.init()
            footer.init()
        }
    })
})
