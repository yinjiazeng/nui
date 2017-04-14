Nui.define([{
    id:'recordVoucher',
    name:'录凭证',
    index:true,
    icon:'',
    path:'/voucher/record'
}, {
    id:'seeVoucher',
    name:'查凭证',
    icon:'',
    index:true,
    path:'/voucher/list/aniu/jser'
}, {
    name:'账簿',
    icon:'',
    subs:[{
        id:'summary',
        name:'总账',
        icon:'',
        path:'/books/summary'
    }, {
        id:'detailed',
        name:'明细账',
        icon:'',
        path:'/books/detailed'
    }, {
        id:'accountbalance',
        name:'科目余额表',
        icon:'',
        path:'/books/accountbalance'
    }]
}])