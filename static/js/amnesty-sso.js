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
					<p class="h3">BECOME AN AMNESTY DECODER</p>\
					<p> By registering you&apos;ll be able to see your progress and participate in the forum. If you&apos;d prefer you can skip registration.</p><br/>\
					<button class="btn-secondary--alt--md--fullwidth btn-register login-modal" id="register-btn">REGISTER</button>\
					<br/><br/>\
					<button class="btn-secondary--alt--md--fullwidth btn-sign-in login-modal" id="login-btn">SIGN IN</button>\
					<br/><br/>\
					<button class="btn-link btn-skip-registration login-modal" id="skip-btn">Skip registration</button>\
					<br/><br/>\
				</div>\
				<p class="loading" style="display:none">Loading ... </p>\
				<iframe style="display:none">Loading</iframe>\
			</div>\
	    </div>\
	  </div>\
	</div>\
	<style>\
		/* iframe style */\
		.modal-body {\
		    overflow: hidden;\
		}\
		.modal-body iframe {\
			height: 350px;\
			width: 100%;\
			border: 0px;\
		}\
		/* buttons style */\
		.btn-sign-in.login-modal {\
			background-color: white;\
			color: black;\
		}\
		.btn-sign-in.login-modal:hover {\
			background-color: #dadada;\
		}\
		.btn-skip-registration.login-modal {\
			font-size: 14px;\
			font-family: sans-serif;\
			color: black;\
		}\
		.btn-register.login-modal,\
		.btn-sign-in.login-modal,\
		.btn-skip-registration.login-modal {\
			width:300px;\
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
			};
			
			switch (window.amnestySSO.loginModalMode) {
				case 'login' :
					$('#amnestySSOModal').modal('show');
					showImModalContent('login');

					break;

				case 'register' :
					$('#amnestySSOModal').modal('show');
					showImModalContent('register');

					break;

				case 'all' :
					$('#amnestySSOModal').modal('show');
					$('#amnestySSOModal #skip-btn').click(function(){
						$('#amnestySSOModal').modal('hide');
					});

					$('#amnestySSOModal #register-btn').click(function(){
						showImModalContent('register');
					});

					$('#amnestySSOModal #login-btn').click(function(){
						showImModalContent('login');
					});

					break;
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
