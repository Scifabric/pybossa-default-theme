(function(){
    var name = document.getElementById('name');
    var short_name = document.getElementById('short_name');

    name.addEventListener('keyup', function(){
        short_name.value = shortnameFromName(name.value);
    });

    function shortnameFromName(name){
        return name.toLowerCase().trim().replace(/(\W+)/g, "-");
    }
}());