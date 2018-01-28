Nui.define(['template', 'events', '{com}/layer/confirm'], function(template, events, confirm){
    var evt = events({
        elem:$('#data'),
        data:['蔬菜', '水果', '苹果'],
        template:this.renders({
            <%each $list%>
            <li class="e-mt5">
                <label>
                    <input type="checkbox" value="<%$index%>">
                    <span><%$value%></span>
                </label>
            </li>
            <%/each%>
        }),
        events:{
            'click .j-add':'add render',
            'click .j-del':'checks del remove render',
            'click .j-update':'checks update'
        },
        checks:function(){
            var arr = [], elems = this.elem.find(':checked');
            if(!this.elem.find(':checked').length){
                return false
            }
            this.elem.find(':checked').each(function(){
                arr.push($(this).val())
            })
            return arr
        },
        render:function(){
            this.elem.html(template.render(this.template, this.data))
        },
        add:function(e, elem, data){
            this.data.push('自定义');
        },
        remove:function(){
            var data = [];
            Nui.each(this.data, function(v){
                if(typeof v !== 'undefined'){
                    data.push(v)
                }
            });
            this.data = data;
        },
        del:function(e, elem, data){
            var that = this;
            Nui.each(data, function(v){
                delete that.data[v]
            });
        },
        update:function(e, elem, data){
            var that = this;
            confirm('<input type="text" style="border:1px solid #ccc; width:180px; height:24px;" />', function(self){
                var val = Nui.trim(self.main.find('input').val());
                if(val){
                    Nui.each(data, function(v){
                        that.data[v] = val;
                    })
                    that.render();
                    return true
                }
            }, '', 210)
        }
    })

    evt.render()
})