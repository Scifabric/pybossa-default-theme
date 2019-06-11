<script>
var csrftoken = "{{ csrf_token() }}";
    $.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
    });
  
    function saveEnrichments(short_name){
        var base_url = window.location.origin;
        var url = base_url + "/project/" + short_name + "/enrichment";
        var data = {'enrich_data': enrich_data};
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',            
            data: JSON.stringify(data),
            success: function(response) {
                var url = base_url + "/project/" + short_name + "/settings";
                window.location.href = url
            },
            error: function(error) {
                pybossaNotify('Error updating enrichment configuration', true, 'error');
                console.log(error);
            }
        });
    }
</script>
