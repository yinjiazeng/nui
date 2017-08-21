/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 实用工具集
 */

Nui.define('util', {
    
    /**
     * @func 常用正则表达式
     */
    regex:{
        //手机
        mobile:/^0?(13|14|15|17|18)[0-9]{9}$/,
        //电话
        tel:/^[0-9-()（）]{7,18}$/,
        //邮箱
        email:/^\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
        //身份证
        idcard:/^\d{17}[\d|x]|\d{15}$/,
        //中文
        cn:/^[\u4e00-\u9fa5]+$/,
        //税号
        taxnum:/^[a-zA-Z0-9]{15,20}$/
    },

    /**
     * @func 四舍五入保留小数，原生toFixed会有精度问题
     * @return <String>
     * @param digit <String, Number> 待转换数字
     * @param decimal <Number> 保留位数
     * @param number <Number> 小数部分末尾最多显示0的数量
     */
    toFixed:function(digit, decimal, number){
        if(isNaN(digit)){
            return digit
        }

        //默认末尾只保留2个0
        if(number === undefined){
            number = 2
        }

        decimal = decimal || 0;

        //将数字转换为字符串，用于分割
        var value = digit.toString();

        //补零
        var mend = function(num){
            var zero = '';
            while(num > 0){
                zero += '0';
                num--
            }
            return zero
        }

        //正负数
        var pre = '';
        if(value < 0){
            value = value.replace('-', '');
            pre = '-';
        }

        //获取小数点所在位置
        var i = value.indexOf('.');
        //存在小数点
        if(i !== -1 && decimal >= 0){
            var integer = parseInt(value.substr(0, i));
            //小数部分转为0.xxxxx
            var _decimal = '0' + value.substr(i);
            var num = '1' + mend(decimal);
            _decimal = (Math.round(_decimal*num)/num).toFixed(decimal);
            //小数四舍五入后，若大于等于1，整数部分需要加1
            if(_decimal >= 1){
                integer = (integer + 1).toString()
            }
            value = pre + integer + _decimal.substr(1)
        }
        //整数就直接补零
        else if(decimal > 0){
            value = pre + value + '.' + mend(decimal)
        }

        if(number !== null && number >= 0 && number < decimal){
            value = value.replace(/0+$/, '');
            var i = value.indexOf('.'), len = 0;
            if(i !== -1){
                len = value.substr(i+1).length;
            }
            while(len < number){
                value = value + '0';
                len++;
            }
        }
        
        return value
    },

    /**
     * @func 获取url参数值
     * @return <String, Object>
     * @param name <String, Undefined> 参数名，不传则以对象形式返回全部参数
     * @param urls <String, Undefined> url地址，默认为当前访问地址
     */
    getParam:function(name, urls){
        var url = decodeURI(urls||location.href), value = {};
        startIndex = url.indexOf('?');
        if(startIndex++ > 0){
            var param = url.substr(startIndex).split('&'), temp;
            Nui.each(param, function(val){
                temp = val.split('=');
                value[temp[0]] = temp[1];
            });
        }
        if(typeof name === 'string' && name){
            value = (temp = value[name]) !== undefined ? temp : '';
        }
        return value;
    },

    /**
     * @func 设置url参数值
     * @return <String> 设置后的url
     * @param name <String, Object> 参数名或者{key:value, ...}参数集合
     * @param value <String> 参数值或者url
     * @param urls <String, Undefined> url，没有则获取浏览器url
     */
    setParam:function(name, value, urls){
        var url;
        if(Nui.type(name, 'Object')){
            url = value||location.href;
            Nui.each(name, function(val, key){
                if(val){
                    if(Nui.type(val, 'Object')){
                        val = tools.getJSON(val);
                    }
                    url = tools.setParam(key, val, url);
                }
            });
        }
        else{
            url = urls||location.href;
            if(url.indexOf('?') === -1){
                url += '?';
            }
            if(Nui.type(value, 'Object')){
                value = tools.getJSON(value);
            }
            if(url.indexOf(name+'=') !== -1){
                var reg = new RegExp('('+name+'=)[^&]*');
                url = url.replace(reg, '$1'+value);
            }
            else{
                var and = '';
                if(url.indexOf('=') !== -1){
                    and = '&';
                }
                url += and+name+'='+value;
            }
        }
        return url;
    },

    /**
     * @func 检测浏览器是否支持CSS3属性
     * @return <Boolean>
     * @param style <String> 样式属性
     */
    supportCss3:function(style){
        var prefix = ['webkit', 'Moz', 'ms', 'o'],
            i, humpString = [],
            htmlStyle = document.documentElement.style,
            _toHumb = function (string) {
                return string.replace(/-(\w)/g, function ($0, $1) {
                    return $1.toUpperCase();
                });
            };
        for (i in prefix)
            humpString.push(_toHumb(prefix[i] + '-' + style));
        humpString.push(_toHumb(style));
        for (i in humpString)
            if (humpString[i] in htmlStyle) return true;
        return false;
    },

    /**
     * @func 检测浏览器是否支持Html5属性
     * @return <Boolean>
     * @param attr <String> 属性
     * @param element <String> DOM元素标签
     */
    supportHtml5:function(attr, element){
        return attr in document.createElement(element);
    },

    /**
     * @func 模拟location.href跳转
     * @return <Undefined>
     * @param url <String> 跳转的url
     * @param target <String> 跳转类型，默认为_self
     */
    location:function(url, target){
        if(url){
            jQuery('<a href="'+ url +'"'+ (target ? 'target="'+ (target||'_self') +'"' : '' ) +'><span></span></a>')
                .appendTo('body').children().click().end().remove();
        }
    },

    /**
     * @func 格式化日期
     * @return <String>
     * @param timestamp <String, Number> 时间戳，为空返回横杠“-”
     * @param format <String, Undefined> 输出格式，为空则返回时间戳
     */
    formatDate:function(timestamp, format){
        if(timestamp = parseInt(timestamp)){
            if(!format){
                return timestamp;
            }
            var date = new Date(timestamp);
            var map = {
                'M':date.getMonth()+1,
                'd':date.getDate(),
                'h':date.getHours(),
                'm':date.getMinutes(),
                's':date.getSeconds()
            }
            format = format.replace(/([yMdhms])+/g, function(all, single){
                var value = map[single];
                if(value !== undefined){
                    if(all.length > 1){
                       value = '0' + value;
                       value = value.substr(value.length-2);
                   }
                   return value;
                }
                else if(single === 'y'){
                    return (date.getFullYear() + '').substr(4-all.length);
                }
                return all;
            });
            return format;
        }
        return '-';
    },

    /**
     * @func 获取表单数据集合
     * @return <Object>
     * @param element <jQuery Object> 表单元素集合或者form元素
     * @param item <String> 将name相同表单元素值分隔，当设置为jquery选择器时，配合field参数使用，用于获取item中表单元素的数据集合
     * @param field <String> 字段名，配合item参数使用，返回对象中会包含该字段
     * @example
     * <form id="form">
     *  <input type="hidden" name="name0" value="0">
     * <div>
     *  <input type="hidden" name="name1" value="1">
     *  <input type="hidden" name="name2" value="2">
     * </div>
     * <div>
     *  <input type="hidden" name="name1" value="3">
     *  <input type="hidden" name="name2" value="4">
     * </div>
     * <form>
     * getData($('#form'), 'div', 'list').result => 
     * {
     *  name0:'0',
     *  list:[{
     *      name1:'1',
     *      name2:'2'
     *  }, {
     *      name1:'3',
     *      name2:'4'
     *  }]
     * }
     */
    getData:function(element, item, field){
        var that = this;
    	var data = {
    		'result':{},
    		'voids':0, //字段中空值数量
            'total':0 //总计多少个字段
    	}, arr = element.serializeArray(), div = ',';
        if(item && typeof item === 'string' && !field){
            div = item
        }
        Nui.each(arr, function(v, i){
            var val = Nui.trim(v.value)
        	data.total++;
        	if(!val){
        		data.voids++
        	}
        	var name = v.name;
        	if(!Nui.isArray(data.result[name])){
                data.result[name] = [];
            }
            data.result[name].push(val)
        })
        Nui.each(data.result, function(v, k){
            data.result[k] = v.join(div)
        })
        if(item && field){
            var once = false;
            data.result[field] = [];
            element.find(item).each(function(){
                var result = that.getData($(this).find('[name]')).result;
                if(!once){
                    Nui.each(result, function(v, k){
                        delete data.result[k];
                    });
                    once = true
                }
                data.result[field].push(result)
            })
        }
        return data;
    },
    /**
     * @func 获取输入框内光标位置
     * @return <Number>
     * @param element <DOM Object> 表单元素dom对象
     */
    getFocusIndex:function(element){
        var val = Nui.trim(element.value);
        var index = val.length;
        if(element.setSelectionRange){
            index = element.selectionStart;
        }
        else{
            //ie
            try{
                var temp = document.selection.createRange();
                var textRange = element.createTextRange();
                textRange.setEndPoint('endtoend', temp);
                index = textRange.text.length;
            }
            catch(e){}
        }
        return index;
    },
    /**
     * @func 检测页面是否有文本被选择
     * @return <Boolean>
     */
    isTextSelect:function(){
        var text = '';
        //ie10以及以下浏览器
        if(document.selection){
            text =  document.selection.createRange().text;
        }
        //火狐和ie11浏览器getSelection无法获取表单元素选中文本
        else if(navigator.userAgent.toLowerCase().indexOf('gecko') !== -1){
            var textArea = document.activeElement;
            text = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
        }
        //chrome safari opera
        else if(window.getSelection){
            text = window.getSelection().toString();
        }
        //低版本chrome
        else if(document.getSelection){
            text = document.getSelection().toString();
        }
        return !!text;
    }
})
