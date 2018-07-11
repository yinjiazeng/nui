Nui.define(function(require){
    var component = require('../core/component');
    var request = require('../core/request');

    var Uploader = this.extend(component, {
        _template:{
            element:
                '<div class="<%id%>_iframe_form" style="display:none;">'+
                    '<iframe name="<%id%>"></iframe>'+
                    '<form method="post" target="<%id%>" enctype="multipart/form-data"></form>'+
                '</div>',
            hidden:
                '<%each $data%><input type="hidden" name="<%$index%>" value="<%$value%>"><%/each%>'
        },
        _options:{
            url:'',
            dataType:'json',
            auto:true,
            data:null,
            timeout:null,
            accept:null,
            onChange:null,
            onBefore:null,
            onResponse:null,
            onSuccess:null,
            onError:null,
            onComplete:null,
            onClear:null
        },
        _exec:function(){
            var self = this, opts = self._options;
            if(self._getTarget() && self.target.is(':file')){
                if(!self.target.attr('title')){
                    self.target.attr('title', '请选择文件')
                }
                if(opts.accept && Nui.type(opts.accept, ['String', 'Array'])){
                    var accept = [];
                    Nui.each([].concat(opts.accept), function(v){
                        accept.push(v.indexOf('.') === 0 ? '' : '.' + v)
                    })
                    self.target.attr('accept', accept.join(','))
                }
                self.$file = self.target;
                self._event()
            }
        },
        _getUrl:function(){
            var self = this, url = self._options.url;
            if(typeof url === 'function'){
                url = url.call(self._options, self)
            }
            if(typeof url !== 'string'){
                url = ''
            }
            return url
        },
        _getData:function(){
            var self = this, data = self._options.data, _data = request.config('data');
            if(typeof data === 'function'){
                data = data.call(self._options, self)
            }
            if(!Nui.type(data, 'Object')){
                data = {}
            }
            if(typeof _data === 'function'){
                _data = _data()
            }
            if(Nui.type(_data, 'Object')){
                data = Nui.extend({}, _data, data)
            }
            return data
        },
        _upload:function(){
            var self = this, opts = self._options, timeout = 0, isTimeout = false, speed = 100;
            var intercept = request.config('intercept'), response, body;
            var upload = function(){
                self._timer = setTimeout(function(){
                    var complete = function(){
                        self._callback('Complete', [response])
                        clearTimeout(self._timer)
                        if(body){
                            body.empty()
                        }
                    }

                    if(opts.timeout > 0){
                        timeout += speed
                    }

                    try{
                        body = self.$iframe.contents().find('body');
                    }
                    catch(e){
                        self._callback('Error', [response = {
                            status:'fail',
                            message:'请求失败'
                        }])
                        complete()
                        return;
                    }
                    if(
                        (response = Nui.trim(body[opts.dataType === 'json' ? 'text' : opts.dataType]())) || 
                        (isTimeout = opts.timeout > 0 && timeout >= opts.timeout)
                    ){
                        clearTimeout(self._timer);
                        if(isTimeout){
                            self._callback('Error', [response = {
                                status:'timeout',
                                message:'请求超时'
                            }])
                        }
                        else{
                            if(opts.dataType === 'json'){
                                if(/^{|}$/.test(response)){
                                    response = self._callback('Response', [response]) || response;
                                    if(typeof response === 'string'){
                                        response = eval('('+ response +')');
                                    }
                                    if(typeof intercept === 'function'){
                                        intercept(response)
                                    }
                                    self._callback('Success', [response])
                                }
                                else{
                                    self._callback('Error', [response = {
                                        status:'fail',
                                        message:'请求失败'
                                    }])
                                }
                            }
                            else{
                                self._callback('Success', [response])
                            }
                        }
                        complete()
                        return
                    }
                    upload()
                }, speed)   
            }
            upload()
        },
        _event:function(){
            var self = this, opts = self._options;
            self._on('change', self.target, function(e, elem){
                self.$file = elem;
                clearTimeout(self._timer);
                if(self._callback('Change') === false){
                    return
                }
                self._off();
                self._create();
                if(opts.auto){
                    self.upload()
                }
            })
        },
        _create:function(){
            var self = this;
            var target = $(self.target.prop('outerHTML')).insertAfter(self.target);
            var name = self.constructor.__component_name;

            if(!self.element){
                self.element = $(self._tpl2html('element', {
                    id:name + '_' + self.__id
                })).appendTo('body')
            }

            if(!self.$iframe){
                self.$iframe = self.element.children('iframe')
            }

            if(!self.$form){
                self.$form = self.element.children('form')
            }

            self.$form.attr('action', self._getUrl())

            self.$form.html(self.target.removeAttr('nui_component_' + name))

            self.$form.append(self._tpl2html('hidden', self._getData()))

            self.target = self._bindComponentName(target)
            
            self._event()
        },
        _reset:function(){
            clearTimeout(this._timer);
            this.$iframe = null;
            this.$form = null;
            this.$file = null;
            component.exports._reset.call(this);
        },
        upload:function(){
            if(this._callback('Before') === false){
                return
            }
            if(this.$form){
                this.$form.submit()
                this._upload()
            }
        },
        clear:function(){
            var target = $(this.target.prop('outerHTML')).insertAfter(this.target);
            clearTimeout(this._timer);
            this._off();
            this.target.remove();
            this.target = this.$file = this._bindComponentName(target);
            this._event();
            this._callback('Clear')
        }
    })

    return Uploader
})