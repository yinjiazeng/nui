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
                        <a href="#$">$</a>
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
                <a class="f-fs16{%if current == 'element' %} s-crt{% endif %}" href="/nui/pages/element.html">页面元素</a>
                {%if current == 'element' %}
                <ul>
                    <li>
                        <a href="#"></a>
                    </li>
                </ul>
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'cpns' %} s-crt{% endif %}" href="/nui/pages/components/">组件</a>
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
                        <a{%if page == 'placeholder' %} class="s-crt"{% endif %} href="/nui/pages/components/placeholder/">输入框占位</a>
                    </li>
                    <li>
                        <a{%if page == 'dev' %} class="s-crt"{% endif %} href="/nui/pages/components/dev/">组件开发</a>
                    </li>
                </ul>
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'auto' %} s-crt{% endif %}" href="/nui/pages/auto.html">自动化</a>
                {%if current == 'auto' %}
                <ul>
                    <li>
                        <a href="#"></a>
                    </li>
                </ul>
                {% endif %}
            </li>
        </ul>
    </div>
</div>
{% endmacro %}
