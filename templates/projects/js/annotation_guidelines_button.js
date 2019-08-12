<script>
$(".collapse-guidelines-button").on('click', function(){
    $(this).text(function(i, v){
        var text = v.startsWith('Show') ? 'Hide' : 'Show';
        return text + ' Instructions';
    });
});
</script>
