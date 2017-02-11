Nui.define(['./header', './footer'], function(require, header, footer){
    return ({
        init:function(){
            header.init(11)
            footer.init(1111)
        }
    })
})
