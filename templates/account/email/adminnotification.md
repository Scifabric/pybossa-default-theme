# {{access_type}} access on {{ config.BRAND }}

Hello,

{{username}} has been granted {{access_type}} privileges on {{ config.BRAND }} by {{current_user.fullname}}.

{% if is_qa %} (QA Version) {% endif %} at [{{server_url}}]({{server_url}}).
