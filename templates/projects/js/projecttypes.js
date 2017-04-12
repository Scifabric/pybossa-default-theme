<script>
  $("#show-types").on('click', function(){
    $("#project-types").show();
    $("#show-types").addClass("hidden");
    $('#hide-types').show();
  })

  $("#hide-types").on('click', function(){
    $("#project-types").hide();
    $("#hide-types").hide();
    $("#show-types").removeClass("hidden");
  })
</script>
