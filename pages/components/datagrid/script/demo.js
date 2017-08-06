var datagrid = require('{com}/datagrid');

datagrid({
    target:'#data',
    //isFixed:false,
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
        title:'ID',
        field:'id',
        width:'20%'
    }, {
        title:'期初余额',
        field:'address',
        width:'20%',
        children:[{
            title:'借方',
            width:'10%',
            field:'address'
        }, {
            title:'借方',
            width:'10%',
            field:'address'
        }]
    }, {
        title:'姓名',
        field:'name',
        width:'10%',
        nowrap:'nowrap'
    }, {
        title:'职业',
        field:'job',
        width:'20%'
    }],
    onRowClick:function(e, elem, data){
        console.log(data)
    }
})