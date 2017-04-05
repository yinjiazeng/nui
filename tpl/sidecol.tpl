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
                <a class="f-fs16{%if current == 'factory' %} s-crt{% endif %}" href="/nui/pages/study/factory/">工厂四剑客</a>
                {%if current == 'factory' %}
                <ul>
                    <li>
                        <a href="#require">require</a>
                    </li>
                </ul>
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'util' %} s-crt{% endif %}" href="/nui/pages/study/util/">工具集</a>
                {%if current == 'util' %}
                <ul>
                    <li>
                        <a href="#"></a>
                    </li>
                </ul>
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'template' %} s-crt{% endif %}" href="/nui/pages/study/template/">模板引擎</a>
                {%if current == 'template' %}
                <ul>
                    <li>
                        <a href="#"></a>
                    </li>
                </ul>
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'dev' %} s-crt{% endif %}" href="/nui/pages/study/dev/">组件开发</a>
                {%if current == 'dev' %}
                <ul>
                    <li>
                        <a href="#"></a>
                    </li>
                </ul>
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'gulp' %} s-crt{% endif %}" href="/nui/pages/study/gulp/">自动化</a>
                {%if current == 'gulp' %}
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
