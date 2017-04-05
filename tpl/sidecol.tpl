{% macro active(menu='study', current='index') %}
<div class="f-fl g-sidecol">
    <div class="side">
        <ul class="m-menu f-lh28">
            {%if menu == 'study' %}
            <li>
                <a class="f-fs16{%if current == 'index' %} s-crt{% endif %}" href="/nui/pages/study/">介绍</a>
                {%if current == 'index' %}
                <ul>
                    <li>
                        <a href="#Nui是什么">Nui是什么</a>
                    </li>
                    <li>
                        <a href="#安装使用">安装使用</a>
                    </li>
                </ul>
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'api' %} s-crt{% endif %}" href="/nui/pages/study/api.html">API</a>
                {%if current == 'api' %}
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
                <a class="f-fs16{%if current == 'util' %} s-crt{% endif %}" href="/nui/pages/study/util.html">工具集</a>
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
                <a class="f-fs16{%if current == 'template' %} s-crt{% endif %}" href="/nui/pages/study/template.html">模板引擎</a>
                {%if current == 'template' %}
                <ul>
                    <li>
                        <a href="#比较">比较</a>
                    </li>
                </ul>
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'dev' %} s-crt{% endif %}" href="/nui/pages/study/dev.html">组件开发</a>
                {%if current == 'dev' %}
                <ul>
                    <li>
                        <a href="#"></a>
                    </li>
                </ul>
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'auto' %} s-crt{% endif %}" href="/nui/pages/study/automation.html">自动化</a>
                {%if current == 'auto' %}
                <ul>
                    <li>
                        <a href="#"></a>
                    </li>
                </ul>
                {% endif %}
            </li>
            {% endif %}

            {%if menu == 'component' %}

            {% endif %}
        </ul>
    </div>
</div>
{% endmacro %}
