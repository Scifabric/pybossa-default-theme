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
			<div class="modal-body">\
				<iframe></iframe>\
			</div>\
	    </div>\
	  </div>\
	</div>\
	<style>\
		.modal-body {\
			overflow:scroll\
		}\
		.modal-body {\
		    height: 350px;\
		    overflow: hidden;\
		    max-width: 100%;\
		}\
		.modal-body iframe {\
			height: 350px;\
			width: 100%;\
			border: 0px;\
		}\
	</style>\
			';
			$('body').append(html);

			$('#amnesty-sso-modal-login').click(function(){
				$('#amnestySSOModal iframe').attr('src', imServerUrl + '/login/modal');
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
						location.reload(); 
					})
					.fail(function(data){
        				console.log('failed');
        				console.log(data);
        			})
        			.always(function(){
        			});
			}			
		}
	});


})();
