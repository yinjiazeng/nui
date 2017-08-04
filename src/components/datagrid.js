Nui.define(['component'], function(component){
    var module = this;
    var paging = module.require('./paging');
    return module.extend(component, {
        static:{
            _init:function(){

            }
        },
        options:{
            data:null,
            columns:null
        },
        _template:{
            layout:'<div class="nui-datagrid">'+
                    '<div class="datagrid-body">'+
                        '<div class="datagrid-main">'+
                            '<div class="datagrid-table">'+
                                '<div class="datagrid-thead">'+
                                    '<table class="ui-table">'+
                                        '<tbody class="table-tbody">'+
                                            '<%each titleRows%>'+
                                            '<tr class="table-row">'+
                                                '<%each $value val%>'+
                                                '<th class="table-cell" rowspan="<%val.rowspan??%>" colspan="<%val.colspan??%>">'+
                                                    '<span class="cell-text"><%val.title%></span>'+
                                                '</th>'+
                                                '<%/each%>'+
                                            '</tr>'+
                                            '<%/each%>'+
                                        '</tbody>'+
                                    '</table>'+
                                '</div>'+
                                '<div class="datagrid-inner"></div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="nui-paging"></div>'+
                    '</div>'+
                '</div>',
            head:'',
            foot:'',
            body:'<div class="datagrid-tbody">'+
                    '<table class="ui-table">'+
                        '<tbody class="table-tbody">'+
                            '<tr class="table-row">'+
                                '<td class="table-cell">'+
                                    '<span class="cell-text">1</div>'+
                                '</td>'+
                            '</tr>'+
                        '</tbody>'+
                    '</table>'+
                '</div>'+
                '<div class="datagrid-tfoot">'+
                    '<table class="ui-table">'+
                        '<tbody class="table-tbody">'+
                            '<tr class="table-row">'+
                                '<td class="table-cell">'+
                                    '<span class="cell-text">1</div>'+
                                '</td>'+
                            '</tr>'+
                        '</tbody>'+
                    '</table>'+
                '</div>'
        },
        _init:function(){
            this._exec()
        },
        _exec:function(){
            var that = this, opts = that.options, target = that._getTarget();
            if(target && Nui.isArray(opts.columns) && opts.columns.length){
                that._titleRows = [];
                that._cols = [];

                var each = function(arr, line){
                    if(!that._titleRows[line]){
                        that._titleRows[line] = [];
                    }
                    Nui.each(arr, function(v){
                        var children = v.children;
                        var obj = {};
                        if(Nui.isArray(children) && children.length){
                            obj.colspan = children.length;
                            each(children, line+1)
                        }
                        else{
                            that._cols.push(v)
                        }
                        Nui.each(v, function(val, key){
                            if(typeof val !== 'function'){
                                obj[key] = val;
                            }
                        })
                        that._titleRows[line].push(obj);
                    })
                }

                each(opts.columns, 0)

                Nui.each(that._titleRows, function(v){
                    Nui.each(v, function(val){
                        
                    })
                })

                console.log(that._titleRows)
                return
                that.element = $(that._tpl2html('layout', {
                    titleRows:that._titleRows
                })).appendTo(target)
            }
        }
    })
})