var datagrid = require('{com}/datagrid');

datagrid({
    target:'#data',
    data:[{
        id:'11111111',
        prov:'安徽',
        city:'蚌埠',
        job:'php工程师',
        name:'阿牛'
    }, {
        id:'22222222',
        prov:'浙江',
        city:'杭州',
        job:'前端工程师',
        name:'尹加增'
    }],
    columns:[{
        title:'ID',
        children:[{
            title:'id1',
            field:'id',
            children:[{
                title:'id11',
                field:'id',
            }, {
                title:'id12',
                field:'id',
            }]
        }, {
            title:'id2',
            field:'id'
        }]
    }, {
        title:'姓名',
        field:'name'
    }, {
        title:'地址',
        children:[{
            title:'省份',
            field:'prov'
        }, {
            title:'城市',
            field:'city'
        }]
    }, {
        title:'职业',
        field:'job'
    }]
})