Nui.define(['component', '../plugins/paging', '../plugins/checkradio'], function(component){
    var module = this;

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
                Nui.doc.on('click', function(e){
                    var isRow = $(e.target).closest('tr').hasClass('table-row');
                    Nui.each(self.__instances, function(val){
                        if(!isRow && val.options.isActive === true){
                            val.element.find('.datagrid-tbody .table-row.s-crt').removeClass('s-crt');
                        }
                    })
                });

                var timer = null;
                Nui.win.on('resize', function(){
                    clearTimeout(timer);
                    timer = setTimeout(function(){
                        self._resize()
                    }, 100)
                })
            },
            _resize:function(){
                Nui.each(this.__instances, function(val){
                    if(val.options.height === '100%'){
                        val._theadHeight();
                        val._resetHeight()
                    }
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

                    if(!v.style){
                        v.style = {};
                    }
                    
                    if(v.align){
                        v.style['text-align'] = v.align;
                    }

                    if(v.valign){
                        v.style['vertical-align'] = v.valign;
                    }

                    if($.isEmptyObject(v.style)){
                        delete v.style
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
            container:null,
            data:null,
            columns:null,
            isFixed:true,
            isLine:false,
            isActive:true,
            isBorder:true,
            //初始化时是否调用分页
            isPaging:true,
            url:null,
            //分页配置
            paging:null,
            fields:null,
            dataName:'list',
            width:'100%',
            height:'100%',
            footer:'',
            placeholder:'',

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
                        '<%if !isFixed%>'+
                            '<div class="datagrid-box">'+
                            '<table class="ui-table<%if !isBorder%> ui-table-nobd<%/if%>">'+
                                '<%include "thead"%>'+
                                '<tbody class="table-tbody datagrid-tbody"></tbody>'+
                            '</table>'+
                            '</div>'+
                        '<%else%>'+
                            '<div class="datagrid-title">'+
                                '<div class="datagrid-thead">'+
                                '<table class="ui-table<%if !isBorder%> ui-table-nobd<%/if%>">'+
                                    '<%include "thead"%>'+
                                '</table>'+
                                '</div>'+
                            '</div>'+
                            '<div class="datagrid-inner">'+
                                '<div class="datagrid-box">'+
                                    '<table class="ui-table<%if !isBorder%> ui-table-nobd<%/if%>">'+
                                    '<tbody class="table-tbody datagrid-tbody"></tbody>'+
                                    '</table>'+
                                '</div>'+
                            '</div>'+
                        '<%/if%>'+
                    '</div>'+
                    '<%/if%>'+
                '<%/each%>',
            thead:
                '<thead class="table-thead">'+
                    '<%each v%>'+
                    '<tr class="table-row">'+
                        '<%each $value val%>'+
                        '<th class="table-cell"<%include "attr"%>>'+
                            '<span class="cell-text">'+
                            '<%if val.content === "checkbox"%>'+
                            '<span class="ui-checkradio">'+
                            '<input type="checkbox" name="datagrid-checkbox" class="datagrid-checkbox-all">'+
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
                '</thead>',
            rows:
                '<%if data && data.length%>'+
                '<%var toLower = function(str){'+
                    'return str.replace(/([A-Z])/g, function(a){'+
                        'return "-"+a.toLowerCase()'+
                    '})'+
                '}%>'+
                '<%each data%>'+
                '<tr class="table-row table-row-<%$index%>" row-index="<%$index%>"<%include "data"%>>'+
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
                        '<span class="ui-checkradio">'+
                        '<input type="checkbox" name="datagrid-checkbox"<%include "_attr"%>>'+
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
                '<%elseif type === "all"%>'+
                '<tr>'+
                    '<td class="table-cell table-cell-void" colspan="<%cols.length%>">'+
                        '<span class="ui-void"><%placeholder??%></span>'+
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
                '<%if name === "style"%>'+
                'style="<%each value _v _k%><%_k%>:<%_v%>;<%/each%>"'+
                '<%elseif "width field colspan rowspan cellid".indexOf(name) !== -1%>'+
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
            var self = this, opts = self.options, _class = self.constructor, container = opts.container;
            if(container && Nui.isArray(opts.columns) && opts.columns.length){
                self._container = _class._jquery(container);
                self._columns = {
                    all:[],
                    left:[],
                    right:[]
                }
                Nui.each(opts.columns, function(v, k){
                    if(v.fixed === 'left' || v.fixed === true){
                        self._columns.left.push(v)
                    }
                    else if(v.fixed === 'right'){
                        self._columns.right.push(v)
                    }
                    self._columns.all.push(v)
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

            self.element = self._bindComponentName($(self._tpl2html('layout', self._tplData({
                rows:self._rows,
                isFixed:opts.isFixed === true,
                isBorder:opts.isBorder === true,
                paging:opts.paging && typeof opts.paging === 'object' && opts.paging.isPage !== false,
                footer:opts.footer
            }))).appendTo(self._container));

            self._body = self.element.children('.datagrid-body');
            self._tableAll = self._body.children('.datagrid-table-all');
            self._tableAllInner = self._tableAll.children('.datagrid-inner');
            self._tableAllBox =  self._tableAll.find('.datagrid-box');
            self._tableAllTitle = self._tableAll.children('.datagrid-title');
            self._tableAllThead = self._tableAll.find('.datagrid-thead');
            self._tableLeft = self._body.children('.datagrid-table-left');
            self._tableRight = self._body.children('.datagrid-table-right');
            self._tableFixed = self._body.children('.datagrid-table-fixed');
            self._tableFixedInner = self._tableFixed.children('.datagrid-inner');
            self._tableFixedBox = self._tableFixed.find('.datagrid-box');
            self._foot = self.element.children('.datagrid-foot');
            self._tableTbody = self._body.find('.datagrid-tbody');

            if(opts.width){
                self._tableAllThead.children().css('width', opts.width);
                self._tableAllBox.children().css('width', opts.width);
            }

            self._theadHeight();
            self._initList();
            self._bindEvent();
        },
        _initList:function(){
            var self = this, opts = self.options;
            if(opts.paging){
                delete opts.paging.wrap;
                opts.paging.wrap = self._foot.children('.datagrid-paging');
                opts.paging.container = self._tableAllBox;
                var pagingId = 'paging_'+self.__id;
                var echoData = opts.paging.echoData;
                opts.paging.echoData = function(data, type){
                    if(self.element){
                        self.data = data[opts.dataName] || [];
                        self._render();
                            if(typeof echoData === 'function'){
                            echoData.call(opts.paging, data, type)
                        }
                    }
                }
                self.paging = window[pagingId] = new Paging(opts.paging);

                if(opts.isPaging === true){
                    self.paging.query(true)
                }
            }
            else if(opts.data){
                self.data = opts.data;
                self._render();
            }
        },
        _bindEvent:function(){
            var self = this;
            self._on('scroll', self._tableAllInner.children(), function(){
                self._scroll($(this))
            })
            self._event()
        },
        _render:function(){
            var self = this, opts = self.options;
            Nui.each(self._cols, function(v, k){
                self.element.find('.datagrid-table-'+k+' .datagrid-tbody').html(self._tpl2html('rows', {
                    type:k,
                    isFixed:opts.isFixed === true,
                    cols:v,
                    fields:opts.fields ? (opts.fields === true ? opts.fields : [].concat(opts.fields)) : null,
                    data:self.data,
                    placeholder:opts.placeholder,
                    stringify:opts.stringify
                }))
            })
            self.element.find('[name="datagrid-checkbox"]').checkradio(self._checkradio())
            self._resetHeight();
            if(typeof opts.onRender === 'function'){
                opts.onRender.call(opts, self)
            }
        },
        _checkradio:function(){
            var self = this, opts = self.options;
            var callback = function(me, e){
                if(me.hasClass('datagrid-checkbox-all')){
                    self._tableTbody.find('[name="datagrid-checkbox"]:enabled').checkradio('checked', me.prop('checked'))
                }
                else{
                    var checked = self._tableTbody.find('[name="datagrid-checkbox"]:enabled:checked').length === self._tableTbody.find('[name="datagrid-checkbox"]:enabled').length;
                    self._body.find('.table-thead .datagrid-checkbox-all').checkradio('checked', checked)
                }
                if(typeof opts.onCheckboxChange === 'function'){
                    opts.onCheckboxChange.call(opts, e, self, me)
                }
            }
            var opts = {
                callback:callback
            }
            return opts;
        },
        _resetHeight:function(){
            var self = this, opts = self.options, _class = self.constructor;
            self._rowHeight();
            if(opts.isFixed === true){
                var conntailerHeight = self._container.innerHeight();
                var height = conntailerHeight - 
                             self._tableAllTitle.outerHeight() - 
                             _class._getSize(self._tableAllTitle, 'tb', 'margin') - 
                             self._foot.outerHeight() - 
                             _class._getSize(self._foot, 'tb', 'margin');
                var stop = self._tableAllBox.scrollTop();

                self._tableAllBox.css('height', 'auto');
                self._tableAllInner.height(height);
                
                var width = self._tableAllInner.innerHeight() >= self._tableAllBox.outerHeight() ? 0 : scrollBarWidth;
                var fixedHeight = height;

                if(self._tableAllBox.children().width() > self._tableAllInner.width()){
                    fixedHeight -= scrollBarWidth;
                }

                if(width){
                    self._tableAllBox.css('height', height);
                    self._tableFixedBox.css('height', fixedHeight);
                }
                else{
                    self._tableAllBox.css('height', 'auto');
                    self._tableFixedBox.css('height', 'auto');
                }
                
                self._tableAllBox.scrollTop(stop);

                self._tableAllTitle.css({'margin-right':width});

                self._tableRight.css('right', width)
            }
        },
        _theadHeight:function(){
            var self = this;
            if(self._hasLeftRight){
                self._tableFixed.find('.table-thead .table-cell').each(function(i){
                    var item = $(this), cellid = item.attr('cellid');
                    var elem = self._tableAll.find('.table-thead .table-cell[cellid="'+ cellid +'"]');
                    var height = elem.height();
                    var _height = item.height(height).height() - height;
                    item.height(height - _height);
                })
            }
        },
        _rowHeight:function(){
            var self = this;
            if(self._hasLeftRight){
                var LeftRow = self._tableLeft.find('.table-tbody .table-row');
                var RightRow = self._tableLeft.find('.table-tbody .table-row');

                self._tableAll.find('.table-tbody .table-row').each(function(i){
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
            var self = this, opts = self.options;
            var args = arguments;
            var type = args[0];
            var callback = opts['on'+type];
            if(typeof callback === 'function'){
                return callback.apply(opts, Array.prototype.slice.call(args, 1))
            }
        },
        _events:{
            'click .table-tbody .table-row':'_active _getRowData _rowclick',
            'mouseover .table-tbody .table-row':function(e, elem){
                this.element.find('.datagrid-tbody .table-row[row-index="'+ elem.attr('row-index') +'"]').addClass('s-hover')
            },
            'mouseout .table-tbody .table-row':function(e, elem){
                this.element.find('.datagrid-tbody .table-row[row-index="'+ elem.attr('row-index') +'"]').removeClass('s-hover')
            },
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
                self.element.find('.datagrid-tbody .table-row[row-index="'+ elem.attr('row-index') +'"]').addClass('s-crt').siblings().removeClass('s-crt');
                Nui.each(self.__instances, function(val){
                    if(val !== self && val.options.isActive === true){
                        val.element.find('.datagrid-tbody table-row.s-crt').removeClass('s-crt');
                    }
                })
            }
        },
        _getRowData:function(e, elem){
            if(elem.hasClass('table-row')){
                return elem.data()
            }
            return elem.closest('.table-row').data()
        },
        _focus:function(e, elem, data){
            return this._callback('Focus', e, this, elem, data)
        },
        _blur:function(e, elem, data){
            return this._callback('Blur', e, this, elem, data)
        },
        _focusin:function(e, elem){
            return this._callback('Focusin', e, this, elem)
        },
        _focusout:function(e, elem){
            return this._callback('Focusout', e, this, elem)
        },
        _rowclick:function(e, elem, data){
            return this._callback('RowClick', e, this, elem, data)
        },
        _rowdblclick:function(e, elem, data){
            return this._callback('RowDblclick', e, this, elem, data)
        },
        _scroll:function(elem){
            var self = this;
            var scrollTop = elem.scrollTop();
            var scrollLeft = elem.scrollLeft();
            self._tableFixedBox.scrollTop(scrollTop);
            self._tableAllThead.scrollLeft(scrollLeft);
        },
        resize:function(){
            this._theadHeight();
            this._resetHeight()
        }
    })
})