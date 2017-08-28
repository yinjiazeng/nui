var paging = module.require('./paging');
var checkradio = module.require('./checkradio');

var datagrid = require('{com}/datagrid');


var a = datagrid({
    container:'#data',
    isFixed:false,
    isBorder:false,
    //fields:true,
    paging:{
        url:'http://172.30.5.28/data/',
        pCount:4
    },
    footer:'11',
    columns:[{
        content:'checkbox',
        width:'40',
        align:'right',
    }, {
        title:'ID'
    }, {
        title:'期初余额',
        field:'address',
        children:[{
            title:'借方',
            width:'10%',
            field:'buaddress',
            nowrap:true,
            children:[{
                title:'aaa',
                filed:'id',
                width:'5%'
            },{
                title:'aaa',
                filed:'id',
                width:'5%'
            }]
        }, {
            title:'借方',
            width:'10%',
            order:'asc',
            field:'buaddress',
            nowrap:true,
            children:[{
                title:'aaa',
                filed:'id',
                width:'5%'
            },{
                title:'aaa',
                filed:'id',
                width:'5%'
            }]
        }, {
            title:'借方',
            width:'10%',
            order:'asc',
            field:'buaddress',
            nowrap:true,
            children:[{
                title:'aaa',
                filed:'id',
                width:'5%'
            },{
                title:'aaa',
                filed:'id',
                width:'5%'
            }]
        }, {
            title:'借方',
            width:'10%',
            order:'asc',
            field:'buaddress',
            nowrap:true,
            children:[{
                title:'aaa',
                filed:'id',
                width:'5%'
            },{
                title:'aaa',
                filed:'id',
                width:'5%'
            }]
        }, {
            title:'借方',
            width:'10%',
            order:'asc',
            field:'buaddress',
            nowrap:true,
            children:[{
                title:'aaa',
                filed:'id',
                width:'5%'
            },{
                title:'aaa',
                filed:'id',
                width:'5%'
            }]
        }, {
            title:'借方',
            width:'10%',
            order:'asc',
            field:'buaddress',
            nowrap:true,
            children:[{
                title:'aaa',
                filed:'id',
                width:'5%'
            },{
                title:'aaa',
                filed:'id',
                width:'5%'
            }]
        }, {
            title:'借方',
            width:'10%',
            order:'asc',
            field:'buaddress',
            nowrap:true,
            children:[{
                title:'aaa',
                filed:'id',
                width:'5%'
            },{
                title:'aaa',
                filed:'id',
                width:'5%'
            }]
        }, {
            title:'借方',
            width:'10%',
            order:'asc',
            field:'buaddress',
            nowrap:true,
            children:[{
                title:'aaa',
                filed:'id',
                width:'5%'
            },{
                title:'aaa',
                filed:'id',
                width:'5%'
            }]
        }, {
            title:'借方',
            width:'10%',
            order:'asc',
            field:'buaddress',
            nowrap:true,
            children:[{
                title:'aaa',
                filed:'id',
                width:'5%'
            },{
                title:'aaa',
                filed:'id',
                width:'5%'
            }]
        }]
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