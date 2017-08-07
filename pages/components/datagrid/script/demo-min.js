Nui.define('src/paging',function(require,imports,renders,extend){!function(e,t,i,a){function n(a){var l=this;l.load=!1,l.instance=function(){for(var t in e)if(e[t]==l)return t.toString()},i.extend(l,i.extend(!0,{url:'',wrap:null,paramJSON:'',pCount:10,current:1,aCount:0,last:!1,allData:!1,isFull:!0,container:e,scroll:{enable:!1},ajax:{},condition:{},loading:{wrap:null,show:function(){var e=this;e.hide();var t=e.wrap;t&&t.append('<i class="ui-loading" style="position:absolute;">正在加载数据...</i>').css({position:'relative'})},hide:function(){i('.ui-loading').remove()}},button:{prev:'«',next:'»',first:'',last:''},extPage:{wrap:null,desc:'',prev:'上一页',next:'下一页'},refreshCallback:null,endCallback:i.noop,jumpCallback:i.noop,echoData:i.noop},n.options,a||{})),l.container=i(l.container||e),!0===l.scroll.enable&&(l.wrap=null,l.children=l.container[0]===e?i(t.body):l.container.children(),l.container.scroll(function(){l.resize()}).resize(function(){l.resize()}))}var l=function(e){return e.dataType='json',i.ajax(e)};n.options={},n.config=function(e){i.extend(!0,n.options,e||{})},n.prototype={constructor:n,jump:function(e){var t,a=this,n=Math.ceil(a.aCount/a.pCount);if(a.showload=!0,a.aCount>0)if('object'==typeof e){var l=i(e).prevAll('input').val();t=l<=n&&l!=a.current?parseInt(l):a.current}else t=e>0&&e<=n?e:e<0?n+e+1:n;else t=e;if(a.current=a.condition.current=t,a.jumpCallback(t),'function'==typeof a.refreshCallback)return a.refreshCallback(t),void a.create();a.getData('jump')},query:function(e){var t=this;t.showload=!0,t.load=!1,'function'!=typeof t.refreshCallback||'refresh'!==e?(e?('noloading'===e?t.showload=!1:'reload'!==e&&(t.current=1),t.filter(),t.condition.current=t.current):t.condition={current:t.current=1},t.getData(e||'')):t.create()},filter:function(){var e=this;for(var t in e.condition)e.condition[t]||delete e.condition[t]},getData:function(t){var a=this;a.condition.pCount=a.pCount,!0===a.allData&&(delete a.condition.pCount,delete a.condition.current);var n=a.condition;if(a.paramJSON){n=[],i.each(a.condition,function(e,t){n.push(e+':'+t)});var r=n.length?'{'+n.join(',')+'}':'';n={},n[a.paramJSON]=r}var o='function'==typeof a.ajax?a.ajax():a.ajax;delete o.success,a.load||(a.load=!0,l(i.extend({},!0,{url:a.url,data:n,success:function(i){try{i.current=a.current}catch(e){}var n,l=0;if(a.container[0]===e||'reload'===t||'noloading'===t||'jump'===t&&('jump'!==t||a.scroll.enable)||(a.container.scrollTop(0),a.container.scrollLeft(0)),'reload'===t){var r=a.container;a.selector?(r=a.container.find(a.selector),l=r.scrollTop()):l=r.scrollTop(),n=r.find('tr.rows.s-crt').index()}if(a.echoData(i,t),a.aCount=i.aCount,a.load=!1,!0===a.scroll.enable&&a.resize(),l>0){var r=a.container;a.selector?(r=a.container.find(a.selector),r.scrollTop(l)):r.scrollTop(l),n>=0&&r.find('tr.rows').eq(n).addClass('s-crt')}if(!0===a.last)return a.last=!1,void a.jump(-1);a.create(),a.endCallback(i)},error:function(){a.showload&&a.loading.hide(),a.load=!1}},o||{})))},trim:function(e){var t=Math.abs(parseInt(i(e).val()));!t&&(t=1),i(e).val(t)},echoList:function(e,t,i){return this.current==t?'<li><span class="s-crt">'+t+'</span></li>':'<li><a href="javascript:'+i+'.jump('+t+');" target="_self">'+t+'</a></li>'},resize:function(){var e=this;try{var t=e.container.scrollTop(),i=e.container.height(),a=e.children.outerHeight();!e.load&&Math.ceil(e.aCount/e.pCount)>e.current&&(0===t&&a<=i||i+t>=a)&&e.jump(++e.current)}catch(e){}},create:function(){var e=this,t=e.button,i=Math.ceil(e.aCount/e.pCount),a=e.current,n='',l=i==a?1:a+1,r=e.instance(),o=e.extPage;if(o.wrap){var c='<div>';c+=a==i||0==i?'<span>'+o.next+'</span>':'<a href="javascript:'+r+'.jump('+(a+1)+');" target="_self">'+o.next+'</a>',c+=1==a?'<span>'+o.prev+'</span>':'<a href="javascript:'+r+'.jump('+(a-1)+');" target="_self">'+o.prev+'</a>',c+='</div><em>'+(0!==i?a:0)+'/'+i+'</em><strong>共'+e.aCount+o.desc+'</strong>',o.wrap.html(c)}if(e.wrap){if(!i)return void e.wrap.empty();if(n+=function(){var i='';return 1==a?(t.first&&(i+='<li><span>'+t.first+'</span></li>'),i+='<li><span>'+t.prev+'</span></li>'):(e.button.first&&(i+='<li><a href="javascript:'+r+'.jump(1);" target="_self">'+t.first+'</a></li>'),i+='<li><a href="javascript:'+r+'.jump('+(a-1)+');" target="_self">'+t.prev+'</a></li>'),i}(),i<=7)for(var s=1;s<=i;s++)n+=e.echoList(n,s,r);else if(a-3>1&&a+3<i){n+='<li><a href="javascript:'+r+'.jump(1);" target="_self">1</a></li>',n+='<li><em>...</em></li>';for(var s=a-2;s<=a+2;s++)n+=e.echoList(n,s,r);n+='<li><em>...</em></li>',n+='<li><a href="javascript:'+r+'.jump('+i+');" target="_self">'+i+'</a></li>'}else if(a-3<=1&&a+3<i){for(var s=1;s<=5;s++)n+=e.echoList(n,s,r);n+='<li><em>...</em></li>',n+='<li><a href="javascript:'+r+'.jump('+i+');" target="_self">'+i+'</a></li>'}else if(a-3>1&&a+3>=i){n+='<li><a href="javascript:'+r+'.jump(1);" target="_self">1</a></li>',n+='<li><em>...</em></li>';for(var s=i-5;s<=i;s++)n+=e.echoList(n,s,r)}n+=function(){var e='';return a==i?(e+='<li><span>'+t.next+'</span></li>',t.last&&(e+='<li><span>'+t.last+'</span></li>')):(e+='<li><a href="javascript:'+r+'.jump('+(a+1)+');" target="_self">'+t.next+'</a></li>',t.last&&(e+='<li><a href="javascript:'+r+'.jump('+i+');" target="_self">'+t.last+'</a></li>')),e}(),e.isFull&&(n+='<li><em>跳转到第</em><input type="text" onblur="'+r+'.trim(this);" value="'+l+'" /><em>页</em><button type="button" onclick="'+r+'.jump(this);">确定</button></li>'),n='<ul class="ui-paging">'+n+'</ul>',e.wrap.html(n)}}},i.extend({paging:function(t,i){void 0===i&&(i=t,t='paging');var a=e[t]=new n(i);return'function'!=typeof e[t].refreshCallback?(a.query(!0),a):(a.query('refresh'),a)}}),e.Paging=n}(window,document,jQuery)}),Nui.define('src/components/datagrid',['component'],function(e){var t=this,i=(t.require('src/paging'),function(){var e,t,i=document.createElement('div');return i.style.cssText='position:absolute; top:-10000em; left:-10000em; width:100px; height:100px; overflow:hidden;',e=document.body.appendChild(i).clientWidth,i.style.overflowY='scroll',t=i.clientWidth,document.body.removeChild(i),e-t}());return t.extend(e,{static:{_init:function(){var e=this;Nui.doc.on('click',function(){Nui.each(e.__instances,function(e){!0===e.options.isActive&&e.element.find('.datagrid-tbody table-row.s-crt').removeClass('s-crt')})})},_resize:function(){Nui.each(this.__instances,function(e){e._theadHeight(),e._resetHeight()})},_hasChildren:function(e){return Nui.isArray(e.children)&&e.children.length},_getRowNumber:function(e,t,i,a,n){var l=this;return i[t]||(i[t]=!0),void 0===a&&(a=0),Nui.each(e,function(e){e.cellid=a++;var r=e.order;!0===r&&(r='desc'),'asc'!==r&&'desc'!==r||(e.order={},e.order[r]=1),e.order&&!e.order.field&&(e.order.field=e.field),n&&n.fixed&&(e.fixed=n.fixed),l._hasChildren(e)&&(a=l._getRowNumber(e.children,t+1,i,a,e))}),n?a:i.length},_colspan:function(e,t){var i=this;return void 0===t&&(t=0),Nui.each(e,function(e){i._hasChildren(e)?t+=i._colspan(e.children,t):t+=1}),t}},options:{data:null,columns:null,isFixed:!0,isLine:!1,isActive:!0,isBorder:!0,url:null,paging:null,fields:null,dataName:'list',width:'100%',height:'auto',footer:'',onFocusin:null,onFocusout:null,onFocus:null,onBlur:null,stringify:null,onRowClick:null,onRowDblclick:null,onCheckboxChange:null,onRender:null},_template:{layout:'<div class="<% className %>"><div class="datagrid-body"><%include "table"%></div><%if footer || paging%><div class="datagrid-foot"><%if footer%><%footer%><%/if%><%if paging%><div class="datagrid-paging"></div><%/if%></div><%/if%></div>',table:'<%each rows v k%><%if v.length%><div class="datagrid-table<%if k === "left" || k === "right"%> datagrid-table-fixed<%/if%> datagrid-table-<%k%>"><div class="datagrid-title"><div class="datagrid-thead"><table class="ui-table"><thead class="table-thead"><%each v%><tr class="table-row"><%each $value val%><th class="table-cell"<%include "attr"%>><span class="cell-text"><%if val.content === "checkbox"%><span class="ui-checkradio"><input type="checkbox" name="datagrid-checkbox"></span><%else%><%val.title%><%if typeof val.order === "object"%><%var asc = Nui.type(val.order.asc, ["String", "Number"]), desc = Nui.type(val.order.desc, ["String", "Number"])%><em class="datagrid-order<%if asc && desc%> datagrid-order-both<%/if%>" field="<%val.order.field%>"><%if asc%><b class="datagrid-order-asc" type="asc" value="<%val.order.asc%>"><i></i><s></s></b><%/if%><%if desc%><b class="datagrid-order-desc" value="<%val.order.desc%>"><i></i><s></s></b><%/if%></em><%/if%><%/if%></span></th><%/each%></tr><%/each%></thead><%if isFixed !== true%><tbody class="table-tbody datagrid-inner"></tbody><%/if%></table></div></div><%if isFixed === true%><div class="datagrid-inner"></div><%/if%></div><%/if%><%/each%>',tbody:'<%if isFixed === true%><div class="datagrid-tbody"><table class="ui-table"><tbody class="table-tbody"><%include "rows"%></tbody></table></div><%else%><%include "rows"%><%/if%>',rows:'<%if list && list.length%><%var toLower = function(str){return str.replace(/([A-Z])/g, function(a){return "-"+a.toLowerCase()})}%><%each list%><tr class="table-row" data-row-index="<%$index%>"<%include "data"%>><%each cols val key%><%var _value%><%if val.field && (!val.content || "number checkbox input".indexOf(val.content)===-1)%><%var _value=$value[val.field]%><%elseif val.content === "number"%><%var _value=$index+1%><%elseif val.content === "checkbox"%><%var _value={"name":val.field ? val.field : "datagrid-checkbox", "value":$value[val.field]!==undefined?$value[val.field]:""}%><%elseif val.content === "input"%><%var _value={"name":val.field ? val.field : "datagrid-input", "class":"datagrid-input", "value":$value[val.field]!==undefined?$value[val.field]:""}%><%else%><%var _value=val.content%><%/if%><td class="table-cell"<%include "attr"%>><span class="cell-text<%if val.nowrap === true%> cell-nowrap<%/if%>"><%if typeof val.filter === "function"%><%var _value = val.filter(_value, val.field, $value)%><%/if%><%if val.content === "checkbox" && typeof _value === "object"%><span class="checkradio"><input type="checkbox"<%include "_attr"%>></span><%elseif val.content === "input" && typeof _value === "object"%><input type="text" autocomplete="off"<%include "_attr"%>><%else%><%_value%><%/if%></span></td><%/each%></tr><%/each%><%else%><tr><td class="table-cell"></td></tr><%/if%>',head:'',foot:'',_attr:'<%each _value _v _k%> <%_k%>="<%_v%>"<%/each%>',attr:'<%each val value name%><%if "width field align valign colspan rowspan cellid".indexOf(name) !== -1%> <%name%>="<%value%>"<%/if%><%/each%>',data:'<%if fields%><%each $value value field%><%if fields === true || $.inArray(field, fields) !== -1%> data-<%toLower(field)%>=<%if typeof stringify === "function"%><%stringify(value)%><%else%>"<%value%>"<%/if%><%/if%><%/each%><%/if%>'},_init:function(){this._exec()},_exec:function(){var e=this,t=e.options;e._getTarget()&&Nui.isArray(t.columns)&&t.columns.length&&(e._columns={left:[],normal:[],right:[]},Nui.each(t.columns,function(t,i){'left'===t.fixed||!0===t.fixed?e._columns.left.push(t):'right'===t.fixed&&e._columns.right.push(t),e._columns.normal.push(t)}),e._create())},_create:function(){var e=this,t=e.options,i=e.constructor;e._rows={},e._cols={},e._rowNumber=i._getRowNumber(t.columns,0,[]),Nui.each(e._columns,function(t,i){e._setRowCol(t,i)}),e._hasLeftRight=this._cols.left.length||this._cols.right.length,e.element=$(e._tpl2html('layout',e._tplData({rows:e._rows,isFixed:t.isFixed,paging:'object'==typeof t.paging,footer:t.footer}))).appendTo(e.target),e._body=e.element.children('.datagrid-body'),e._tableNormal=e._body.children('.datagrid-table-normal'),e._tableNormalInner=e._tableNormal.children('.datagrid-inner'),e._tableNormalTitle=e._tableNormal.children('.datagrid-title'),e._tableNormalThead=e._tableNormalTitle.children('.datagrid-thead'),e._tableLeft=e._body.children('.datagrid-table-left'),e._tableRight=e._body.children('.datagrid-table-right'),e._tableFixed=e._body.children('.datagrid-table-fixed'),e._tableFixedInner=e._tableFixed.children('.datagrid-inner'),e._foot=e.element.children('.datagrid-foot'),e._theadHeight(),e._initList(),e._bindEvent()},_initList:function(){var e=this,t=e.options;if(t.paging){t.paging.wrap=e._foot.children('.datagrid-paging');var i='paging_'+e.__id,a=t.paging.echoData;t.paging.echoData=function(i,n){e._list=i[t.dataName]||[],e._render(),'function'==typeof a&&a.call(t.paging,i,n)},e.paging=$.paging(i,t.paging)}else t.data&&(e._list=t.data,e._render())},_bindEvent:function(){var e=this;e._on('scroll',e._tableNormalInner,function(){e._scroll($(this))}),e._event()},_render:function(){var e=this,t=e.options;Nui.each(e._cols,function(i,a){e.element.find('.datagrid-table-'+a+' > .datagrid-inner').html(e._tpl2html('tbody',{isFixed:t.isFixed,cols:i,fields:t.fields?!0===t.fields?t.fields:[].concat(t.fields):null,list:e._list,stringify:t.stringify}))}),e._resetHeight(),'function'==typeof t.onRender&&t.onRender.call(e)},_resetHeight:function(){var e=this,t=e.options;if(e._rowHeight(),!0===t.isFixed){var a=e.target.innerHeight(),n=e._tableNormalInner.children('.datagrid-tbody'),l=a-e._tableNormalTitle.outerHeight()-e._foot.outerHeight();e._tableNormal.find('.datagrid-thead > .ui-table').width(t.width),e._tableNormal.find('.datagrid-tbody > .ui-table').width(t.width),n.children().width()>e._tableNormalInner.width()?e._tableFixedInner.height(l-i):e._tableFixedInner.height(l),e._tableNormalInner.height(l);var r=e._tableNormalInner.innerHeight()>=n.outerHeight()?0:i;Nui.bsie7||e._tableNormalTitle.css({'padding-right':r}),e._tableRight.css('right',r)}},_theadHeight:function(){var e=this;e._hasLeftRight&&e._tableFixed.find('.table-thead .table-cell').each(function(t){var i=$(this),a=i.attr('cellid'),n=e._tableNormalThead.find('.table-cell[cellid="'+a+'"]'),l=n.innerHeight();Nui.browser.msie&&(Nui.browser.version>8?l+=1:7==Nui.browser.version&&(l-=1)),i.height(l)})},_rowHeight:function(){var e=this;if(e._hasLeftRight){var t=e._tableLeft.find('.table-tbody .table-row'),i=e._tableLeft.find('.table-tbody .table-row');e._tableNormal.find('.table-tbody .table-row').each(function(e){var a=$(this).outerHeight();t.eq(e).height(a),i.eq(e).height(a)})}},_setRowCol:function(e,t,i){var a=this,n=(a.options,a.constructor);void 0===i&&(i=0),a._rows[t]||(a._rows[t]=[]),a._cols[t]||(a._cols[t]=[]),e.length&&!a._rows[t][i]&&(a._rows[t][i]=[]),Nui.each(e,function(e){var l=n._hasChildren(e),r={};l&&(r.colspan=n._colspan(e.children),a._setRowCol(e.children,t,i+1)),Nui.each(e,function(e,t){'children'!==t&&'function'!=typeof e&&(r[t]=e)}),l||(r.rowspan=a._rowNumber-i,a._cols[t].push(e)),a._rows[t][i].push(r)})},_callback:function(){var e=arguments,t=e[0],i=this.options['on'+t];if('function'==typeof i)return i.apply(this,Array.prototype.slice.call(e,1))},_events:{'click .table-tbody .table-row':'_active _getRowData _rowclick','dblclick .table-tbody .table-row':'_getRowData _rowdblclick','focus .datagrid-input':'_enable _getRowData _focus','blur .datagrid-input':'_enable _getRowData _blur','focusin .table-tbody .table-cell':'_focusin','focusout .table-tbody .table-cell':'_focusout','click .datagrid-order > b':'_order'},_order:function(e,t){t.toggleClass('s-crt'),t.siblings().removeClass('s-crt');var i=t.parent(),a=i.attr('field'),n=i.children('b.s-crt').attr('value');this.paging&&(this.paging.condition[a]=n,this.paging.query(!0))},_enable:function(e,t){return!t.hasClass('s-dis')&&!t.hasClass('s-disabled')},_active:function(e,t){var i=this;!0===i.options.isActive&&(i.element.find('.datagrid-tbody .table-row[data-row-index="'+t.index()+'"]').addClass('s-crt').siblings().removeClass('s-crt'),Nui.each(i.__instances,function(e){e!==i&&!0===e.options.isActive&&e.element.find('.datagrid-tbody table-row.s-crt').removeClass('s-crt')}),e.stopPropagation())},_getRowData:function(e,t){return t.hasClass('table-row')?t.data():t.closest('.table-row').data()},_focusin:function(e,t,i){return this._callback('Focusin',e,t,i)},_focusout:function(e,t,i){return this._callback('Focusout',e,t,i)},_rowclick:function(e,t,i){return this._callback('RowClick',e,t,i)},_rowdblclick:function(e,t,i){return this._callback('RowDblclick',e,t,i)},_scroll:function(e){var t=this,i=e.scrollTop(),a=e.scrollLeft();t._tableFixedInner.scrollTop(i),t._tableNormalThead.scrollLeft(a)},resize:function(){this._theadHeight(),this._resetHeight()}})}),Nui.define('./script/demo',function(require,imports,renders,extend){require('src/components/datagrid')({target:'#data',width:'110%',footer:'11',data:[{id:'11111111',prov:'安徽',city:'蚌埠',address:'安徽蚌',job:'php工程师',name:'阿牛'},{id:'22222222',prov:'浙江',city:'杭州',address:'浙江杭州',job:'前端工程师',name:'尹加增'},{id:'22222222',prov:'浙江',city:'杭州',address:'浙江杭州',job:'前端工程师',name:'尹加增'},{id:'22222222',prov:'浙江',city:'杭州',address:'浙江杭州',job:'前端工程师',name:'尹加增'},{id:'22222222',prov:'浙江',city:'杭州',address:'浙江杭州',job:'前端工程师',name:'尹加增'},{id:'22222222',prov:'浙江',city:'杭州',address:'浙江杭州',job:'前端工程师',name:'尹加增'},{id:'22222222',prov:'浙江',city:'杭州',address:'浙江杭州',vC:{a:1},a:[{a:1}],job:'前端工程师',name:'尹加增'},{id:'22222222',prov:'浙江',city:'杭州',address:'浙江杭州',job:'前端工程师',name:'尹加增'},{id:'22222222',prov:'浙江',city:'杭州',address:'浙江杭州',job:'前端工程师',name:'尹加增'},{id:'22222222',prov:'浙江',city:'杭州',address:'浙江杭州',job:'前端工程师',name:'尹加增'},{id:'22222222',prov:'浙江',city:'杭州',address:'浙江杭州',job:'前端工程师',name:'尹加增'}],columns:[{title:'编号',content:'number',width:'40'},{title:'ID',field:'id',width:'200',order:{desc:'1',asc:'2'},select:[{text:'',value:''}]},{title:'期初余额',field:'address',width:'400',children:[{title:'借方',width:'200',field:'buaddress',nowrap:!0,filter:function(e,t,i){return''}},{title:'借方',width:'200',order:'asc',field:'buaddress',nowrap:!0}]},{title:'姓名',order:'desc',field:'certificate',content:'input',width:200},{title:'职业',field:'buname'},{title:'操作',content:'<a class="datagrid-button" on-click="alter">修改</a> <a class="datagrid-button" on-click="delete">删除</a>',width:150,fixed:'right'}],onRowClick:function(e,t,i){},onRowDblclick:function(e,t,i){},onRender:function(){console.log(this)}})});
//# sourceMappingURL=demo-min.js.map?v=7315e58