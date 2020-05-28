<script type="text/javascript">
$(document).ready(function () {
  $('#input_data_class').change(function () {
      if ($('#input_data_class').val().includes('L1')){
          optOutAmpStore();
      }
  });
  $('#output_data_class').change(function () {
      if ($('#output_data_class').val().includes('L1')){
          optOutAmpStore();
      }
  });
});

function optOutAmpStore() {
  document.getElementById("amp_store").checked = false;
}
</script>