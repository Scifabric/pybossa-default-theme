(function(){
    var resource = location.pathname.split('/')[1];

    function makeSlug(text) {
        var not_valid_chars = /([$#%·~!¡?"¿'=)(!&\/|]+)/g;
        return text.toLowerCase().trim().replace(not_valid_chars, "").replace(/( )+/g, "");
    }

    if ( resource === 'project' ) {
        $("#name").bind('textchange', function (event, previousText) {
          $('#short_name').val(makeSlug($(this).val()));
        });

    }

    if ( resource === 'account' ) {
        $("#fullname").bind('textchange', function (event, previousText) {
          $('#name').val(makeSlug($(this).val()));
        });
    }

}());
