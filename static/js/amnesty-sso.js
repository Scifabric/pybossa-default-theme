(function(){

	$( document ).ready(function(){

		if (!window.amnestySSO) {
			window.amnestySSO = {
				init : false
			}
		} else {
			window.amnestySSO.init = false;
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
				<div class="option text-center">\
					<button class="btn btn-primary btn-block" id="register-btn">Register</button><br/>\
					<button class="btn btn-primary btn-block" id="login-btn">Login</button><br/>\
					<button class="btn btn-link" id="skip-btn">Skip registration</button><br/>\
				</div>\
				<p class="loading" style="display:none">Loading ... </p>\
				<iframe style="display:none">Loading</iframe>\
			</div>\
	    </div>\
	  </div>\
	</div>\
	<style>\
		.modal-body {\
		    overflow: hidden;\
		}\
		.modal-body iframe {\
			height: 350px;\
			width: 100%;\
			border: 0px;\
		}\
	</style>\
			';
			//only show modal when user is not logged in
			if ( window.amnestySSO.isAnonymous != 'True') {
				return;
			}

			//not valid mode
			var validModalMode = ['login', 'register', 'all'];			
			if ( !( validModalMode.indexOf(window.amnestySSO.loginModalMode) > -1 ) ) {
				return;
			}

			//modal html			
			$('body').append(html);

			$('#amnestySSOModal').modal('show');

			$('#amnestySSOModal #skip-btn').click(function(){
				$('#amnestySSOModal').modal('hide');
			});

			$('#amnestySSOModal #register-btn').click(function(){
				showImModalContent('register')
			});

			$('#amnestySSOModal #login-btn').click(function(){
				showImModalContent('login')
			});

			var showImModalContent = function(loginModalMode) {
				$("#amnestySSOModal .option").hide();

				var iframeLink = {
					'login' : window.amnestySSO.imServerUrl + '/login/modal',
					'register': window.amnestySSO.imServerUrl + '/register/modal'
				}				
				//link IM's login form with modal's content
				$("#amnestySSOModal .loading").show();
				$('#amnestySSOModal iframe').show();
				$('#amnestySSOModal iframe').attr('src', iframeLink[loginModalMode]);
			}

			$('#amnestySSOModal iframe').load(function(){
			      $("#amnestySSOModal .loading").hide();
			});

			//wait IM login form to return token
			window.addEventListener("message", receiveMessage, false);
			function receiveMessage(event)
			{
				var origin = event.origin || event.originalEvent.origin; // For Chrome, the origin property is in the event.originalEvent object.
				if (origin !== window.amnestySSO.imServerUrl)
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
