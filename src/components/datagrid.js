Nui.define(['component'], function(component){
    var module = this;
    var paging = module.require('./paging');
    return module.extend(component, {
        static:{
            _init:function(){
                var self = this;
                Nui.doc.on('click', function(){
                    Nui.each(self.__instances, function(val){
                        if(val.options.isActive === true){
                            val.element.find('.datagrid-tbody table-row.s-crt').removeClass('s-crt');
                        }
                    })
                })
            },
            _hasChildren:function(value){
                return Nui.isArray(value.children) && value.children.length
            },
            //获取表格标题行数
            _getRowNumber:function(array, index, arr, id, parent){
                var self = this;
                if(!arr[index]){
                    arr[index] = true;
                }

                if(id === undefined){
                    id = 0;
                }
                
                Nui.each(array, function(v){
                    v['cellid'] = id++;

                    if(parent && parent.fixed){
                        v.fixed = parent.fixed
                    }

                    if(self._hasChildren(v)){
                        id = self._getRowNumber(v.children, index+1, arr, id, v)
                    }
                })

                if(parent){
                    return id
                }

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
            columns:null,
            isFixed:true,
            isLine:false,
            isActive:true,
            isBorder:true,
            url:null,
            paging:null,

            onFilter:null,
            onClick:null,
            onFocusin:null,
            onFocusout:null,
            onFocus:null,
            onBlur:null,

            onRowClick:null,
            onRowDblclick:null
        },
        _template:{
            layout:
                '<div class="<% className %>">'+
                    '<div class="datagrid-body">'+
                        '<div class="datagrid-main">'+
                            '<%include "table"%>'+
                        '</div>'+
                        '<%if paging%>'+
                        '<div class="datagrid-paging"></div>'+
                        '<%/if%>'+
                    '</div>'+
                '</div>',
            table:
                '<%each rows v k%>'+
                    '<%if v.length%>'+
                    '<div class="datagrid-table<%if k === "left" || k === "right"%> datagrid-table-fixed<%/if%> datagrid-table-<%k%>">'+
                        '<div class="datagrid-thead">'+
                            '<table class="ui-table">'+
                                '<thead class="table-thead">'+
                                    '<%each v%>'+
                                    '<tr class="table-row">'+
                                        '<%each $value val%>'+
                                        '<th class="table-cell"<%include "attr"%>>'+
                                            '<span class="cell-text"><%val.title%></span>'+
                                        '</th>'+
                                        '<%/each%>'+
                                    '</tr>'+
                                    '<%/each%>'+
                                '</thead>'+
                                '<%if isFixed !== true%>'+
                                '<tbody class="table-tbody datagrid-inner"></tbody>'+
                                '<%/if%>'+
                            '</table>'+
                        '</div>'+
                        '<%if isFixed === true%>'+
                        '<div class="datagrid-inner"></div>'+
                        '<%/if%>'+
                    '</div>'+
                    '<%/if%>'+
                '<%/each%>',
            tbody:
                '<%if isFixed === true%>'+
                '<div class="datagrid-tbody">'+
                    '<table class="ui-table">'+
                        '<tbody class="table-tbody">'+
                        '<%include "rows"%>'+
                        '</tbody>'+
                    '</table>'+
                '</div>'+
                '<%else%>'+
                '<%include "rows"%>'+
                '<%/if%>',
            rows:
                '<%if list && list.length%>'+
                '<%each list%>'+
                '<tr class="table-row" data-row-index="<%$index%>">'+
                    '<%each fields val key%>'+
                    '<%each $value v k%>'+
                    '<%if val.field === k%>'+
                    '<td class="table-cell"<%include "attr"%>>'+
                        '<span class="cell-text"><%v%></div>'+
                    '</td>'+
                    '<%return false%>'+
                    '<%/if%>'+
                    '<%/each%>'+
                    '<%/each%>'+
                '</tr>'+
                '<%/each%>'+
                '<%else%>'+
                '<tr>'+
                    '<td class="table-cell">'+
                        
                    '</td>'+
                '</tr>'+
                '<%/if%>',
            head:'',
            foot:'',
            attr:
                '<%each val value name%>'+
                '<%if "width field align valign nowrap colspan rowspan cellid".indexOf(name) !== -1%>'+
                ' <%name%>="<%value%>"'+
                '<%/if%>'+
                '<%/each%>'
        },
        _init:function(){
            this._exec()
        },
        _exec:function(){
            var self = this, opts = self.options;
            if(self._getTarget() && Nui.isArray(opts.columns) && opts.columns.length){
                self._columns = {
                    left:[],
                    normal:[],
                    right:[]
                }
                Nui.each(opts.columns, function(v, k){
                    if(v.fixed === 'left' || v.fixed === true){
                        self._columns.left.push(v)
                    }
                    else if(v.fixed === 'right'){
                        self._columns.right.push(v)
                    }
                    self._columns.normal.push(v)
                })
                self._create()
            }
        },
        _create:function(){
            var self = this, opts = self.options, _class = self.constructor;
            self._rows = {};
            self._cols = {};
            self._rowNumber = _class._getRowNumber(opts.columns, 0, []);

            self._data = opts.data;

            Nui.each(self._columns, function(v, k){
                self._setRowCol(v, k)
            })

            self._hasLeftRight = this._cols.left.length || this._cols.right.length;

            self.element = $(self._tpl2html('layout', self._tplData({
                rows:self._rows,
                isFixed:opts.isFixed,
                paging:opts.paging
            }))).appendTo(self.target);

            self._theadHeight();

            Nui.each(self._cols, function(v, k){
                self.element.find('.datagrid-table-'+k+' .datagrid-inner').html(self._tpl2html('tbody', {
                    isFixed:opts.isFixed,
                    fields:v,
                    list:self._data
                }))
            })

            self._rowHeight();
            self._resetHeight();
            self._event()
        },
        _resetHeight:function(){
            var self = this, opts = self.options;
            if(opts.isFixed === true){
                var conntailerHeight = self.target.innerHeight();
                var inner = self.element.find('.datagrid-inner');
                var tbody = self.element.find('.datagrid-tbody');
                var thead = self.element.find('.datagrid-thead');
                var height = conntailerHeight - thead.outerHeight() - self.element.find('.datagrid-paging').outerHeight();
                inner.height(height);
                var width = inner.width() - inner.children().width();
                thead.css({'padding-right':width})
            }
        },
        _theadHeight:function(){
            var self = this;
            if(self._hasLeftRight){
                var normalThead = self.element.find('.datagrid-table-normal .table-thead')

                self.element.find('.datagrid-table-fixed .table-thead .table-cell').each(function(i){
                    var item = $(this), cellid = item.attr('cellid');
                    var elem = normalThead.find('.table-cell[cellid="'+ cellid +'"]');
                    var height = elem.innerHeight();
                    if(Nui.browser.msie){
                        if(Nui.browser.version > 8){
                            height += 1
                        }
                        else if(Nui.browser.version == 7){
                            height -= 1
                        }
                    }
                    item.height(height)
                })
            }
        },
        _rowHeight:function(){
            var self = this;
            if(self._hasLeftRight){
                var LeftRow = self.element.find('.datagrid-table-left .table-tbody .table-row');
                var RightRow = self.element.find('.datagrid-table-right .table-tbody .table-row');

                self.element.find('.datagrid-table-normal .table-tbody .table-row').each(function(i){
                    var height = $(this).outerHeight();
                    LeftRow.eq(i).height(height);
                    RightRow.eq(i).height(height);
                })
            }
        },
        _setRowCol:function(array, type, row){
            var self = this, opts = self.options, _class = self.constructor;
            if(row === undefined){
                row = 0;
            }

            if(!self._rows[type]){
                self._rows[type] = []
            }

            if(!self._cols[type]){
                self._cols[type] = []
            }

            if(array.length && !self._rows[type][row]){
                self._rows[type][row] = []
            }

            Nui.each(array, function(v){
                var hasChild = _class._hasChildren(v);
                var data = {};

                if(hasChild){
                    data.colspan = _class._colspan(v.children);
                    self._setRowCol(v.children, type, row + 1)
                }

                Nui.each(v, function(val, key){
                    if(key !== 'children' && typeof val !== 'function'){
                        data[key] = val
                    }
                })

                if(!hasChild){
                    data.rowspan = self._rowNumber - row;
                    self._cols[type].push(v)
                }

                self._rows[type][row].push(data)
            })
        },
        _events:{
            'click .table-tbody .table-row':'_active _getRowData _rowclick'
        },
        _active:function(e, elem){
            var self = this;
            if(self.options.isActive === true){
                self.element.find('.datagrid-tbody .table-row').eq(elem.index()).addClass('s-crt').siblings().removeClass('s-crt');
                Nui.each(self.__instances, function(val){
                    if(val !== self && val.options.isActive === true){
                        val.element.find('.datagrid-tbody table-row.s-crt').removeClass('s-crt');
                    }
                })
                e.stopPropagation();
            }
        },
        _getRowData:function(e, elem){
            return this._data[elem.data('rowIndex')];
        },
        _rowclick:function(e, elem, data){
            var rowClick = this.options.onRowClick;
            if(typeof rowClick === 'function'){
                rowClick.call(this, e, elem, data)
            }
        }
    })
})