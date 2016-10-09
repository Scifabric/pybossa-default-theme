// SSO login, register modal iframe
// --------------------------------

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
				<h4 class="modal-title"></h4>\
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
				
				if (loginModalMode == 'register') {
					$("#amnestySSOModal .modal-title").html('Register');
				} else if (loginModalMode == 'login') {
					$("#amnestySSOModal .modal-title").html('Login');
				}
				
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
					//set bigger height
					$('#amnestySSOModal .modal-body iframe').height('80vh');

					//show register modal
					$('#amnestySSOModal').modal('show');
					showImModalContent('register');

					break;

				case 'all' :
					$('#amnestySSOModal').modal('show');
					$('#amnestySSOModal #skip-btn').click(function(){
						$('#amnestySSOModal').modal('hide');
					});

					$('#amnestySSOModal #register-btn').click(function(){
						//update for later redirect to tutorial page
						window.amnestySSO.loginModalMode = 'register';

						//set bigger height
						$('#amnestySSOModal .modal-body iframe').height('80vh');

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
						//after register show user pybossa's tutorial page
						if (window.amnestySSO.loginModalMode == 'register') {
							window.location = '/project/decode-darfur/tutorial';
						} 
						//with login or other case, just reload current window
						else {
							location.reload(); 	
						}						
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

// Flag modal
// ----------
(function(){
	$( document ).ready(function(){
		//we rename flagModal to flagModal2 so external "data-target='#flagModal'" element can't open that modal directly
		var html = '\
	<div class="modal fade modal-flag" id="flagModal2" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">\
	  <div class="modal-dialog modal-md" role="document">\
	    <div class="modal-content">\
	      <div class="modal-body">\
	        <div class="text-center">\
	          <p class="modal-title h3">Flag task ..</p>\
	          <button type="button" class="close pull-right" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
	        </div>\
	        <br/>\
	        <div class="submit-comment-container">\
	          <p class="text-danger message text-center"></p>\
	          <textarea class="form-control" rows="3" id="flag-content"></textarea>\
	          <br/>\
	          <div class="text-center">\
	            <button type="button" class="btn-primary--md--fullwidth btn-flag" id="flag-btn">\
	              <span class="glyphicon glyphicon-refresh spinning"></span>\
	              Flag this section\
	            </button>\
	            <br/><br/>\
	            <span class="text-muted">Your comment will appear in the Amnesty Decoders community forum</span>\
	          </div>\
	        </div>\
	        <div class="after-submit-sucess text-center" style="display:none">\
	          <p>Thanks for your comments and suggestions</p>\
	          <br/>\
	          <a href="" class="view-comment-on-forum">View comment on forum</a>\
	          <br/>\
	          <br/>\
	          <button type="button" class="btn btn-primary" data-dismiss="modal" id="flag-btn-close">Close</button>\
	        </div>\
	      </div>\
	    </div>\
	  </div>\
	</div>\
			';

		$('body').append(html);
		
		$("[data-target='#flagModal']").click(function(){
			//only logged-in user can comment
			if (window.amnestySSO.isAnonymous != 'True') {
				$('#flagModal2').modal('show');
			} 
			//show register/login modal for new user
			else {
				console.log('show login');
			}
		});

		$(".btn-flag").click(function(){
			var comment = $('#flag-content').val();
			comment = comment.trim();

			if (!comment) {
				$("#flagModal2 .message").html("Please enter your comment");
				return;
			}

			//loading button
			$('.btn-flag .glyphicon-refresh').show();

			$.get('/discourse/create-comment', {
					"comment": comment,
					"task-id": pybossa.task.id
				})
				.done(function(data){
					$('#flagModal2 .view-comment-on-forum').attr('href', data.topic_url);
					//clear error message
					$("#flagModal2 .message").html("");
					//hide comment input
					$('#flagModal2 .submit-comment-container').hide();
					//show forum link
					$('#flagModal2 .after-submit-sucess').show();
				})
				.fail(function(data){
					var message = "There is error";
					if (data && data.responseText) {
					var error = $.parseJSON(data.responseText);
					if (error && error.errors) {
					message = error.errors.join('<br/>');
					}
					}
					$("#flagModal2 .message").html(message);
				})
				.always(function() {
					//remove loading button
					$('.btn-flag .glyphicon-refresh').hide();
				});
		});


		$('#flagModal2').on('hidden.bs.modal', function (e) {
			//reset
			//show comment input
			$('#flagModal2 .submit-comment-container').show();
			$('#flag-content').val("")
			//hide forum link
			$('#flagModal2 .after-submit-sucess').hide();
			//clear error message
			$("#flagModal2 .message").html("");
		});

		$('#flagModal2').on('show.bs.modal', function (e) {
			$('.btn-flag .glyphicon-refresh').hide();
			$('#flagModal2 .modal-title').html("Flag task " + pybossa.task.id);
		});	
	});

})();