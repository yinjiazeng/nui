var paging = require('./paging');
var checkradio = require('./checkradio');
var template = require('template');
var datagrid = require('{com}/datagrid');

import b from './a'
import * as a from './a'
import {a} from './a'
import {a as b} from './a'
import {default as b, c as d} from './a'

export {a}
export {a as b, a as default}
export var a = {}
export default {a as b,b}
export default a
export default {
    a:1,
    b:2
}
export default a = function(){

}
export {a as b} from './a';
export * from './a';

var a = datagrid({
    container:'#data',
    paging:{
        url:'http://127.0.0.1:8001/data/',
        pCount:20
    },
    width:'110%',
    columns:[{
        title:'名称',
        width:100,
        field:'buname',
    }, {
        title:'名称',
        width:100,
        field:'buname1',
    }, {
        title:'名称',
        width:200,
        field:'buname',
        children:[{
            title:'名称',
            width:100,
            field:'buname'
        }, {
            title:'名称',
            width:100,
            field:'buname'
        }]
    }, {
        title:'名称',
        width:100,
        field:'buname',
        children:[{
            title:'名称',
            width:100,
            field:'buname'
        }]
    }, {
        title:'名称',
        width:100,
        field:'buname'
    }],
    rowRender:function(self, list, v, k){
        return template.render(renders({
            <%each list%>
                <tr class="table-row">
                    <%each cols col%>
                    <td class="table-cell" width="<%col.width%>">
                    
                    </td>
                    <%/each%>
                </tr>
            <%/each%>
        }), {
            cols:v,
            list:list
        })
    }
})

$('h1').click(function(){
    a.option('isBorder', true)
})