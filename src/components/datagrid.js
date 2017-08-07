Nui.define(['component'], function(component){
    var module = this;
    var paging = module.require('../paging');
    
    var scrollBarWidth = (function(){
        var oldWidth, newWidth, div = document.createElement('div');
        div.style.cssText = 'position:absolute; top:-10000em; left:-10000em; width:100px; height:100px; overflow:hidden;';
        oldWidth = document.body.appendChild(div).clientWidth;
        div.style.overflowY = 'scroll';
        newWidth = div.clientWidth;
        document.body.removeChild(div);
        return oldWidth - newWidth;
    })()

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
                });

                /*var timer = null;
                Nui.win.on('resize', function(){
                    clearTimeout(timer);
                    timer = setTimeout(function(){
                        self._resize()
                    }, 100)
                })*/
            },
            _resize:function(){
                Nui.each(this.__instances, function(val){
                    val._theadHeight();
                    val._resetHeight()
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
                    var order = v.order;
                    if(order === true){
                        order = 'desc'
                    }
                    if(order === 'asc' || order === 'desc'){
                        v.order = {};
                        v.order[order] = 1;
                    }
                    if(v.order && !v.order.field){
                        v.order.field = v.field
                    }

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
            fields:null,
            dataName:'list',
            width:'100%',
            height:'auto',
            footer:'',

            onFocusin:null,
            onFocusout:null,
            onFocus:null,
            onBlur:null,

            stringify:null,
            onRowClick:null,
            onRowDblclick:null,
            onCheckboxChange:null,
            onRender:null
        },
        _template:{
            layout:
                '<div class="<% className %>">'+
                    '<div class="datagrid-body">'+
                        '<%include "table"%>'+
                    '</div>'+
                    '<%if footer || paging%>'+
                    '<div class="datagrid-foot">'+
                        '<%if footer%>'+
                        '<%footer%>'+
                        '<%/if%>'+
                        '<%if paging%>'+
                        '<div class="datagrid-paging"></div>'+
                        '<%/if%>'+
                    '</div>'+
                    '<%/if%>'+
                '</div>',
            table:
                '<%each rows v k%>'+
                    '<%if v.length%>'+
                    '<div class="datagrid-table<%if k === "left" || k === "right"%> datagrid-table-fixed<%/if%> datagrid-table-<%k%>">'+
                        '<div class="datagrid-title">'+
                            '<div class="datagrid-thead">'+
                            '<table class="ui-table">'+
                                '<thead class="table-thead">'+
                                    '<%each v%>'+
                                    '<tr class="table-row">'+
                                        '<%each $value val%>'+
                                        '<th class="table-cell"<%include "attr"%>>'+
                                            '<span class="cell-text">'+
                                            '<%if val.content === "checkbox"%>'+
                                            '<span class="ui-checkradio">'+
                                            '<input type="checkbox" name="datagrid-checkbox">'+
                                            '</span>'+
                                            '<%else%>'+
                                            '<%val.title%>'+
                                            '<%if typeof val.order === "object"%>'+
                                            '<%var asc = Nui.type(val.order.asc, ["String", "Number"]), desc = Nui.type(val.order.desc, ["String", "Number"])%>'+
                                            '<em class="datagrid-order<%if asc && desc%> datagrid-order-both<%/if%>" field="<%val.order.field%>">'+
                                            '<%if asc%>'+
                                            '<b class="datagrid-order-asc" type="asc" value="<%val.order.asc%>"><i></i><s></s></b>'+
                                            '<%/if%>'+
                                            '<%if desc%>'+
                                            '<b class="datagrid-order-desc" value="<%val.order.desc%>"><i></i><s></s></b>'+
                                            '<%/if%>'+
                                            '</em>'+
                                            '<%/if%>'+
                                            '<%/if%>'+
                                            '</span>'+
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
                '<%var toLower = function(str){'+
                    'return str.replace(/([A-Z])/g, function(a){'+
                        'return "-"+a.toLowerCase()'+
                    '})'+
                '}%>'+
                '<%each list%>'+
                '<tr class="table-row" data-row-index="<%$index%>"<%include "data"%>>'+
                    '<%each cols val key%>'+
                    '<%var _value%>'+
                    '<%if val.field && (!val.content || "number checkbox input".indexOf(val.content)===-1)%>'+
                    '<%var _value=$value[val.field]%>'+
                    '<%elseif val.content === "number"%>'+
                    '<%var _value=$index+1%>'+
                    '<%elseif val.content === "checkbox"%>'+
                    '<%var _value={"name":val.field ? val.field : "datagrid-checkbox", "value":$value[val.field]!==undefined?$value[val.field]:""}%>'+
                    '<%elseif val.content === "input"%>'+
                    '<%var _value={"name":val.field ? val.field : "datagrid-input", "class":"datagrid-input", "value":$value[val.field]!==undefined?$value[val.field]:""}%>'+
                    '<%else%>'+
                    '<%var _value=val.content%>'+
                    '<%/if%>'+
                    '<td class="table-cell"<%include "attr"%>>'+
                        '<span class="cell-text<%if val.nowrap === true%> cell-nowrap<%/if%>">'+
                        '<%if typeof val.filter === "function"%>'+
                        '<%var _value = val.filter(_value, val.field, $value)%>'+
                        '<%/if%>'+
                        '<%if val.content === "checkbox" && typeof _value === "object"%>'+
                        '<span class="checkradio">'+
                        '<input type="checkbox"<%include "_attr"%>>'+
                        '</span>'+
                        '<%elseif val.content === "input" && typeof _value === "object"%>'+
                        '<input type="text" autocomplete="off"<%include "_attr"%>>'+
                        '<%else%>'+
                        '<%_value%>'+
                        '<%/if%>'+
                        '</span>'+
                    '</td>'+
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
            _attr:
                '<%each _value _v _k%>'+
                ' <%_k%>="<%_v%>"'+
                '<%/each%>',
            attr:
                '<%each val value name%>'+
                '<%if "width field align valign colspan rowspan cellid".indexOf(name) !== -1%>'+
                ' <%name%>="<%value%>"'+
                '<%/if%>'+
                '<%/each%>',
            data:
                '<%if fields%>'+
                '<%each $value value field%>'+
                '<%if fields === true || $.inArray(field, fields) !== -1%>'+
                ' data-<%toLower(field)%>=<%if typeof stringify === "function"%><%stringify(value)%><%else%>"<%value%>"<%/if%>'+
                '<%/if%>'+
                '<%/each%>'+
                '<%/if%>'
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

            Nui.each(self._columns, function(v, k){
                self._setRowCol(v, k)
            })

            self._hasLeftRight = this._cols.left.length || this._cols.right.length;

            self.element = $(self._tpl2html('layout', self._tplData({
                rows:self._rows,
                isFixed:opts.isFixed,
                paging:typeof opts.paging === 'object',
                footer:opts.footer
            }))).appendTo(self.target);

            self._body = self.element.children('.datagrid-body');
            self._tableNormal = self._body.children('.datagrid-table-normal');
            self._tableNormalInner = self._tableNormal.children('.datagrid-inner');
            self._tableNormalTitle = self._tableNormal.children('.datagrid-title');
            self._tableNormalThead = self._tableNormalTitle.children('.datagrid-thead');
            self._tableLeft = self._body.children('.datagrid-table-left');
            self._tableRight = self._body.children('.datagrid-table-right');
            self._tableFixed = self._body.children('.datagrid-table-fixed');
            self._tableFixedInner = self._tableFixed.children('.datagrid-inner');
            self._foot = self.element.children('.datagrid-foot');

            self._theadHeight();
            self._initList();
            self._bindEvent();
        },
        _initList:function(){
            var self = this, opts = self.options;
            if(opts.paging){
                opts.paging.wrap = self._foot.children('.datagrid-paging');
                var pagingId = 'paging_'+self.__id;
                var echoData = opts.paging.echoData;
                opts.paging.echoData = function(data, type){
                    self._list = data[opts.dataName] || [];
                    self._render();
                    if(typeof echoData === 'function'){
                        echoData.call(opts.paging, data, type)
                    }
                }
                self.paging = $.paging(pagingId, opts.paging);
            }
            else if(opts.data){
                self._list = opts.data;
                self._render();
            }
        },
        _bindEvent:function(){
            var self = this;
            self._on('scroll', self._tableNormalInner, function(){
                self._scroll($(this))
            })
            self._event()
        },
        _render:function(){
            var self = this, opts = self.options;
            Nui.each(self._cols, function(v, k){
                self.element.find('.datagrid-table-'+k+' > .datagrid-inner').html(self._tpl2html('tbody', {
                    isFixed:opts.isFixed,
                    cols:v,
                    fields:opts.fields ? (opts.fields === true ? opts.fields : [].concat(opts.fields)) : null,
                    list:self._list,
                    stringify:opts.stringify
                }))
            })
            self._resetHeight();
            if(typeof opts.onRender === 'function'){
                opts.onRender.call(self)
            }
        },
        _resetHeight:function(){
            var self = this, opts = self.options;
            self._rowHeight();
            if(opts.isFixed === true){
                var conntailerHeight = self.target.innerHeight();
                var tbody = self._tableNormalInner.children('.datagrid-tbody');
                var height = conntailerHeight - self._tableNormalTitle.outerHeight() - self._foot.outerHeight();

                self._tableNormal.find('.datagrid-thead > .ui-table').width(opts.width);
                self._tableNormal.find('.datagrid-tbody > .ui-table').width(opts.width);

                if(tbody.children().width() > self._tableNormalInner.width()){
                    self._tableFixedInner.height(height - scrollBarWidth);
                }
                else{
                    self._tableFixedInner.height(height);
                }
                self._tableNormalInner.height(height);
                
                var width = self._tableNormalInner.innerHeight() >= tbody.outerHeight() ? 0 : scrollBarWidth;
                if(!Nui.bsie7){
                    self._tableNormalTitle.css({'padding-right':width});
                }

                self._tableRight.css('right', width)
            }
        },
        _theadHeight:function(){
            var self = this;
            if(self._hasLeftRight){
                self._tableFixed.find('.table-thead .table-cell').each(function(i){
                    var item = $(this), cellid = item.attr('cellid');
                    var elem = self._tableNormalThead.find('.table-cell[cellid="'+ cellid +'"]');
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
                var LeftRow = self._tableLeft.find('.table-tbody .table-row');
                var RightRow = self._tableLeft.find('.table-tbody .table-row');

                self._tableNormal.find('.table-tbody .table-row').each(function(i){
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
        _callback:function(){
            var args = arguments;
            var type = args[0];
            var callback = this.options['on'+type];
            if(typeof callback === 'function'){
                return callback.apply(this, Array.prototype.slice.call(args, 1))
            }
        },
        _events:{
            'click .table-tbody .table-row':'_active _getRowData _rowclick',
            'dblclick .table-tbody .table-row':'_getRowData _rowdblclick',
            'focus .datagrid-input':'_enable _getRowData _focus',
            'blur .datagrid-input':'_enable _getRowData _blur',
            'focusin .table-tbody .table-cell':'_focusin',
            'focusout .table-tbody .table-cell':'_focusout',
            'click .datagrid-order > b':'_order'
        },
        _order:function(e, elem){
            elem.toggleClass('s-crt');
            elem.siblings().removeClass('s-crt');
            var parent = elem.parent();
            var field = parent.attr('field');
            var value = parent.children('b.s-crt').attr('value');
            if(this.paging){
                this.paging.condition[field] = value;
                this.paging.query(true)
            }
        },
        _enable:function(e, elem){
            return !elem.hasClass('s-dis') && !elem.hasClass('s-disabled')
        },
        _active:function(e, elem){
            var self = this;
            if(self.options.isActive === true){
                self.element.find('.datagrid-tbody .table-row[data-row-index="'+ elem.index() +'"]').addClass('s-crt').siblings().removeClass('s-crt');
                Nui.each(self.__instances, function(val){
                    if(val !== self && val.options.isActive === true){
                        val.element.find('.datagrid-tbody table-row.s-crt').removeClass('s-crt');
                    }
                })
                e.stopPropagation();
            }
        },
        _getRowData:function(e, elem){
            if(elem.hasClass('table-row')){
                return elem.data()
            }
            return elem.closest('.table-row').data()
        },
        _focusin:function(e, elem, data){
            return this._callback('Focusin', e, elem, data)
        },
        _focusout:function(e, elem, data){
            return this._callback('Focusout', e, elem, data)
        },
        _rowclick:function(e, elem, data){
            return this._callback('RowClick', e, elem, data)
        },
        _rowdblclick:function(e, elem, data){
            return this._callback('RowDblclick', e, elem, data)
        },
        _scroll:function(elem){
            var self = this;
            var scrollTop = elem.scrollTop();
            var scrollLeft = elem.scrollLeft();
            self._tableFixedInner.scrollTop(scrollTop);
            self._tableNormalThead.scrollLeft(scrollLeft);
        },
        resize:function(){
            this._theadHeight();
            this._resetHeight()
        }
    })
})