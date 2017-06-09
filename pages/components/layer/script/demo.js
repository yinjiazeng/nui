var layer = require('{cpns}/layer/layer');
layer({
    content:'<a>aaa</a>',
    confirm:{
        enable:true
    },
    cancel:{
        enable:true
    },
    position:null,
    button:[{
        id:'cancel'
    }, {
        id:'confirm'
    }]
})

//a.destroy()