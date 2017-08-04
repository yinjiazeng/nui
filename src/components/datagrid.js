Nui.define(['component'], function(component){
    var module = this;
    var paging = module.require('./paging');
    return module.extend(component, {
        static:{
            _init:function(){

            },
            _hasChildren:function(value){
                return Nui.isArray(value.children) && value.children.length
            },
            //获取表格标题行数
            _getRowNumber:function(array, index, arr){
                var self = this;
                if(!arr[index]){
                    arr[index] = true;
                }
                Nui.each(array, function(v){
                    if(self._hasChildren(v)){
                        self._getRowNumber(v.children, index+1, arr)
                    }
                })
                return arr.length
            },
            //获取合并单元格数
            _colspan:function(array, count){
                var self = this;
                if(count === undefined){
                    count = 0
                }
                Nui.each(array, function(v){
                    if(self._hasChildren(v)){
                        count += self._colspan(v.children, count)
                    }
                    else{
                        count += 1
                    }
                })
                return count
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
                                            '<%each rows%>'+
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
            var self = this, opts = self.options, target = self._getTarget(), _class = self.constructor;
            if(target && Nui.isArray(opts.columns) && opts.columns.length){
                self._rows = [];
                self._cols = [];
                self._rowNumber = _class._getRowNumber(opts.columns, 0, []);
                self._setRowCol(opts.columns);
                self.element = $(self._tpl2html('layout', {
                    rows:self._rows
                })).appendTo(target)
            }
        },
        _setRowCol:function(array, row){
            var self = this, opts = self.options, _class = self.constructor;
            if(row === undefined){
                row = 0;
            }
            if(!self._rows[row]){
                self._rows[row] = [];
            }
            Nui.each(array, function(v){
                var hasChild = _class._hasChildren(v);
                var data = {};

                if(hasChild){
                    data.colspan = _class._colspan(v.children);
                    self._setRowCol(v.children, row + 1)
                }

                Nui.each(v, function(val, key){
                    if(key !== 'children' && typeof val !== 'function'){
                        data[key] = val;
                    }
                })

                if(!hasChild){
                    data.rowspan = self._rowNumber - row;
                    self._cols.push(v)
                }

                self._rows[row].push(data);
            })
        }
    })
})