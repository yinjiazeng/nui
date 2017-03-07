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
                </ul>
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'musketeer' %} s-crt{% endif %}" href="/nui/pages/loader/musketeer/">三剑客</a>
                {%if current == 'musketeer' %}
                <ul>
                    <li>
                        <a href="#require">require</a>
                    </li>
                    <li>
                        <a href="#imports">imports</a>
                    </li>
                    <li>
                        <a href="#extands">extands</a>
                    </li>
                </ul>
                {% endif %}
            </li>
            <li>
                <a class="f-fs16{%if current == 'musketeer' %} s-crt{% endif %}" href="/nui/pages/loader/demo/">案例</a>
                {%if current == 'demo' %}
                <ul>

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
