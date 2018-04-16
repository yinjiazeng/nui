Nui.define(function(require){
    this.imports('../assets/components/datagrid/index');
    
    var component = require('../core/component');
    var util = require('../core/util');
    var paging = require('./paging');
    var checkradio = require('./checkradio');

    //获取滚动条宽度
    var scrollBarWidth = (function(){
        var oldWidth, newWidth, div = document.createElement('div');
        div.style.cssText = 'position:absolute; top:-10000em; left:-10000em; width:100px; height:100px; overflow:hidden;';
        oldWidth = document.body.appendChild(div).clientWidth;
        div.style.overflowY = 'scroll';
        newWidth = div.clientWidth;
        document.body.removeChild(div);
        return oldWidth - newWidth;
    })()

    return this.extend(component, {
        _static:{
            _init:function(){
                var self = this;
                Nui.doc.on('click', function(e){
                    var isRow = $(e.target).closest('tr').hasClass('table-row');
                    Nui.each(self.__instances, function(val){
                        if(!isRow && val.element && val._activeElem){
                            val._callback('CancelActive', [e, val._activeElem])
                            Nui.each(val._rowDom, function(v){
                                $(v[val._activeIndex]).removeClass('s-crt')
                            })
                            delete val._activeElem;
                            delete val._activeIndex;
                        }
                    })
                });

                var timer = null;
                Nui.win.on('resize', function(){
                    clearTimeout(timer);
                    timer = setTimeout(function(){
                        Nui.each(self.__instances, function(val){
                            if(val._options.height === '100%'){
                                val.resize()
                            }
                        })
                    }, 80)
                })
            },
            _hasChildren:function(value){
                return Nui.isArray(value.children) && value.children.length
            },
            _colspan:function(array, count){
                var self = this;
                if(count === undefined){
                    count = 0
                }
                Nui.each(array, function(v){
                    if(self._hasChildren(v)){
                        count += self._colspan(v.children)
                    }
                    else{
                        count += 1
                    }
                })
                return count
            }
        },
        _options:{
            container:null,
            data:null,
            columns:null,
            isFixed:true,
            isLine:false,
            isActive:true,
            isBorder:true,
            option:null,
            isPaging:true,
            isDir:false,
            keyCode:[9, 13],
            url:null,
            paging:null,
            fields:null,
            dataField:'list',
            width:'100%',
            height:'100%',
            footer:'',
            placeholder:'',

            onFocusin:null,
            onFocusout:null,
            onFocus:null,
            onBlur:null,

            filterQuery:null,
            stringify:null,
            rowRender:null,
            colRender:null,

            onActive:null,
            onCancelActive:null,
            onRowRender:null,
            onRowClick:null,
            onRowDblclick:null,
            onCheckboxChange:null,
            onRender:null,
            onRenderBefore:null,
            onScroll:null
        },
        _template:{
            layout:
                '<div class="<% className %>">'+
                    '<div class="datagrid-body<%if isFixed%> datagrid-fixed<%/if%>">'+
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
                            '<div class="datagrid-box">'+
                                '<table class="ui-table<%if !isBorder%> ui-table-nobd<%/if%>">'+
                                '<%include "colgroup"%>'+
                                '<tbody class="table-tbody datagrid-tbody"></tbody>'+
                                '</table>'+
                            '</div>'+
                        '<%/if%>'+
                    '</div>'+
                    '<%/if%>'+
                '<%/each%>',
            colgroup:
                '<%if !rowRender%>'+
                    '<colgroup>'+
                        '<%each cols[k] col i%>'+
                        '<col<%if col.width%> width="<%col.width%>"<%/if%>>'+
                        '<%/each%>'+
                    '</colgroup>'+
                '<%/if%>',
            thead:
                '<%include "colgroup"%>'+
                '<thead class="table-thead">'+
                    '<%each v%>'+
                    '<tr class="table-row">'+
                        '<%var cellLastIndex = $value.length-1%>'+
                        '<%each $value val key%>'+
                        '<%var isTitle = true%>'+
                        '<%var _classNames = val.className%>'+
                        '<%if typeof _classNames === "function"%>'+
                            '<%if _classNames = Nui.trim(val.className()||"")%>'+
                                '<%var _classNames = " " + _classNames%>'+
                            '<%/if%>'+
                        '<%/if%>'+
                        '<th class="table-cell<%_classNames%> table-cell-<%key%><%if cellLastIndex === key%> table-cell-last<%/if%>"<%include "attr"%>>'+
                            '<span class="cell-wrap"<%if val.width > 0 && (val.fixed === "left" || val.fixed === "right")%> style="width:<%val.width%>px"<%/if%>>'+
                            '<span class="cell-text">'+
                            '<%if val.title%>'+
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
                            '<%elseif val.content === "checkbox"%>'+
                            '<span class="ui-checkradio">'+
                            '<input type="checkbox" name="datagrid-checkbox-all" class="datagrid-checkbox datagrid-checkbox-choose">'+
                            '</span>'+
                            '<%/if%>'+
                            '</span>'+
                            '</span>'+
                        '</th>'+
                        '<%/each%>'+
                    '</tr>'+
                    '<%/each%>'+
                '</thead>',
            cols:
                '<%var colLastIndex = cols.length-1%>'+
                '<%each cols val key%>'+
                '<%var _value%>'+
                '<%if val.field && (!val.content || "number checkbox input".indexOf(val.content)===-1)%>'+
                '<%var _value=$value[val.field]%>'+
                '<%elseif val.content === "number"%>'+
                '<%var _value=$index+1%>'+
                '<%elseif val.content === "checkbox"%>'+
                '<%var _value={"name":val.field ? val.field : "datagrid-checkbox", "class":"datagrid-checkbox"+(!val.title ? " datagrid-checkbox-choose" : ""), "value":$value[val.field]!==undefined?$value[val.field]:""}%>'+
                '<%elseif val.content === "input"%>'+
                '<%var _value={"name":val.field ? val.field : "datagrid-input", "class":"datagrid-input", "value":$value[val.field]!==undefined?$value[val.field]:""}%>'+
                '<%else%>'+
                '<%var _value=val.content%>'+
                '<%/if%>'+
                '<%var _classNames = val.className%>'+
                '<%if typeof _classNames === "function"%>'+
                    '<%if _classNames = Nui.trim(val.className(_value, val.field, $value, $index)||"")%>'+
                        '<%var _classNames = " " + _classNames%>'+
                    '<%/if%>'+
                '<%/if%>'+
                '<td class="table-cell<%_classNames%> table-cell-<%key%><%if colLastIndex === key%> table-cell-last<%/if%>"<%include "attr"%>>'+
                    '<%if typeof val.filter === "function"%>'+
                    '<%var _value = val.filter(_value, val.field, $value, $index)%>'+
                    '<%/if%>'+
                    '<span class="cell-wrap<%if val.nowrap === true%> cell-nowrap<%/if%>"<%if val.width > 0 && (val.fixed === "left" || val.fixed === "right")%> style="width:<%val.width%>px"<%/if%>>'+
                    '<span class="cell-text'+
                        '<%if val.content === "checkbox"%> cell-text-checkbox<%/if%>'+
                        '<%if val.content === "input"%> cell-text-input<%/if%>"'+
                        '<%if val.showtitle === true || val.showtitle === "data"%> <%if val.showtitle !==true%>data-<%/if%>title="<%$value[val.field]??%>"<%/if%>>'+
                    '<%if val.content === "checkbox" && typeof _value === "object"%>'+
                    '<%if checked === true && !val.title && (_value["checked"]=checked)%><%/if%>'+
                    '<span class="ui-checkradio">'+
                    '<input type="checkbox"<%include "_attr"%>>'+
                    '</span>'+
                    '<%elseif val.content === "input" && typeof _value === "object"%>'+
                    '<input type="text" autocomplete="off"<%include "_attr"%>>'+
                    '<%else%>'+
                    '<%include "content"%>'+
                    '<%/if%>'+
                    '</span>'+
                    '</span>'+
                '</td>'+
                '<%/each%>',
            rows:
                '<%if list && list.length%>'+
                '<%var toLower = function(str){'+
                    'return str.replace(/([A-Z])/g, function(a){'+
                        'return "-"+a.toLowerCase()'+
                    '})'+
                '}%>'+
                '<%each list%>'+
                '<%var rowData = rowRender($value, $index)||{}%>'+
                '<%var className = (rowData.className ? " "+rowData.className : "")%>'+
                '<%delete rowData.className%>'+
                '<tr class="table-row table-row-<%$index%><%className%>" row-pagenum="<%pageNum??%>" row-index="<%$index%>"<%include "data"%><%each rowData _v _n%> <%_n%>="<%_v%>"<%/each%>>'+
                    '<%include "cols"%>'+
                '</tr>'+
                '<%/each%>'+
                '<%elseif type === "all"%>'+
                '<tr>'+
                    '<td class="table-cell table-cell-void" colspan="<%cols.length%>">'+
                        '<span class="ui-void"><%placeholder??%></span>'+
                    '</td>'+
                '</tr>'+
                '<%/if%>',
            _attr:
                '<%if !_value["class"]%>'+
                '<%var _class = _value["class"] = ""%>'+
                '<%/if%>'+
                '<%if _value.className%>'+
                '<%var _class = (_value["class"]+=" "+Nui.trim(_value.className))%>'+
                '<%delete _value.className%>'+
                '<%/if%>'+
                '<%each _value _v _k%>'+
                ' <%_k%>="<%_v%>"'+
                '<%/each%>',
            attr:
                '<%each val value name%>'+
                '<%if !isTitle?? && name === "style"%>'+
                'style="<%each value _v _k%><%_k%>:<%_v%>;<%/each%>"'+
                '<%elseif "width field colspan rowspan cellid".indexOf(name) !== -1%>'+
                ' <%name%>="<%value%>"'+
                '<%/if%>'+
                '<%/each%>',
            data:
                '<%if fields%>'+
                '<%each $value value field%>'+
                '<%if fields === true || $.inArray(field, fields) !== -1%>'+
                '<%var _value = stringify(value)%>'+
                ' data-<%toLower(field)%>=<%if typeof _value !== "undefined"%><%_value%><%else%>"<%value%>"<%/if%>'+
                '<%/if%>'+
                '<%/each%>'+
                '<%/if%>'
        },
        _exec:function(){
            var self = this, opts = self._options, container = opts.container;
            if(container && Nui.isArray(opts.columns) && opts.columns.length){
                self._container = self._jquery(container);
                self._columns = {
                    all:[],
                    left:[],
                    right:[]
                }
                self._checked = false;
                Nui.each(opts.columns, function(v, k){
                    if(v.fixed === 'left' || v.fixed === true){
                        self._columns.left.push(v)
                    }
                    else if(v.fixed === 'right'){
                        self._columns.right.push(v)
                    }
                    self._columns.all.push(v)
                })
                self._keyCode = [];
                if(opts.isDir === true){
                    self._keyCode = self._keyCode.concat([37, 38, 39, 40]);
                }
                if(opts.keyCode){
                    self._keyCode = self._keyCode.concat(opts.keyCode);
                }
                
                self._create()
            }
        },
        _create:function(){
            var self = this, opts = self._options;
            self._rows = {};
            self._cols = {};
            self._rowDom = {};
            self._colTemplates = {};
            self._rowNumber = self._getRowNumber(opts.columns, 0, []);
            self._setTemplate();
            Nui.each(self._columns, function(v, k){
                self._setRowCol(v, k)
            })
            
            self._hasLeftRight = this._cols.left.length || this._cols.right.length;

            self.element = self._bindComponentName($(self._tpl2html('layout', self._tplData({
                cols:self._cols,
                rows:self._rows,
                isFixed:opts.isFixed === true,
                isBorder:opts.isBorder === true,
                paging:opts.paging && typeof opts.paging === 'object' && opts.paging.isPage !== false,
                footer:opts.footer,
                rowRender:typeof opts.rowRender === 'function'
            }))).appendTo(self._container));

            self.element.find('.table-thead .datagrid-checkbox').checkradio(self._checkradio());

            self._body = self.element.children('.datagrid-body');
            self._tableAll = self._body.children('.datagrid-table-all');
            self._tableAllBox =  self._tableAll.find('.datagrid-box');
            self._tableAllTitle = self._tableAll.children('.datagrid-title');
            self._tableAllThead = self._tableAll.find('.datagrid-thead');
            self._tableLeft = self._body.children('.datagrid-table-left');
            self._tableRight = self._body.children('.datagrid-table-right');
            self._tableFixed = self._body.children('.datagrid-table-fixed');
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
        _setTemplate:function(){
            var self = this;
            var tpl = '';
            Nui.each(self._colTemplates, function(v, k){
                tpl += '<%'+ (tpl ? 'else' : '') +'if ("content_"+val.cellid) === "'+ k +'"%><%include "'+ k +'"%>'
            })
            if(tpl){
                tpl += '<%else%><%_value??%><%/if%>'
            }
            else{
                tpl = '<%_value??%>'
            }
            self._template.content = tpl;
        },
        _getRowNumber:function(array, index, arr, cellid, parent){
            var self = this, opts = self._options, _class = self.constructor;
            if(!arr[index]){
                arr[index] = true;
            }

            if(cellid === undefined){
                cellid = 0;
            }

            var opts = opts.option || {};
            
            Nui.each(array, function(v){
                for(var i in opts){
                    if(v[i] === undefined){
                        v[i] = opts[i]
                    }
                }
                v.cellid = cellid++;
                var order = v.order;
                var className = v.className;
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

                if(v.template === true){
                    var tplid = 'content_'+v.cellid;
                    self._template[tplid] = self._colTemplates[tplid] = v.filter || v.content;
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

                if(v.width){
                    v.width = v.width.toString().replace(/px$/, '');
                }

                if(typeof className !== 'function'){
                    if(!className){
                        className = '';
                    }
    
                    if(className){
                        className = ' ' + Nui.trim(className);
                    }
    
                    v.className = className;
                }

                if($.isEmptyObject(v.style)){
                    delete v.style
                }

                if(parent && parent.fixed){
                    v.fixed = parent.fixed
                }

                if(_class._hasChildren(v)){
                    cellid = self._getRowNumber(v.children, index+1, arr, cellid, v)
                }
            })

            if(parent){
                return cellid
            }

            return arr.length
        },
        _initList:function(){
            var self = this, opts = self._options;
            if(opts.paging){
                delete opts.paging.wrap;
                var container = opts.paging.container;
                opts.paging.wrap = self._foot.children('.datagrid-paging');
                opts.paging.container = !container ? self._tableAllBox : container;
                var pagingId = 'paging_'+self.__id;
                var echoData = opts.paging.echoData;
                opts.paging.echoData = function(data, type){
                    if(self.element){
                        self.data = data;
                        self._render(type);
                        if(typeof echoData === 'function'){
                            echoData.call(opts, data, type)
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
            var self = this, opts = self._options;
            self._on('scroll', self._tableAllBox, function(e, elem){
                self._scroll(elem);
                self._callback('Scroll', [e, elem, {left:elem.scrollLeft(), top:elem.scrollTop()}]);
            })
            self._event()
        },
        _getList:function(){
            var self = this, opts = self._options, field = opts.dataField, list = self.data, _list;
            if(field && Nui.type(list, 'Object')){
                Nui.each(field.split('.'), function(v){
                    if(list[v]){
                        list = list[v]
                    }
                    else{
                        list = null;
                        return false;
                    }
                })
            }
            if(_list = self._callback('RenderBefore', [list])){
                if(Nui.type(_list, 'Array')){
                    list = _list
                }
            }
            return list||[]
        },
        _render:function(type){
            var self = this, 
                opts = self._options,
                rowHtml = '', 
                rowDom = self._rowDom, 
                isScroll = opts.paging && opts.paging.scroll && opts.paging.scroll.enable === true;
            self.list = self._getList();
            if(isScroll && type === 'reload'){
                self.element.find('.datagrid-tbody > [row-pagenum="'+ (self.paging.current) +'"]').nextAll().addBack().remove();
            }
            Nui.each(self._cols, function(v, k){
                if(v.length){
                    if(self.list.length && typeof opts.rowRender === 'function'){
                        rowHtml = opts.rowRender.call(opts, self, self.list, v, k)
                    }
                    else{
                        rowHtml = self._tpl2html('rows', {
                            type:k,
                            isFixed:opts.isFixed === true,
                            cols:v,
                            fields:opts.fields ? (opts.fields === true ? opts.fields : [].concat(opts.fields)) : null,
                            list:self.list,
                            placeholder:opts.placeholder,
                            pageNum:opts.paging && self.paging ? self.paging.current : undefined,
                            checked:self._checked,
                            stringify:function(val){
                                if(typeof opts.stringify=== 'function'){
                                    return opts.stringify.call(opts, val)
                                }
                            },
                            rowRender:function(val, i){
                                if(typeof opts.onRowRender === 'function'){
                                    return opts.onRowRender.call(opts, self, val, i)
                                }
                                return opts.onRowRender
                            }
                        })
                    }

                    if(isScroll && type === 'reload' && rowDom[k]){
                        rowDom[k] = rowDom[k].slice(0, (self.paging.current - 1) * self.paging.pCount)
                    }

                    var tbody = self.element.find('.datagrid-table-'+k+' .datagrid-tbody');
                    var elems;
                    if(!rowDom[k]){
                        rowDom[k] = []
                    }
                    if(!isScroll || (type !== 'jump' && type !== 'reload')){
                        tbody.empty()
                        rowDom[k] = []
                    }
                    elems = $(rowHtml).appendTo(tbody);
                    rowDom[k] = rowDom[k].concat($.makeArray(elems))
                    elems.find('.datagrid-checkbox').checkradio(self._checkradio());
                }
                else{
                    delete rowDom[k]
                }
            })

            self._resetSize();
            self._callback('Render');
        },
        _update:function(index, data){
            var self = this, opts = self._options, tpl = '';
            Nui.each(self._cols, function(v, k){
                if(v.length){
                    var $row = self.element.find('.datagrid-table-'+k+' .datagrid-tbody > tr').eq(index);
                    var checked = $row.find('.datagrid-checkbox').prop('checked') || false;
                    if(typeof opts.colRender === 'function'){
                        tpl = opts.colRender.call(opts, self, data, v, k)
                    }
                    else{
                        tpl = self._tpl2html('cols', {
                            cols:v,
                            $index:index,
                            $value:data,
                            checked:false
                        })
                    }
                    $row.html(tpl)
                        .find('.datagrid-checkbox')
                            .prop('checked', checked).checkradio(self._checkradio());
                }
            })
            self._resetSize();
        },
        _checkradio:function(){
            var self = this, opts = self._options;
            var callback = function(elem, e){
                var className = 'datagrid-checkbox-choose';
                if(elem.hasClass(className)){
                    var checked = elem.prop('checked');
                    if(!elem.closest('.datagrid-table').hasClass('datagrid-table-all')){
                        self._tableAllBox.find('.table-row[row-index="'+ elem.closest('.table-row').attr('row-index') +'"]').find('.'+className).checkradio('checked', checked)
                    }
                    if(elem.attr('name') === 'datagrid-checkbox-all'){
                        self._checked = checked;
                        self._tableTbody.find('.'+ className +':enabled').checkradio('checked', checked)
                    }
                    else{
                        var checked = self._tableTbody.find('.'+ className +':checked').length === self._tableTbody.find('.'+className).length;
                        self._checked = checked;
                        self._body.find('.table-thead .'+className).checkradio('checked', checked)
                    }
                }
                self._callback('CheckboxChange', [e, elem]);
            }
            var _opts = {
                callback:callback
            }
            return _opts;
        },
        _resetSize:function(){
            var self = this, opts = self._options, _class = self.constructor;
            self._rowHeight();
            if(opts.height !== 'auto'){
                var stop = self._tableAllBox.scrollTop();
                self._tableAllBox.css('height', 'auto');
                var conntailerHeight = self._container.height();
                if(opts.height > 0){
                    conntailerHeight = opts.height
                }
                var height = conntailerHeight - 
                    self._tableAllTitle.outerHeight() - 
                    _class._getSize(self._tableAllTitle, 'tb', 'margin') - 
                    self._foot.outerHeight() - 
                    _class._getSize(self._foot, 'tb', 'margin');
                self._tableAllBox.height(height);
                if(opts.isFixed === true){
                    var table = self._tableAllBox.children();
                    var barWidth = self._tableAllBox.height() >= table.outerHeight() ? 0 : scrollBarWidth;
                    var fixedHeight = height;

                    if(table.outerWidth() > self._tableAllBox.width()){
                        fixedHeight -= scrollBarWidth;
                    }
                    
                    if(Nui.browser.msie && Nui.browser.version <= 7 && opts.width === '100%'){
                        table.width(self._tableAllBox.width() - barWidth)
                    }

                    self._tableFixedBox.height(fixedHeight);

                    self._tableAllTitle.css({'margin-right':barWidth});

                    self._tableRight.css('right', barWidth)
                }
                self._tableAllBox.scrollTop(stop);
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
            var self = this, opts = self._options, _class = self.constructor;
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
                    if(key !== 'children'){
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
        _editInput:function(e, elem){
            var dom = elem.get(0);
            var keycode = e.keyCode;
            if(keycode === 37 || keycode === 39){
                var index = util.getFocusIndex(dom);
                var edge;
                if(keycode === 37){
                    edge = index !== 0;
                }
                else{
                    edge = index !== dom.value.length;
                }
                if(util.isTextSelect() || edge){
                    return false
                }
            }
        },
        _horzFocus:function(e, elem, type, isTab){
            var td = elem.closest('td.table-cell');
            var _td = td[type]();
            if(isTab){
                e.preventDefault();
            }
            if(_td.length){
                var input = _td.find('.datagrid-input');
                if(input.length && !input.prop('readonly') && !input.prop('disabled')){
                    input.focus();
                    setTimeout(function(){
                        input.select();
                    })
                }
                else{
                    this._horzFocus(e, _td.children(), type, isTab)
                }
            }
            else{
                var input;
                var elems = td.closest('.table-row').children('td.table-cell');
                if(type === 'prev'){
                    $.each($.makeArray(elems).reverse(), function(k, v){
                        var _input = $(v).find('.datagrid-input');
                        if(_input.length){
                            input = _input;
                            return false;
                        }
                    });
                }
                else{
                    elems.each(function(){
                        var _input = $(this).find('.datagrid-input');
                        if(_input.length){
                            input = _input;
                            return false;
                        }
                    })
                }
                if(input){
                    this._verticalFocus(e, input, type)
                }
            }
        },
        _verticalFocus:function(e, elem, type){
            var td = elem.closest('td.table-cell');
            var index = td.index();
            var tr = td.closest('.table-row')[type]();
            if(tr.length){
                var _td = tr.children('td.table-cell').eq(index);
                var input = _td.find('.datagrid-input');
                if(input.length && !input.prop('readonly') && !input.prop('disabled')){
                    input.focus();
                    setTimeout(function(){
                        input.select();
                    })
                }
                else{
                    this._verticalFocus(e, _td.children(), type)
                }
            }
            e.preventDefault();
        },
        _dirFocus:function(e, elem){
            var self = this, keycode = e.keyCode;
            if($.inArray(keycode, self._keyCode) !== -1){
                switch(keycode){
                    case 37:
                        self._horzFocus(e, elem, 'prev')
                        break;
                    case 38:
                        self._verticalFocus(e, elem, 'prev')
                        break;
                    case 39:
                        self._horzFocus(e, elem, 'next')
                        break;
                    case 40:
                        self._verticalFocus(e, elem, 'next')
                        break;
                    default:
                        self._horzFocus(e, elem, 'next', true)
                }
            }
        },
        _events:{
            'click .table-tbody .table-row':'_getRowData _active',
            'mouseenter .table-tbody .table-row':function(e, elem){
                var index = elem.attr('row-index');
                Nui.each(this._rowDom, function(v){
                    $(v[index]).addClass('s-hover')
                })
                this._callback('RowMouseover', [e, elem]);
            },
            'mouseleave .table-tbody .table-row':function(e, elem){
                var index = elem.attr('row-index');
                Nui.each(this._rowDom, function(v){
                    $(v[index]).removeClass('s-hover')
                })
                this._callback('RowMouseout', [e, elem]);
            },
            'dblclick .table-tbody .table-row':'_getRowData _rowdblclick',
            'focus .datagrid-input':'_enable _getRowData _focus',
            'blur .datagrid-input':'_enable _getRowData _blur',
            'focusin .table-tbody .table-cell':'_focusin',
            'focusout .table-tbody .table-cell':'_focusout',
            'click .datagrid-order > b':'_order',
            'keydown .datagrid-input':'_editInput _dirFocus'
        },
        _order:function(e, elem){
            var self = this, opts = self._options;
            elem.toggleClass('s-crt');
            elem.siblings().removeClass('s-crt');
            var parent = elem.parent();
            var field = parent.attr('field');
            var value = parent.children('b.s-crt').attr('value');
            var query = this.paging.condition;
            if(this.paging){
                query[field] = value;
                if(typeof opts.filterQuery === 'function'){
                    this.paging.condition = opts.filterQuery.call(opts, self, query, field) || query
                }
                this.paging.query(true)
            }
        },
        _enable:function(e, elem){
            if(elem.prop('readonly') || elem.prop('disabled')){
                e.stopPropagation();
                return false
            }
        },
        _active:function(e, elem, data){
            var self = this;
            self._callback('RowClick', [e, elem, data]);
            if(self._options.isActive === true){
                self.cancelActive();
                self._activeIndex = elem.attr('row-index');
                self._activeElem = elem;
                Nui.each(self._rowDom, function(v){
                    $(v[self._activeIndex]).addClass('s-crt')
                })
                self._callback('Active', [e, elem, data]);
            }
        },
        _getRowData:function(e, elem){
            if(elem.hasClass('table-row')){
                return elem.data()
            }
            return elem.closest('.table-row').data()
        },
        _focus:function(e, elem, data){
            this._active(e, elem.closest('.table-row'), data)
            return this._callback('Focus', arguments)
        },
        _blur:function(e, elem, data){
            return this._callback('Blur', arguments)
        },
        _focusin:function(e, elem){
            elem.addClass('s-focus');
            return this._callback('Focusin', arguments)
        },
        _focusout:function(e, elem){
            elem.removeClass('s-focus');
            return this._callback('Focusout', arguments)
        },
        _rowdblclick:function(e, elem, data){
            return this._callback('RowDblclick', arguments)
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
            this._resetSize();
            this._callback('Resize')
        },
        scrollTo:function(x, y){
            var elem = this._tableAllBox;
            elem.scrollTop(y||0);
            elem.scrollLeft(x||0);
        },
        cancelActive:function(){
            var self = this;
            if(self._options.isActive === true && self._activeElem){
                Nui.each(self._rowDom, function(v){
                    $(v[self._activeIndex]).removeClass('s-crt')
                })
                delete self._activeIndex;
                delete self._activeElem;
            }
        },
        checkedData:function(field){
            var self = this;
            var data = [];
            self._tableAllBox.find('.datagrid-checkbox-choose:checked').each(function(){
                var _data = $(this).closest('.table-row').data();
                if(field){
                    data.push(_data[field]);
                }
                else{
                    data.push(_data);
                }
            })
            return data;
        },
        //更新单行
        update:function(index, data){
            var self = this, _data;
            if(data && typeof data === 'object'){
                _data = data
            }
            else if(self.list){
                _data = self.list[index]
            }
            if(_data){
                self._update(index, _data)
            }
        }
    })
})
