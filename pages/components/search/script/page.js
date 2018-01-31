Nui.define(function(require, imports){
    imports('../style/page.less');
    var search = require('{com}/search');
    var input = require('{com}/input');
    var data = require('./data');
    var pinyin = require('./pinyin');
    var template = require('template');
    var emps = [];
    var depts = [];

    var arr = [{
        text:'search组件',
        fields:{
            id:1
        }
    }, {
        text:'search组件',
        fields:{
            id:2
        }
    }]

    Nui.each(data.empList, function(val){
        Nui.each(val.list, function(v){
            v.pinyin = pinyin(v.name);
            emps.push(v)
        })
    })

    Nui.each(data.deptList, function(val){
        Nui.each(val.list, function(v){
            v.pinyin = pinyin(v.name);
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
            tag:{
                container:'.hidden',
                multiple:false
            },
            match:[{
                field:'name',
                like:function(data, value){
                    return data.indexOf(value) !== -1
                }
            }, {
                field:'pinyin',
                like:function(data, value){
                    var exist = false;
                    Nui.each(data, function(v){
                        if(v.indexOf(value) === 0){
                            exist = true
                            return false
                        }
                    })
                    return exist
                }
            }],
            setValue:function(self, data){
                return {
                    text:data.name,
                    fields:{
                        id:data.id
                    }
                }
            },
            onSelect:function(self, data){
                self.value(data.name)
            }
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
                this.self.value({
                    text:elem.text()
                })
            },
            'click .letters > .s-crt':function(e, elem){
                var letter = elem.text();
                var $container = this.self.activeTab.$container;
                var $list = $container.find('.con-search-list');
                var top = $container.find('.letter-box[data-letter="'+ letter +'"]').position().top;
                $list.animate({scrollTop:'+='+top}, 200)
            },
            'click .item-letter':function(e, elem){
                this.self.value({
                    text:elem.data('name')
                })
            }
        },
        match:[{
            field:'name',
            like:function(data, value){
                return data.indexOf(value) !== -1
            }
        }, {
            field:'pinyin',
            like:function(data, value){
                var exist = false;
                Nui.each(data, function(v){
                    if(v.indexOf(value) === 0){
                        exist = true
                        return false
                    }
                })
                return exist
            }
        }],
        size:{
            width:100
        },
        tag:{
            multiple:true,
            focus:false,
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
            self.value({
                text:data[this.field]
            })
            return false
        },
        onBlur:function(self, elem){
            self.value('');
        },
        onChange:function(self){
            this.toggle()
        }
    })

    $('[name="single"]').click(function(){
        var ele = $(this);
        $('#demo2').search('value', null);
        $('#demo2').search('option', {
            tag:{
                multiple:!ele.prop('checked')
            }
        })
    })

    $('#demo3').search({
        container:'.demo3Tags',
        field:'name',
        empty:'没有搜索结果，请变换搜索条件',
        prompt:'<p style="line-height:40px;">搜索条件为“<%value%>”的部门或员工，匹配到<%count%>条数据</p>',
        nullable:true,
        focus:true,
        match:{
            field:'name',
            like:function(data, value){
                return data.indexOf(value) !== -1
            }
        },
        tag:{
            multiple:true,
            focus:true,
            clear:true,
            container:'.demo3Tags > div > div',
            scroll:'.demo3Tags > div'
        },
        tabs:[{
            title:'组织架构',
            content:function(){
                return '<div id="ztree" class="ztree"></div>'
            },
            onShow:function(self){
                var that = this;
                if(!that.ztree){
                    require.async('../../../../assets/script/zTree/jquery.ztree.all-3.5.min.js', function(){
                        var zTreeObj,
                            setting = {
                                view:{
                                    selectedMulti:true
                                },
                                callback:{
                                    beforeClick:function(treeId, treeNode){
                                        that.toggle(treeNode)
                                        return false
                                    }
                                }
                            },
                            zTreeNodes = [{
                                name:'研发中心',
                                children:[{
                                    name:'前端开发组',
                                    children:[{
                                        name:'王福元'
                                    }, {
                                        name:'吕永宝'
                                    }, {
                                        name:'王驰君'
                                    }]
                                }, {
                                    name:'架构组',
                                    children:[{
                                        name:'董丽华'
                                    }, {
                                        name:'方兴苗'
                                    }]
                                }]
                            }, {
                                name:'产品部',
                                children:[{
                                    name:'UED组',
                                    children:[{
                                        name:'孙宛清'
                                    }, {
                                        name:'郭荣'
                                    }]
                                }, {
                                    name:'产品组',
                                    children:[{
                                        name:'邓本'
                                    }, {
                                        name:'秦文倩'
                                    }]
                                }]
                            }]
                        that.ztree = $.fn.zTree.init($('#ztree'), setting, zTreeNodes);
                        that.data = that.ztree.transformToArray(that.ztree.getNodes());
                        that.toggleZtree()
                    })
                }
                else{
                    that.toggleZtree()
                }
            }
        }],
        toggle:function(treeNode){
            var that = this, self = that.self;
            var arr = [], all = [];
            var nodes = that.ztree.transformToArray(treeNode);
            Nui.each(nodes, function(node){
                if(!node.children){
                    var data = that.setValue(self, node);
                    if(!that.selected(self, node)){
                        arr.push(data)
                    }
                    all.push(data)
                }
            })
            //没有被选择的或者全部被选择的
            if(all.length === arr.length || !arr.length){
                self.value(all)
            }
            //只有部分被选择
            else{
                self.value(arr)
            }
        },
        toggleZtree:function(){
            var that = this, self = that.self;
            Nui.each(that.data, function(v){
                if(that.selected(self, v)){
                    that.ztree.selectNode(v, true)
                }
                else{
                    that.ztree.cancelSelectedNode(v)
                }
            })
        },
        setValue:function(selr, data){
            return {
                text:data.name
            }
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
            if(data.children){
                this.toggle(data)
            }
            else{
                self.value({
                    text:data.name
                })
            }
            self.hide();
            return false
        },
        onBlur:function(self, elem){
            self.value('');
        },
        onChange:function(self){
            var that = this;
            self.activeTab.$container.find('.con-search-item').each(function(){
                var elem = $(this), data = elem.data();
                elem.toggleClass('s-crt', that.selected(self, data))
            })
            that.toggleZtree()
        }
    })
})
