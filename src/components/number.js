/**
 * @func 数字输入
 */

Nui.define(function(require){
    var component = require('../core/component');
    var util = require('../core/util');

    return this.extend(component, {
        _options:{
            /**
             * @func 整数长度
             */
            integer:4,
            /**
             * @func 小数长度
             */
            decimal:2,
            /**
             * @func 设置正数最大值
             */
            max:0,
            /**
             * @func 设置负数最小值
             */
            min:0,
            /**
             * @func 补零位数
             */
            zeroize:0,
            /**
             * @func 是否允许值为0
             */
            zero:false,
            /**
             * @func 是否允许值为负数
             */
            minus:true,
            /**
             * @func 输入时，当值改变时回调
             * @param {Object} self 当前实例对象
             * @param {String} value 当前输入框内容
             * @param {Object} elem 当前输入框元素jQuery对象
             */
            onChange:null,
            /**
             * @func 失焦时回调
             * @param {Object} self 当前实例对象
             * @param {String} value 当前输入框内容
             * @param {Object} elem 当前输入框元素jQuery对象
             */
            onBlur:null
        },
        _event:function(){
            var self = this, opts = self._options;
            self._on('keydown', self.target, function(e, elem){
                var code = e.keyCode;
                //输入拦截
                if(
                    (e.shiftKey && $.inArray(code, self._shfitCodes) !== -1) ||
                    (!e.ctrlKey && !e.altKey && $.inArray(code, self._disCodes) !== -1)
                ){
                    return false
                }
            })

            self._on('focus', self.target, function(e, elem){
                self._focus = true
            })

            self._on('blur', self.target, function(e, elem){
                self._focus = false;
                var val = self._filter(Nui.trim(elem.val()))
                elem.val(val)
                self._callback('Blur', [val, self.target])
            })

            self._on('input propertychange', self.target, function(e, elem){
                //防止IE8-赋值时执行
                if(self._focus && !self._input){
                    self._input = true
                    self._change()
                    self._input = false
                }
            })
        },
        _exec:function(){
            if(this._getTarget()){
                this._initData()
                this._event()
            }
        },
        _initData:function(){
            var self = this, opts = self._options;
            self._dom = self.target[0];
            self._default = self._dom.value;
            //禁用输入法（仅限IE）
            self._dom.style.imeMode = 'disabled';
            self._integer = opts.integer|0;
            self._decimal = opts.decimal|0;
            self._max = self._min = '';
            if(self._integer < 0){
                self._integer = 0
            }
            if(self._decimal < 0){
                self._decimal = 0
            }
            var integer = self._integer;
            var decimal = self._decimal;
            while(integer--){
                self._max += '9'
            }
            if(self._decimal && self._max){
                self._max += '.'
                while(decimal--){
                    self._max += '9'
                }
            }
            if(opts.max > 0){
                self._max = opts.max.toString()
            }
            if(opts.minus && self._max){
                self._min = '-' + self._max
            }
            if(opts.min < 0){
                self._min = opts.min.toString()
            }
            self._diskey()
        },
        /**
         * @func 设置禁止输入的按键
         */
        _diskey:function(){
            var self = this, opts = self._options;
            //组合shift按键code
            var shfitCodes = [].concat(
                //键盘上方数字
                self._resolve(48, 57), 
                //分号、引号等特殊符号
                self._resolve(186, 222),
                //其它特殊符号
                [226]
            )

            var disCodes = [].concat(
                //括号斜杠引号
                self._resolve(219, 222),
                //字母
                self._resolve(65, 90),
                //空格、乘除等一些可视负号
                [32, 106, 111, 186, 187, 188, 191, 192, 226]
            )

            //加减
            if(!opts.minus){
                disCodes = disCodes.concat(107, 109, 189)
            }

            //小数点
            if(!self._decimal){
                disCodes = disCodes.concat(110, 190)
            }

            self._shfitCodes = shfitCodes;

            self._disCodes = disCodes;
        },
        //设置临界值
        _breakValue:function(val){
            if(this._max > 0 && val > parseFloat(this._max)){
                val = this._max
            }
            else if(this._min < 0 && val < parseFloat(this._min)){
                val = this._min
            }
            return val
        },
        /**
         * @func 分解按键代码
         */
        _resolve:function(start, end){
            var codes = []
            for(var i=start; i<=end; i++){
                codes.push(i)
            }
            return codes
        },
        /**
         * @func 输入时回调，会过滤掉特殊字符
         */
        _change:function(){
            var self = this, opts = self._options, dom = self._dom, val = Nui.trim(dom.value);
            //焦点位置
            var index = util.getFocusIndex(dom);
            //负数
            var minus = '';
            //整数部分
            var integer = '';
            //小数部分
            var decimal = '';
            //小数点位置
            var dotIndex;
            //字符数量
            var length = val.length;
            //转换半角符号以及过滤非数字减号加号小数点符号
            val = self._convert(val).replace(/[^\+\-\d\.]+/g, '')
            //存储负数符号
            if(opts.minus && val.split('-').length % 2 === 0){
                minus = '-'
                if(val.indexOf('+') !== -1){
                    minus = ''
                }
            }
            val = val.replace(/[-+]/g, '');
            var temp = val.split('.');
            integer = temp[0] || '';
            if(self._integer){
                integer = integer.substr(0, self._integer)
            }
            if(self._decimal && temp[1] !== undefined){
                decimal = '.' + (temp[1] || '').substr(0, self._decimal)
            }
            val = self._breakValue(minus + integer + decimal);
            dom.value = val;
            index += (val.length - length)
            if(self._default !== val){
                self._callback('Change', [self._filter(val), self.target])
                self._default = val
            }
            else{
                return
            }
            //重新给输入框填充过滤后的值后，焦点会在最后，因此要重新将焦点移到操作部位
            try{
                dom.setSelectionRange(index, index);
            }
            catch(e){
                setTimeout(function(){
                    try{
                        if(self._focus){
                            var range = dom.createTextRange();
                            range.moveStart('character', index);
                            range.moveEnd('character', -(val.length - index));
                            range.select()
                        }
                    }
                    catch(e){
                        
                    }
                })
            }
        },
        /**
         * @func 过滤最终值，比如将.1转为0.1
         */
        _filter:function(value){
            var self = this, opts = self._options;
            if(!value){
                return ''
            }
            value = value.replace(/^0+([^0]*)/, '$1')
                        .replace(/^\./, '0.')
                        .replace(/^\-\./, '-0.')
                        .replace(/\.$/, '')
            if(!value || (!opts.zero && !parseFloat(value))){
                return ''
            }
            value = self._breakValue(value);
            if(self._decimal && opts.zeroize){
                var arr = value.split('.');
                var integer = arr[0];
                var decimal = (arr[1] || '').replace(/0+$/, '');
                var count = opts.zeroize - decimal.length;
                while(count > 0){
                    decimal += '0';
                    count--
                }
                value = integer + '.' + decimal
            }
            return value
        },
        /**
         * @func 输入时半角数字转换为正确的数字
         */
        _convert:function(val){
            var self = this;
            var map1 = {
                '０':'0',
                '１':'1',
                '２':'2',
                '３':'3',
                '４':'4',
                '５':'5',
                '６':'6',
                '７':'7',
                '８':'8',
                '９':'9'
            }
            var map2 = {
                '－':'-',
                '．':'.',
                '。':'.'
            }
            return val.replace(/([０１２３４５６７８９－．。])+/g, function(all, single){
                var value1, value2;
                if((value1 = map1[single]) !== undefined){
                    var i = 1, length = all.length, temp = '';
                    if(length > self._integer){
                        length = self._integer
                    }
                    while(i <= length){
                        temp += value1;
                        i++;
                    }
                    return temp;
                }
                else if((value2 = map2[single]) !== undefined){
                    return value2;
                }
                return all;
            })
        },
        _delete:function(){
            if(this.target){
                this.target.css('ime-mode', 'normal')
            }
            component.exports._delete.call(this);
        },
        value:function(val){
            var self = this, dom = self._dom, obj, _val = parseFloat(val);
            if(isNaN(_val)){
                val = ''
            }
            else if(!_val){
                val = 0
            }
            if(dom && dom.nui){
                Nui.each(dom.nui, function(v, k){
                    if(k !== name && typeof v.value === 'function' && v._setStyle && v._createRules){
                        obj = v;
                        return false
                    }
                })
            }
            if(obj || dom){
                val = self._filter(val.toString())
                if(obj){
                    obj.value(val)
                }
                else if(dom){
                    dom.value = val
                }
            }
        }
    })
})