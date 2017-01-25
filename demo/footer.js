Nui.define(function(){
    return ({
        init:function(){
            $('.footer a').click(function(){
                alert($(this).text())
            })
        }
    })
})
