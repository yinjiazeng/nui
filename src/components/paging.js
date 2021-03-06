Nui.define(function(require){
    this.imports('../assets/components/paging/index')

    var component = require('../core/component');
    var request = require('../core/request');
    
    function Paging(options){
        var that = this;
        that.load = false;
        //获取实例对象的名称
        that.instance = function(){
            for(var attr in window){
                if(window[attr] == that){
                    return attr.toString();
                }
            }
        }
        $.extend(that, $.extend(true, {
            /**
             * @function ajax请求url
             * @type <String>
             */
            url:'',
            /**
             * @function 页码容器
             * @type <Object>
             */
            wrap:null,
            /**
             * @function 传递参数值
             * @type <String>
             * @desc 将传递参数封装为json字符串，后台接收该参数来获取该json
             */
            paramJSON:'',
            /**
             * @function 当页显示数量
             * @type <Number>
             */
            pCount:10,
            /**
             * @function 当前页码
             * @type <Number>
             */
            current:1,
            /**
             * @function 列表数据总数
             * @type <Number>
             */
            aCount:0,
            /**
             * @function 是否初始化展示最后一页
             * @type <Boolean>
             */
            last:false,
            /**
             * @function 是否读取全部数据
             * @type <Boolean>
             * @desc 该参数启用后，接口将无法接收到pCount和current参数，前后端约定好，若没接收到这2个参数，将返回全部数据
             */
            allData:false,
            /**
             * @function 是否完整形式展示分页
             * @type <Boolean>
             */
            isFull:true,
			/**
             * @function 滚动分页配置
             * @type <Obejct>
             */
            vars:{
                aCount:'aCount',
                pCount:'pCount',
                current:'current'
            },
            dataField:'',
            //是否显示页码
            isPage:true,
            number:null,
            container:null,
			scroll:{
				enable:false
			},
            /**
             * @function ajax配置信息
             * @type <JSON Obejct, Function>
             */
            ajax:{},
            /**
             * @function 接口接收参数
             * @type <JSON Obejct>
             */
            condition:{},
            /**
             * @function loading加载效果
             * @type <JSON Obejct>
             */
            loading:'正在加载数据...',
            /**
             * @function 上一页下一页按钮文字
             * @type <JSON Obejct>
             */
            button:{
                prev:'«',
                next:'»',
                first:'',
                last:''
            },
            /**
             * @function 拓展分页部分
             * @type <JSON Obejct>
             */
            extPage:{
                wrap:null,
                desc:'',
                prev:'上一页',
                next:'下一页'
            },
            /**
             * @function 传统页面刷新方式
             * @type <Null, Function>
             * @param current <Number> 目标页码
             * @desc 值为函数将启用
             */
            refreshCallback:null,
            /**
             * @function ajax响应数据并且分页创建完毕后回调函数
             * @type <Function>
             * @param data <JSON Object> 响应数据
             */
            endCallback:$.noop,
            /**
             * @function 点击分页按钮回调函数
             * @type <Function>
             * @param current <Number> 目标页码
             */
            jumpCallback:$.noop,
            /**
             * @function 分页数据处理
             * @type <Function>
             * @param data <JSON Object> 响应数据
             */
            echoData:$.noop
        }, Paging.options, options||{}));
        that.container = $(that.container||window);

        if(that.number){
            that.pCount = that.number[0] ||  that.pCount;
        }

		if(that.scroll.enable === true){
			that.wrap = null;
			that.children = that.container[0] === window ? $(document.body) : that.container.children();
			that.container.scroll(function(){
				that.resize();
			}).resize(function(){
				that.resize();
			});
		}
    }
    
    Paging.options = {};
    Paging.config = function(options){
    	$.extend(true, Paging.options, options||{})
    }

    Paging.prototype = {
        constructor:Paging,
        //页面跳转
        jump:function(page){
            var that = this, count = Math.ceil(that.aCount/that.pCount), current;
            if(that.aCount > 0){
                if(typeof(page) === 'object'){
                    var val;
                    if(page.nodeName === 'INPUT'){
                        val = $.trim(page.value);
                    }
                    else{
                        val = $(page).prevAll('input').val();
                    } 
                    if(val <= count && val != that.current){
                        current = parseInt(val);
                    }
                    else{
                        current = that.current;
                    }
                }
                else if(page > 0 && page <= count){
                    current = page;
                }
                else if(page < 0){
                    current = count + page + 1;
                }
                else{
                    current = count;
                }
            }
            else{
                current = page;
            }
            that.current = that.condition.current = current;
            that.jumpCallback(current);
            if(typeof that.refreshCallback === 'function'){
                that.refreshCallback(current);
                that.create();
                return;
            }
            that.getData('jump');
        },
        query:function(type){
            var that = this;
            that.load = false;
            if(typeof that.refreshCallback !== 'function' || type !== 'refresh'){
                if(type){
                    if(type !== 'reload'){
                        that.current = 1;
                    }
                    that.filter();
                    that.condition.current = that.current;
                }
                else{
                    that.condition = {current:that.current = 1};
                }
                that.getData(type||'');
            }
            else{
                that.create();
            }
            
        },
        filter:function(){
            var that = this;
            for(var i in that.condition){
                if(that.condition[i] === '' || typeof(that.condition[i]) == 'undefined' || that.condition[i] === null){
                    delete that.condition[i];
                }
            }
        },
        //ajax请求数据
        getData:function(type){
            var that = this, renderType = type;
            that.condition.pCount = that.pCount;
            if(that.allData === true){
                delete that.condition.pCount;
                delete that.condition.current;
            }
            var param = $.extend({}, that.condition);
            var pCount = param.pCount;
            var current = param.current;
            delete param.pCount;
            delete param.current;
            param[that.vars.pCount] = pCount;
            param[that.vars.current] = current;
            if(that.paramJSON){
                param = [];
                $.each(that.condition, function(key, val){
                    param.push(key+':'+val);
                });
                var temp = param.length ? '{'+param.join(',')+'}' : '';
                param = {};
                param[that.paramJSON] = temp;
            }
            
            var ajax = typeof that.ajax === 'function' ? that.ajax() : that.ajax;
            delete ajax.success;

            if(!that.load){
            	that.load = true;
            	request($.extend({}, true, {
                    url:that.url,
                    data:param,
                    success:function(res){
                        var data = res;
                        if(that.dataField){
                            data = res[that.dataField]||{}
                        }
                        try{
                            data.current = that.current;
                        }
                        catch(e){}
                        var stop = 0, index;
                        if(that.container[0] !== window && renderType !== 'reload' && renderType !== 'noloading' && (renderType !== 'jump' || (renderType === 'jump' && !that.scroll.enable))){
                        	that.container.scrollTop(0)
                        	that.container.scrollLeft(0)
                        }
                        if(renderType === 'reload'){
                            var box = that.container;
                            if(that.selector){
                                box = that.container.find(that.selector);
                                stop = box.scrollTop()
                            }
                            else{
                                stop = box.scrollTop()
                            }
                            index = box.find('tr.rows.s-crt').index();
                        }

                        that.echoData(data, renderType);

                        that.aCount = data[that.vars.aCount]||data.aCount;
                        that.load = false;
						if(that.scroll.enable === true){
							that.resize();
						}
                        if(stop > 0){
                            var box = that.container;
                            if(that.selector){
                                box = that.container.find(that.selector);
                                box.scrollTop(stop)
                            }
                            else{
                                box.scrollTop(stop)
                            }
                            if(index >= 0){
                                box.find('tr.rows').eq(index).addClass('s-crt');
                            }
                        }
                        if(that.last === true){
                            that.last = false;
                            that.jump(-1);
                            return;
                        }
                        that.create();
                        that.endCallback(data);
                    },
                    error:function(){
                        that.load = false;
                    }
                }, ajax||{}), renderType === 'jump' && that.scroll.enable === true ? null : that.loading);
            }
        },
        //过滤分页中input值
        trim:function(o){
            var val = Math.abs(parseInt($(o).val()));
            !val && (val = 1);
            $(o).val(val);
        },
        echoList:function(html, i, instance){
            var that = this;
            if(that.current == i){
                html = '<li><span class="s-crt">'+ i +'</span></li>';
            }
            else{
                html = '<li><a href="javascript:'+ instance +'.jump('+ i +');" target="_self">'+ i +'</a></li>';
            }
            return html;
        },
		resize:function(){
			var that = this;
			try{
				var stop = that.container.scrollTop();
				var height = that.container.height();
                var cheight = that.children.outerHeight();
				if(!that.load && Math.ceil(that.aCount/that.pCount) > that.current && ((stop === 0 && cheight <= height) || (height + stop >= cheight))){
					that.jump(++that.current);
				}
			}
			catch(e){
				
			}
		},
        //创建分页骨架
        create:function(){
            var that = this, button = that.button,
                count = Math.ceil(that.aCount/that.pCount), current = that.current,
                html = '', next = count == current ? 1 : current+1,
                instance = that.instance(), extPage = that.extPage;

            if(extPage.wrap){
                var page = '<div>';
                page += current == count || count == 0 ?
                     '<span>'+ extPage.next +'</span>' : '<a href="javascript:'+ instance +'.jump('+ (current+1) +');" target="_self">'+ extPage.next +'</a>';
                page += current == 1 ?
                     '<span>'+ extPage.prev +'</span>' : '<a href="javascript:'+ instance +'.jump('+ (current-1) +');" target="_self">'+ extPage.prev +'</a>';
                page += '</div><em>'+ (count !== 0 ? current : 0) +'/'+ count +'</em><strong>共'+ that.aCount + extPage.desc +'</strong>';
                extPage.wrap.html(page);
            }
            
            if(!that.wrap || !that.isPage){
                return;
            }
            
            if(!count){
                that.wrap.empty();
                return;
            }

            html += (function(){
                var tpl = '';
                if(current == 1){
                    if(button.first){
                        tpl += '<li><span>'+ button.first +'</span></li>';
                    }
                    tpl += '<li><span>'+ button.prev +'</span></li>';
                }
                else{
                    if(that.button.first){
                        tpl += '<li><a href="javascript:'+ instance +'.jump(1);" target="_self">'+ button.first +'</a></li>';
                    }
                    tpl += '<li><a href="javascript:'+ instance +'.jump('+ (current-1) +');" target="_self">'+ button.prev +'</a></li>';
                }
                return tpl;
            })();
            if(count <= 7){
                for(var i = 1; i <= count; i++){
                    html += that.echoList(html, i, instance);
                }
            }
            else{
                if(current-3 > 1 && current+3 < count){
                    html += '<li><a href="javascript:'+ instance +'.jump(1);" target="_self">1</a></li>';
                    html += '<li><em>...</em></li>';
                    for(var i = current-2; i <= current+2; i++){
                        html += that.echoList(html, i, instance);
                    }
                    html += '<li><em>...</em></li>';
                    html += '<li><a href="javascript:'+ instance +'.jump('+ count +');" target="_self">'+ count +'</a></li>';
                }
                else if(current-3 <= 1 && current+3 < count){
                    for(var i = 1; i <= 5; i++){
                        html += that.echoList(html, i, instance);
                    }
                    html += '<li><em>...</em></li>';
                    html += '<li><a href="javascript:'+ instance +'.jump('+ count +');" target="_self">'+ count +'</a></li>';
                }
                else if(current-3 > 1 && current+3 >= count){
                    html += '<li><a href="javascript:'+ instance +'.jump(1);" target="_self">1</a></li>';
                    html += '<li><em>...</em></li>';
                    for(var i = count-5; i <= count; i++){
                        html += that.echoList(html, i, instance);
                    }
                }
            }
            html += (function(){
                var tpl = '';
                if(current == count){
                    tpl += '<li><span>'+ button.next +'</span></li>';
                    if(button.last){
                        tpl += '<li><span>'+ button.last +'</span></li>';
                    }
                }
                else{
                    tpl += '<li><a href="javascript:'+ instance +'.jump('+ (current+1) +');" target="_self">'+ button.next +'</a></li>';
                    if(button.last){
                        tpl += '<li><a href="javascript:'+ instance +'.jump('+ count +');" target="_self">'+ button.last +'</a></li>';
                    }
                }
                return tpl;
            })();
            if(that.isFull){
                html += '<li><em>跳转到第</em><input type="text" onblur="'+ instance +'.trim(this);" value="'+ next +'" /><em>页</em><button type="button" onclick="'+ instance +'.jump(this);">确定</button></li>';
            }
            html = '<div class="nui-paging"><ul class="ui-paging">' + html + '</ul>';
            if(that.number){
                html += '<div class="ui-paging-number"><span class="text">当前页显示</span><select style="display:none;">';
                for(var i=0; i<that.number.length; i++){
                    html += '<option value="'+ that.number[i] +'">'+ that.number[i] +'</option>'
                }
                html += '</select><span class="text">条</span></div>'
            }
            html += '</div>'
            that.wrap.html(html);
            if(that.number){
                that.wrap.find('select').imitSelect({
                    value:that.pCount,
                    callback:function(me, item){
                        if(item){
                            that.pCount = me.val();
                            that.query(true)
                        }
                    }
                })
            }
            if(that.isFull){
                that.wrap.find('input').on('keyup', function(e){
                    if(e.keyCode === 13){
                        that.jump(this)
                    }
                })
            }
        }
    }
    
    $.extend({
        paging:function(name, options){
            if(options === undefined){
                options = name;
                name = 'paging';
            }
            var page = window[name] = new Paging(options);
            if(typeof window[name].refreshCallback !== 'function'){
                page.query(true);
                return page;
            }
            page.query('refresh');
            return page
        }
    });
    
    window.Paging = Paging;
})