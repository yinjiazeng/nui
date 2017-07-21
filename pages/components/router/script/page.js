var render = require('./render');
var router = require('./router');
var ajax = require('./ajax');
var base = imports('../style/base');
var page = imports('../style/page');

ajax({
    url:'./script/data.json',
    success:function(res){
        render(res);
        router()
    }
});
module.exports = function(){
    
}