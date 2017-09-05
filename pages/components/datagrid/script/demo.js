var paging = module.require('./paging');
var checkradio = module.require('./checkradio');

var datagrid = require('{com}/datagrid');


var a = datagrid({
    container:'#data',
    isFixed:false,
    isBorder:false,
    //fields:true,
    /*paging:{
        url:'http://172.30.5.28/data/',
        pCount:4
    },*/
    data:[{
        buname:'11111',
    }],
    columns:[{
        title:'名称',
        width:100,
        field:'buname',
        nowrap:true
    }, {
        title:'名称',
        width:'200',
        field:'buname',
        nowrap:true
    },{
        title:'',
        content:''
    }, {
        title:'名称',
        width:100,
        field:'buname',
        nowrap:true
    }],
    onRowClick:function(self, e, elem, data){
        console.log(self)
    },
    onRowDblclick:function(self, e, elem, data){
        //alert()
    },
    onRender:function(self){
        
    },
    onFocus:function(self, e, elem, data){
        
    }
})

$('h1').click(function(){
    a.option('isBorder', true)
})