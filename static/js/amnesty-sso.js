(function(){

	$( document ).ready(function(){
		if (!window.amnestySSO) {
			window.amnestySSO = {
				init : false
			}
		}

		if (!window.amnestySSO.init) {		
			var html = '\
	<div class="modal fade" id="amnestySSOModal" tabindex="-1" role="dialog" aria-labelledby="amnestySSOModalLabel">\
	  <div class="modal-dialog" role="document">\
	    <div class="modal-content">\
	      <div class="modal-header">\
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
	      </div>\
	      <div class="modal-body" style="min-height:60vh;overflow:scroll">\
	      	<iframe></iframe>\
	      </div>\
	    </div>\
	  </div>\
	</div>\
			';
			$('body').append(html);

			$('#amnesty-sso-modal-login').click(function(){
				$('#amnestySSOModal iframe').attr('src', 'http://im.amnesty.dev/login/modal');
				$('#amnestySSOModal').modal('show');
			});

			window.addEventListener("message", receiveMessage, false);
			function receiveMessage(event)
			{
				var origin = event.origin || event.originalEvent.origin; // For Chrome, the origin property is in the event.originalEvent object.
				if (origin !== imServerUrl)
					return;
				
				$.post('/amnesty/oauth-authorized-with-password', {
						'access_token': event.data['access_token'],
						'csrf_token': $('#ajax_csrf_token').val()
					})
					.done(function(data){
						console.log(data);
					});
				console.log('data:' + event.data['access_token']);
			}			
		}
	});


})();
