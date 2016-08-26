<script type="text/javascript">
$(document).ready(function() {
  var map = L.map('map').setView([42.662115143057235, 21.16320312023163], 2);
  map.scrollWheelZoom.disable();
  L.tileLayer('http://{s}.tiles.mapbox.com/v3/georges.jjc3k7b1/{z}/{x}/{y}.png', {
      attribution: "{{ _('Data Source') }}:" + "<a href='http://opendatakosovo.org'>Open Data Kosovo</a>",
      maxZoom: 10
  }).addTo(map);
});
</script>