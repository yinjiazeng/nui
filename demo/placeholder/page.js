Nui.define(function(){

    this.importcss('{base}/demo/placeholder/a');

    var b = this.require('./b.js')

    return this.exports(b, {
        show1:function(){
            alert(2)
        },
        show2:function(){
            alert(3)
        }
    }, [{
        method:'init',
        content:'this.show1()'
    }, {
        method:'init',
        content:'this.show2()'
    }])
})
