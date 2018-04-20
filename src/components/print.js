/**
 * @author Aniu[2018-04-20 13:03]
 * @update Aniu[2018-04-20 13:03]
 * @version 1.0.1
 * @description 打印
 */

Nui.define(function(require){
    var component = require('../core/component');

    return this.extend(component, {
        _options:{
            /**
             * @func 打印内容
             * @type {String}
             * @type {Object} jQuery对象或者DOM对象
             * @type {Array} 内容列表
             * @type {Function} 
             * @param {Object} self 当前组件实例
             * @return {String, Object, Array}
             */
            content:'',
            /**
             * @func 打印分页，当content是数组时使用
             * @type {Number}
             */
            page:0,
            /**
             * @func 打印页面标题
             * @type {String}
             */
            title:'',
            /**
             * @func 打印页面内嵌样式
             * @type {String}
             */
            style:'',
            /**
             * @func 打印页面样式地址
             * @type {String, Array}
             */
            url:'',
            /**
             * @func 打印时回调
             * @param {Object} self 当前组件实例
             */
            onInit:null
        },
        _exec:function(){
            var self = this, opts = self._options;
            if(self._getTarget()){
                self._event()
            }
            else{
                self._print()
            }
        },
        _event:function(){
            var self = this;
            self._on('click', self.target, function(e, elem){
                self._print()
            })
        },
        _content:function(content){
            if(content instanceof jQuery){
                content = content.prop('outerHTML')
            }
            else if(content.nodeName && content.outerHTML){
                content = content.outerHTML
            }
            return content
        },
        _print:function(){
            var self = this, opts = self._options, content = opts.content;
            if(content){
                if(typeof content === 'function'){
                    content = content.call(opts, self)
                }
                if(content = self._content(content)){
                    if(Nui.isArray(content)){
                        var _content = '', lastIndex = content.length - 1;
                        Nui.each(content, function(v, i){
                            _content += self._content(v);
                            if(opts.page > 0 && lastIndex !== i && (i+1) % opts.page === 0){
                                _content += '<div style="page-break-after:always;"></div>'
                            }
                        })
                        content = _content
                    }
                    self._create(content)
                }
            }
        },
        _create:function(content){
            var self = this, opts = self._options;
            var $frame = $('<iframe style="position:absolute; left:-999em; top:-999em; width:0; height:0;"></iframe>').appendTo('body');
            var _window = $frame[0].contentWindow;
            var _document = _window.document;
            _document.write('<title>'+ (opts.title || '&nbsp;') +'</title>');
            _document.write('<div class="nui-print-page">'+ content +'</div>');
            self._createStyle(_document);
            _document.close();
            _window.focus();
            setTimeout(function(){
                self._callback('Init')
                _window.print()
                $frame.remove()
                if(!self.target){
                    self.destroy()
                }
            }, 1000)
        },
        _createStyle:function(doc){
            var self = this, opts = self._options, styles = [];
            if(!opts.style && !opts.url){
                $('link[rel="stylesheet"]').each(function(){
                    styles.push({
                        url:$(this).attr('href')
                    })
                });
                $('style').each(function(){
                    styles.push({
                        text:$(this).text()
                    })
                });
            }
            else{
                if(opts.style){
                    styles.push({
                        text:opts.style
                    })
                }
                if(opts.url){
                    Nui.each([].concat(opts.url), function(v){
                        styles.push({
                            url:v
                        })
                    })
                }
            }

            Nui.each(styles, function(v){
                if(v.text){
                    doc.write('<style type="text/css" media="print">'+ v.text +'</style>');
                }
                else if(v.url){
                    doc.write('<link rel="stylesheet" type="text/css" media="print" href="'+ v.url +'">');
                }
            })
        },
        start:function(){
            this._print()
        }
    })
})