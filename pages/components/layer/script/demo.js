var layer = require('{cpns}/layer/layer');
var a = layer({
    content:'<a>aaa</a>',
    confirm:{
        enable:true
    },
    cancel:{
        enable:true
    },
    button:[{
        id:'cancel'
    }, {
        id:'confirm'
    }]
})

//a.destroy()