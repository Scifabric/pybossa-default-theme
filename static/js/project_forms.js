(function(){
  $("#product").change(function(){
    var product = $(this).val();
    var subproducts = ps[product];
    $("#subproduct").empty();
    $("#subproduct").append($("<option></option>").attr("value", "").text(""));
    for (var i = 0; i < subproducts.length; i++) {
      $("#subproduct").append(
          $("<option></option>").attr(
              "value", subproducts[i]).text(subproducts[i])
      );
    }
  });
}());
