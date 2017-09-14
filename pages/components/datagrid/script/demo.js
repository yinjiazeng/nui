var paging = module.require('./paging');
var checkradio = module.require('./checkradio');

var datagrid = require('{com}/datagrid');

var a = datagrid({
    container:'#data',
    //isFixed:false,
    isBorder:false,
    //width:'110%',
    //height:'500',
    isDir:true,
    paging:{
        url:'http://172.30.5.28/data/',
        pCount:20
    },
    data:[{
        buname:'11111',
    }],
    columns:[{
        title:'名称',
        width:100,
        field:'buname',
        fixed:'left',
        nowrap:true,
    }, {
        title:'名称',
        width:'200',
        field:'id',
        //nowrap:true,
        content:'input'
    },{
        title:'',
        content:''
    }, {
        title:'名称',
        width:200,
        field:'buname',
        content:'input'
        
    }],
    onRowClick:function(self, e, elem, data){
        
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