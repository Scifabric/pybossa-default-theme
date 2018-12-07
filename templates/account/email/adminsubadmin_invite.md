# {{access_type}} access on {{ config.BRAND }}

Hello, {{username}}!

You've been granted {{access_type}} privileges on {{ config.BRAND }}

{% if is_qa %} (QA Version) {% endif %} at [{{server_url}}]({{server_url}}).

Reference manual for admins and subadmins on {{ config.BRAND }} platform is available at [{{admin_manual_url}}]({{admin_manual_url}}).
