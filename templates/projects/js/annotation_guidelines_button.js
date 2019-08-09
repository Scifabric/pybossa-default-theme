
<script>
$(".collapse-guidelines-button").on('click', function(){
    var showInstructionsMsg = 'Show Instructions';
    var hideInstructionsMsg = 'Hide Instructions';
    $(this).text(function(i, v){
        return v === showInstructionsMsg ? hideInstructionsMsg : showInstructionsMsg
    });
});
</script>
