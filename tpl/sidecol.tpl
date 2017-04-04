{% macro active(menu='loader', current='index') %}
<div class="f-fl g-sidecol">
    <div class="side">
        <ul class="m-menu f-lh28">
            {%if menu == 'loader' %}
            <li>
                <a class="f-fs16{%if current == 'index' %} s-crt{% endif %}" href="/nui/pages/loader/">介绍</a>
                {%if current == 'index' %}
                <ul>
                    <li>
                        <a href="#Nui.js是什么">Nui.js是什么</a>
                    </li>
                    <li>
                        <a href="#安装">安装</a>
                    </li>
                    <li>
                        <a href="#如何使用">如何使用</a>
                    </li>
                </ul>
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'factory' %} s-crt{% endif %}" href="/nui/pages/loader/factory/">工厂函数</a>
                {%if current == 'factory' %}
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
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'module' %} s-crt{% endif %}" href="/nui/pages/loader/module/">内置模块</a>
                {%if current == 'module' %}
                <ul>
                    <li>
                        <a href="#组件基类">组件基类</a>
                    </li>
                    <li>
                        <a href="#工具类">工具类</a>
                    </li>
                    <li>
                        <a href="#模板引擎">模板引擎</a>
                    </li>
                </ul>
                {% endif %}
            </li>
            {% endif %}

            {%if menu == 'component' %}

            {% endif %}

            {%if menu == 'automate' %}

            {% endif %}
        </ul>
    </div>
</div>
{% endmacro %}
