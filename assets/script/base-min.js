Nui.define('src/components/highlight/highlight',function(){return this.extend('component',{static:{_init:function(){var e=this;Nui.doc.on('click',function(){e._active&&Nui.each(e.__instances,function(e){e._active&&(e.element.find('tr.s-crt').removeClass('s-crt'),e._active=!1)}),e._active=!1})},_getcode:function(e,t){return'<code class="'+e+'">'+t+'</code>'},_getarr:function(e,t){var i=[];return e?(Nui.each(e,function(e){var s=t.indexOf(e),c=t.substr(0,s);t=t.substr(s+e.length),i.push(c),i.push(e)}),i.push(t)):i.push(t),i},_comment:function(e){return/\/\*/.test(e)?e=e.replace(/(\/\*(.|\s)*?\*\/)/g,this._getcode('comment','$1')):/\/\//.test(e)&&(e=e.replace(/(\/\/.*)$/g,this._getcode('comment','$1'))),e}},options:{tools:{copy:!0},isLight:!0,isLine:!1,isTitle:!0},_init:function(){this._exec()},_exec:function(){var e=this,t=e._getTarget();if(t){var i=t.get(0);'SCRIPT'===i.tagName&&'text/highlight'==i.type&&(e.code=t.html().replace(/^[\r\n]+|[\r\n]+$/g,'').replace(/</g,'&lt;').replace(/>/g,'&gt;'),e.element&&e.element.remove(),e._create(),e.options.isLight&&e._event())}},_title:'',_template:'<div class="<% className %>"><%if tools%><div class="tools"><%if tools.copy%><em class="copy">复制</em><%/if%></div><%/if%><div class="body"><table><%each list val key%><tr><%if isLine === true%><td class="line" number="<%key+1%>"><%if bsie7%><%key+1%><%/if%></td><%/if%><td class="code"><%val%></td></tr><%/each%></table></div><%if isTitle%><em class="title"><%title%></em><%/if%></div>',_events:{'click tr':function(e,t){this.constructor._active=this._active=!0,t.addClass('s-crt').siblings().removeClass('s-crt'),e.stopPropagation()},'click .copy':function(){alert('傻帽！逗你玩呢。')}},_create:function(){var e=this,t=e.options,i=$.extend({bsie7:Nui.bsie7,list:e._list(),title:e._title,isLine:t.isLine,tools:t.tools,isTitle:t.isTitle},e._tplData());e.element=$(e._tpl2html(i)).insertAfter(e.target)},_getCode:function(){return this.code},_list:function(){return this._getCode().split('\n')}})}),Nui.define('src/components/highlight/style',function(){return this.extend('src/components/highlight/highlight',{_title:'css',_getCode:function(){var e=this,t=e.code,i=e.constructor,s='',c=t.match(/(\/\*(.|\s)*?\*\/)|(\{[^\{\}\/]*\})/g),o=i._getarr(c,t);return Nui.each(o,function(e){Nui.trim(e)&&(e=/^\s*\/\*/.test(e)?e.replace(/(.+)/g,i._getcode('comment','$1')):/\}\s*$/.test(e)?e.replace(/(\s*)([^:;\{\}\/\*]+)(:)([^:;\{\}\/\*]+)/g,'$1'+i._getcode('attr','$2')+'$3'+i._getcode('string','$4')).replace(/([\:\;\{\}])/g,i._getcode('symbol','$1')):e.replace(/([^\:\{\}\@\#\s\.]+)/g,i._getcode('selector','$1')).replace(/([\:\{\}\@\#\.])/g,i._getcode('symbol','$1'))),s+=e}),s}})}),Nui.define('src/components/highlight/javascript',function(){return this.extend('src/components/highlight/highlight',{_title:'js',_getCode:function(){var e=this,t=e.code,i=e.constructor,s='',c=t.match(/(\/\/.*)|(\/\*(.|\s)*?\*\/)|('[^']*')|("[^"]*")/g),o=i._getarr(c,t);return Nui.each(o,function(e){$.trim(e)&&(/^\s*\/\//.test(e)?e=i._getcode('comment',e):/^\s*\/\*/.test(e)?e=e.replace(/(.+)/g,i._getcode('comment','$1')):(e=/'|"/.test(e)?e.replace(/(.+)/g,i._getcode('string','$1')):e.replace(new RegExp('(&lt;|&gt;|;|!|%|\\|\\[|\\]|\\(|\\)|\\{|\\}|\\=|\\/|-|\\+|,|\\.|\\:|\\?|~|\\*|&)','g'),i._getcode('symbol','$1')).replace(new RegExp('(abstract|arguments|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|elseif|each|enum|eval|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|include|interface|let|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var)(\\s+|\\<code)','g'),i._getcode('keyword','$1')+'$2').replace(/(\/code>\s*)(\d+)/g,'$1'+i._getcode('number','$2')).replace(/(\/code>\s*)?([^<>\s]+)(\s*<code)/g,'$1'+i._getcode('word','$2')+'$3'),e=i._comment(e))),s+=e}),s}})}),Nui.define('src/components/highlight/xml',['src/components/highlight/javascript','src/components/highlight/style'],function(e,t){return this.extend('src/components/highlight/highlight',{_title:'xml',_getCode:function(){var i=this,s=i.code,c=i.constructor,o='';return s=s.replace(/&lt;\s*![^!]+-\s*&gt;/g,function(e){return e.replace(/&lt;/g,'<<').replace(/&gt;/g,'>>')}),Nui.each(s.split('&lt;'),function(s){s=s.split('&gt;');var n=s.length;Nui.each(s,function(r,l){if(Nui.trim(r)){if(0==l){var a=!1;if(/^\s*\//.test(r))r=r.replace(/([^\r\n\/]+)/g,c._getcode('tag','$1')).replace(/^(\s*\/+)/,c._getcode('symbol','$1'));else{var g=r.match(/^\s+/)||'';/\=\s*['"]$/.test(r)&&(a=!0),r=r.replace(/^\s+/,'').replace(/(\s+)([^'"\/\s\=]+)((\s*=\s*)(['"]?[^'"]*['"]?))?/g,'$1'+c._getcode('attr','$2')+c._getcode('symbol','$4')+c._getcode('string','$5')).replace(/<code class="\w+">(\s*((<<\s*![-\s]+)|([-\s]+>>))?)<\/code>/g,'$1').replace(/^([^\s]+)/,c._getcode('tag','$1')).replace(/(\/+\s*)$/,c._getcode('symbol','$1')),r=g+r}r=c._getcode('symbol','&lt;')+r,a||(r+=c._getcode('symbol','&gt;'))}else if(3===n&&1===l&&/\s*['"]\s*/.test(r))r=r.replace(/(\s*['"]\s*)/,c._getcode('symbol','$1'))+c._getcode('symbol','&gt;');else{var h=$.trim(s[0]).toLowerCase();r='style'==h?t.exports._getCode.call(i,r):'script'==h?e.exports._getCode.call(i,r):r.replace(/(.+)/g,c._getcode('text','$1'))}r=r.replace(/<<\s*![^!]+-\s*>>/g,function(e){return e.replace(/([^\r\n]+)/g,c._getcode('comment','$1')).replace(/<</g,'&lt;').replace(/>>/g,'&gt;')})}o+=r})}),o}})}),Nui.define('{script}/base',['src/components/highlight/xml'],function(e){this.imports('../style/base');var t=location.hash.replace('#',''),i=$('.g-main'),s=i.find('h2'),c=(s.length,$('.m-menu ul'));return{init:function(){this.setYear(),i.find('h2[id]').length&&(this.event(),this.position())},setYear:function(){$('#nowyear').text('-'+(new Date).getFullYear())},position:function(){if(t){var e=$('[id="'+t+'"]');e.length&&i.scrollTop(e.position().top)}},event:function(){i.scroll(function(){var e=i.scrollTop();s.each(function(t){var i=$(this),o=this.id,n=i.position().top-20,r=0,l=s.eq(t+1);if(r=l.length?l.position().top-20:$('.mainbox').outerHeight(),c.find('a.s-crt').removeClass('s-crt'),e>=n&&e<r)return c.find('a[href="#'+o+'"]').addClass('s-crt'),i.removeAttr('id'),location.hash=o,i.attr('id',o),!1})})}}});
//# sourceMappingURL=base-min.js.map?v=eb2c03b