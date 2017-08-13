var paging = module.require('./paging');
var checkradio = module.require('./checkradio');

var datagrid = require('{com}/datagrid');


var a = datagrid({
    container:'#data',
    isFixed:false,
    isBorder:false,
    //fields:true,
    width:'110%',
    paging:{
        url:'http://172.30.5.28/data/',
        pCount:4
    },
    footer:'11',
    columns:[{
        title:'编号',
        content:'checkbox',
        width:'40',
        align:'right',
        fixed:true
    }, {
        title:'ID',
        field:'id',
        width:'200',
        order:{
            desc:'1',
            asc:'2'
        },
        select:[{
            text:'',
            value:''
        }]
    }, {
        title:'期初余额',
        field:'address',
        width:'400',
        children:[{
            title:'借方',
            width:'200',
            field:'buaddress',
            nowrap:true,
            filter:function(val, field, data){
                return ''
            }
        }, {
            title:'借方',
            width:'200',
            order:'asc',
            field:'buaddress',
            nowrap:true
        }]
    }, {
        title:'姓名',
        order:'desc',
        field:'certificate',
        content:'input',
        width:200
    }, {
        title:'职业',
        field:'buname'
    }, {
        title:'操作',
        content:'<a class="datagrid-button" on-click="alter">修改</a> <a class="datagrid-button" on-click="delete">删除</a>',
        width:150,
        //fixed:'right'
    }],
    onRowClick:function(e, self, elem, data){
        
    },
    onRowDblclick:function(e, self, elem, data){
        //alert()
    },
    onRender:function(self){
        console.log(self)
    },
    onFocus:function(e, self, elem, data){
        
    }
})

$('h1').click(function(){
    a.option('isBorder', true)
})