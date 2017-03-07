{% macro active(current='index') %}
    <li class="f-fl{%if current == 'index' %} s-crt{% endif %}">
        <a href="/nui/pages/loader/">加载器</a>
    </li>

{% endmacro %}
