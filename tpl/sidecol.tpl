{% macro active(current='index', page='index') %}
<div class="f-fl g-sidecol">
    <div class="side">
        <ul class="m-menu f-lh28">
            <li>
                <a class="f-fs16{%if current == 'index' %} s-crt{% endif %}" href="/nui/pages/">介绍</a>
                {%if current == 'index' %}
                <ul>
                    <li>
                        <a href="#Nui是什么">Nui是什么</a>
                    </li>
                    <li>
                        <a href="#快速上手">快速上手</a>
                    </li>
                </ul>
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'doc' %} s-crt{% endif %}" href="/nui/pages/doc.html">API文档</a>
                {%if current == 'doc' %}
                <ul>
                    <li>
                        <a href="#load">load</a>
                    </li>
                    <li>
                        <a href="#config">config</a>
                    </li>
                    <li>
                        <a href="#define">define</a>
                        <ul>
                            <li>
                                <a href="#exports">exports</a>
                            </li>
                            <li>
                                <a href="#require">require</a>
                            </li>
                            <li>
                                <a href="#imports">imports</a>
                            </li>
                            <li>
                                <a href="#renders">renders</a>
                            </li>
                            <li>
                                <a href="#extend">extend</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#each">each</a>
                    </li>
                    <li>
                        <a href="#trim">trim</a>
                    </li>
                    <li>
                        <a href="#trimLeft">trimLeft</a>
                    </li>
                    <li>
                        <a href="#trimRight">trimRight</a>
                    </li>
                    <li>
                        <a href="#type">type</a>
                    </li>
                    <li>
                        <a href="#browser">browser</a>
                    </li>
                    <li>
                        <a href="#bsie">bsie</a>
                    </li>
                    <li>
                        <a href="#win">win</a>
                    </li>
                    <li>
                        <a href="#doc">doc</a>
                    </li>
                </ul>
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'util' %} s-crt{% endif %}" href="/nui/pages/util.html">实用工具</a>
                {%if current == 'util' %}
                <ul>
                    <li>
                        <a href="#regex">regex</a>
                    </li>
                    <li>
                        <a href="#getParam">getParam</a>
                    </li>
                    <li>
                        <a href="#setParam">setParam</a>
                    </li>
                    <li>
                        <a href="#supportCss3">supportCss3</a>
                    </li>
                    <li>
                        <a href="#supportHtml5">supportHtml5</a>
                    </li>
                    <li>
                        <a href="#jumpUrl">jumpUrl</a>
                    </li>
                    <li>
                        <a href="#formatDate">formatDate</a>
                    </li>
                    <li>
                        <a href="#getJSON">getJSON</a>
                    </li>
                    <li>
                        <a href="#getData">getData</a>
                    </li>
                </ul>
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'template' %} s-crt{% endif %}" href="/nui/pages/template.html">模板引擎</a>
                {%if current == 'template' %}
                <ul>
                    <li>
                        <a href="#快速上手">快速上手</a>
                    </li>
                    <li>
                        <a href="#语法">语法</a>
                    </li>
                    <li>
                        <a href="#方法">方法</a>
                        <ul>
                            <li>
                                <a href="#render">render</a>
                            </li>
                            <li>
                                <a href="#method">method</a>
                            </li>
                            <li>
                                <a href="#config">config</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#性能测试">性能测试</a>
                    </li>
                </ul>
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'events' %} s-crt{% endif %}" href="/nui/pages/events.html">代理事件</a>
            </li>
            <li>
                <a class="f-fs16{%if current == 'element' %} s-crt{% endif %}" href="/nui/pages/element.html">页面元素</a>
                {%if current == 'element' %}
                <ul>
                    <li>
                        <a href="/nui/pages/element/layout/">布局</a>
                    </li>
                    <li>
                        <a href="/nui/pages/element/header/">页头</a>
                    </li>
                    <li>
                        <a href="/nui/pages/element/iconfont/">图标</a>
                    </li>
                    <li>
                        <a href="/nui/pages/element/button/">按钮</a>
                    </li>
                    <li>
                        <a href="/nui/pages/element/setp/">步骤条</a>
                    </li>
                    <li>
                        <a href="/nui/pages/element/card/">卡片</a>
                    </li>
                    <li>
                        <a href="/nui/pages/element/form/">表单</a>
                    </li>
                    <li>
                        <a href="/nui/pages/element/nav/">导航栏</a>
                    </li>
                    <li>
                        <a href="/nui/pages/element/table/">表格</a>
                    </li>
                    <li>
                        <a href="/nui/pages/element/list/">列表</a>
                    </li>
                    <li>
                        <a href="/nui/pages/element/footer/">页脚</a>
                    </li>
                    <li>
                        <a href="/nui/pages/element/skin/">皮肤</a>
                    </li>
                </ul>
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'cpns' %} s-crt{% endif %}" href="/nui/pages/components/">交互组件</a>
                {%if current == 'cpns' %}
                <ul>
                    <li>
                        <a{%if page == 'index' %} class="s-crt"{% endif %} href="#快速入门">快速入门</a>
                        <ul>
                            <li>
                                <a href="#规范">规范</a>
                            </li>
                            <li>
                                <a href="#开发组件">开发组件</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a{%if page == 'router' %} class="s-crt"{% endif %} href="/nui/pages/components/router/">路由</a>
                    </li>
                    <li>
                        <a{%if page == 'layer' %} class="s-crt"{% endif %} href="/nui/pages/components/layer/">弹出层</a>
                    </li>
                    <li>
                        <a{%if page == 'calendar' %} class="s-crt"{% endif %} href="/nui/pages/components/calendar/">日历</a>
                    </li>
                    <li>
                        <a{%if page == 'datagrid' %} class="s-crt"{% endif %} href="/nui/pages/components/datagrid/">数据网格</a>
                    </li>
                    <li>
                        <a{%if page == 'placeholder' %} class="s-crt"{% endif %} href="/nui/pages/components/placeholder/">占位符</a>
                    </li>
                    <li>
                        <a{%if page == 'slider' %} class="s-crt"{% endif %} href="/nui/pages/components/slider/">滑块</a>
                    </li>
                    <li>
                        <a{%if page == 'carousel' %} class="s-crt"{% endif %} href="/nui/pages/components/carousel/">轮播图</a>
                    </li>
                    <li>
                        <a{%if page == 'upload' %} class="s-crt"{% endif %} href="/nui/pages/components/upload/">文件上传</a>
                    </li>
                    <li>
                        <a{%if page == 'upload' %} class="s-crt"{% endif %} href="/nui/pages/components/upload/">单复选框</a>
                    </li>
                    <li>
                        <a{%if page == 'fixed' %} class="s-crt"{% endif %} href="/nui/pages/components/fixed/">固钉</a>
                    </li>
                    <li>
                        <a{%if page == 'numeral' %} class="s-crt"{% endif %} href="/nui/pages/components/fixed/">数字输入</a>
                    </li>
                    <li>
                        <a{%if page == 'paging' %} class="s-crt"{% endif %} href="/nui/pages/components/paging/">分页</a>
                    </li>
                    <li>
                        <a{%if page == 'scrollbar' %} class="s-crt"{% endif %} href="/nui/pages/components/scrollbar/">滚动条</a>
                    </li>
                    <li>
                        <a{%if page == 'suggest' %} class="s-crt"{% endif %} href="/nui/pages/components/suggest/">搜索建议</a>
                    </li>
                    <li>
                        <a{%if page == 'tab' %} class="s-crt"{% endif %} href="/nui/pages/components/tab/">选项卡</a>
                    </li>
                    <li>
                        <a{%if page == 'popover' %} class="s-crt"{% endif %} href="/nui/pages/components/popover/">提示框</a>
                    </li>
                    <li>
                        <a{%if page == 'print' %} class="s-crt"{% endif %} href="/nui/pages/components/print/">打印</a>
                    </li>
                    <li>
                        <a{%if page == 'copy' %} class="s-crt"{% endif %} href="/nui/pages/components/copy/">拷贝</a>
                    </li>
                    <li>
                        <a{%if page == 'collapse' %} class="s-crt"{% endif %} href="/nui/pages/components/collapse/">折叠面板</a>
                    </li>
                    <li>
                        <a{%if page == 'timer' %} class="s-crt"{% endif %} href="/nui/pages/components/timer/">定时器</a>
                    </li>
                    <li>
                        <a{%if page == 'waterfall' %} class="s-crt"{% endif %} href="/nui/pages/components/waterfall/">瀑布流</a>
                    </li>
                    <li>
                        <a{%if page == 'validate' %} class="s-crt"{% endif %} href="/nui/pages/components/validate/">表单校验</a>
                    </li>
                </ul>
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'pack' %} s-crt{% endif %}" href="/nui/pages/pack.html">构建工具</a>
                {%if current == 'pack' %}
                <ul>
                    <li>
                        <a href="#install">安装使用</a>
                    </li>
                    <li>
                        <a href="#question">常见问题</a>
                    </li>
                </ul>
                {% endif %}
            </li>
        </ul>
    </div>
</div>
{% endmacro %}
