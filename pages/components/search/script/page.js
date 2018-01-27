Nui.define(function(require, imports){
    imports('../style/page.less');
    var search = require('{com}/search');
    var input = require('{com}/input');
    var data = require('./data');
    var template = require('template');
    var emps = [];
    var depts = [];

    Nui.each(data.empList, function(val){
        Nui.each(val.list, function(v){
            emps.push(v)
        })
    })

    Nui.each(data.deptList, function(val){
        Nui.each(val.list, function(v){
            depts.push(v)
        })
    })

    var all = [].concat(emps, depts);

    $('#demo1').focus(function(){
        $(this).search({
            field:'name',
            empty:'<p class="f-lh20 e-pl5 e-pr5">搜索条件为“<%value%>”未能匹配到数据</p>',
            data:emps,
            nullable:true,
            match:[{
                field:'name',
                like:function(data, value){
                    return data.indexOf(value) !== -1
                }
            }]
        }).search('show')
    })

    $('#demo2').search({
        field:'name',
        empty:'没有搜索结果，请变换搜索条件',
        nullable:true,
        focus:true,
        prompt:'搜索条件为“<%value%>”的员工或部门，匹配到<%count%>条数据',
        events:{
            'click .item-history':function(e, elem){
                this.self.value(elem.text())
            },
            'click .letters > .s-crt':function(e, elem){
                var letter = elem.text();
                var $container = this.self.activeTab.$container;
                var $list = $container.find('.con-search-list');
                var top = $container.find('.letter-box[data-letter="'+ letter +'"]').position().top;
                $list.animate({scrollTop:'+='+top}, 200)
            },
            'click .item-letter':function(e, elem){
                this.self.value(elem.data('name'))
            }
        },
        match:{
            field:'name',
            like:function(data, value){
                return data.indexOf(value) !== -1
            }
        },
        size:{
            width:100
        },
        tag:{
            multiple:true,
            clear:false,
            focus:true,
            backspace:true,
            container:'.demo2Tags > div',
            scroll:'.demo2Tags'
        },
        tabs:[{
            title:'最近',
            content:function(){
                return template.render(
                    '<ul class="con-search-list">'+
                        '<%each $list%>'+
                            '<li class="con-search-item item-history e-mt5" data-name="<%$value.name%>"><%$value.name%></li>'+
                        '<%/each%>'+
                    '</ul>'
                    , 
                    data.historyList
                )
            },
            onShow:function(){
                this.data = all;
                this.toggle()
            }
        }, {
            title:'按员工',
            content:function(){
                return this.content(data.empList)
            },
            onShow:function(){
                this.data = emps;
                this.toggle()
            }
        }, {
            title:'按部门',
            content:function(){
                return this.content(data.deptList)
            },
            onShow:function(){      
                this.data = depts;                
                this.toggle()
            }
        }],
        content:function(data){
            return template.render(
                '<div class="letters">'+
                    '<%each "★ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("")%>'+
                        '<span<%active($value)%>><%$value%></span>'+
                    '<%/each%>'+
                '</div>'+
                '<div class="con-search-list" style="max-height:320px;">'+
                    '<%each data%>'+
                    '<div class="f-clearfix letter-box" data-letter="<%$value.str%>">'+
                        '<em class="e-mt5"><%$value.str%></em>'+
                        '<ul class="list">'+
                            '<%each $value.list v%>'+
                                '<li class="con-search-item e-pl0 e-mt5 item-letter" data-name="<%v.name%>">'+
                                    '<img src="<%photo(v.photo)%>" class="f-fl" width="30" height="30" alt="<%v.name%>">'+
                                    '<span class="f-fl e-ml5 f-toe text"><%v.name%></span>'+
                                '</li>'+
                            '<%/each%>'+
                        '</ul>'+
                    '</div>'+
                    '<%/each%>'+
                '</div>'
                , 
                {
                    data:data,
                    active:function(letter){
                        var cls = '';
                        Nui.each(data, function(v){
                            if(v.str == letter){
                                cls = ' class="s-crt"';
                                return false
                            }
                        })
                        return cls
                    },
                    photo:function(val){
                        return val || '//rs.jss.com.cn/oa/oa/index/images/dept_30.png'
                    }
                }
            )
        },
        toggle:function(){
            var that = this, self = that.self;
            self.activeTab.$container.find('.con-search-item').each(function(){
                var elem = $(this), data = elem.data();
                elem.toggleClass('s-crt', that.selected(self, data))
            })
        },
        selected:function(self, data){
            var exist = false;
            Nui.each(self.tagData, function(val){
                if(data.name === val.text){
                    exist = true;
                    return false
                }
            })
            return exist
        },
        item:function(){    
            return '<li class="con-search-item<%selected($data)%>" data-index="<%$index%>" data-name="<%$data.name%>"><%$data.name%></li>'
        },
        onSelectBefore:function(self, data){
            self.value(data[this.field])
            return false
        },
        onBlur:function(self, elem){
            self.value('');
        },
        onChange:function(self){
            this.toggle()
        }
    })
})
