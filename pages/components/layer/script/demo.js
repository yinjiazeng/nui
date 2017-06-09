var layer = require('{cpns}/layer/layer');
var placeholder = require('{cpns}/placeholder');
layer({
    content:'<input type="text" data-placeholder-options="{animate:true}" placeholder="默认文本">',
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