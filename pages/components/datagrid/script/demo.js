var datagrid = require('{com}/datagrid');

var a = datagrid({
    target:'#data',
    //isFixed:false,
    //fields:true,
    width:'110%',
    paging:{
        url:'http://127.0.0.1/data/'
    },
    footer:'11',
    data:[{
        id:'11111111',
        prov:'安徽', 
        city:'蚌埠',
        address:'安徽蚌',
        job:'php工程师',
        name:'阿牛'
    }, {
        id:'22222222',
        prov:'浙江',
        city:'杭州',
        address:'浙江杭州',
        job:'前端工程师',
        name:'尹加增'
    }, {
        id:'22222222',
        prov:'浙江',
        city:'杭州',
        address:'浙江杭州',
        job:'前端工程师',
        name:'尹加增'
    }, {
        id:'22222222',
        prov:'浙江',
        city:'杭州',
        address:'浙江杭州',
        job:'前端工程师',
        name:'尹加增'
    }, {
        id:'22222222',
        prov:'浙江',
        city:'杭州',
        address:'浙江杭州',
        job:'前端工程师',
        name:'尹加增'
    }, {
        id:'22222222',
        prov:'浙江',
        city:'杭州',
        address:'浙江杭州',
        job:'前端工程师',
        name:'尹加增'
    }, {
        id:'22222222',
        prov:'浙江',
        city:'杭州',
        address:'浙江杭州',
        vC:{
            a:1
        },
        a:[{
            a:1
        }],
        job:'前端工程师',
        name:'尹加增'
    }, {
        id:'22222222',
        prov:'浙江',
        city:'杭州',
        address:'浙江杭州',
        job:'前端工程师',
        name:'尹加增'
    }, {
        id:'22222222',
        prov:'浙江',
        city:'杭州',
        address:'浙江杭州',
        job:'前端工程师',
        name:'尹加增'
    }, {
        id:'22222222',
        prov:'浙江',
        city:'杭州',
        address:'浙江杭州',
        job:'前端工程师',
        name:'尹加增'
    }, {
        id:'22222222',
        prov:'浙江',
        city:'杭州',
        address:'浙江杭州',
        job:'前端工程师',
        name:'尹加增'
    }],
    columns:[{
        title:'编号',
        content:'number',
        width:'40',
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
        fixed:'right'
    }],
    onRowClick:function(e, elem, data){
        //console.log(1)
    },
    onRowDblclick:function(e, elem, data){
        //alert()
    },
    onRender:function(){
        console.log(this)
    }
})

$('h1').click(function(){
    a.option('columns', [{
        title:'编号1',
        content:'number',
        width:'40',
        //fixed:true
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
        fixed:'right'
    }])
})