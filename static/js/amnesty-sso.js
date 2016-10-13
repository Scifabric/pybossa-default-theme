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
				<h4 class="modal-title">BECOME AN AMNESTY DECODER</h4>\
			</div>\
			<div class="modal-body">\
				<div class="option text-center">\
					<div class="description">\
						<p>Registering allows you to participate in discussions, track your progress and helps the research teams make the best use of the data you provide.</p>\
					</div>\
					<br/>\
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

			//modal html			
			$('body').append(html);

			window.amnestySSO.showImModalContent = function(loginModalMode) {
				
				if (loginModalMode == 'register') {
					$("#amnestySSOModal .modal-title").html('Register');
				} else if (loginModalMode == 'login') {
					$("#amnestySSOModal .modal-title").html('Sign in');
				} else {
					$("#amnestySSOModal .modal-title").html('');
				}
				
				if (loginModalMode == 'register' || loginModalMode == 'login') {
					$("#amnestySSOModal .option").hide();

					var iframeLink = {
						'login' : window.amnestySSO.imServerUrl + '/login/modal',
						'register': window.amnestySSO.imServerUrl + '/register/modal'
					}				
					
					$("#amnestySSOModal .loading").show();

					//hide current iframe content
					$('#amnestySSOModal iframe').hide();

					//link IM's login form with modal's content
					$('#amnestySSOModal iframe').attr('src', iframeLink[loginModalMode]);
				} else {
					//show register, login, skip options again
					$("#amnestySSOModal .loading").hide();
					$('#amnestySSOModal iframe').hide();
					$("#amnestySSOModal .option").show();
				}
			};

			$('#amnestySSOModal iframe').load(function(){
			      $("#amnestySSOModal .loading").hide();
			      //only show iframe content after it finishes loading
			      $('#amnestySSOModal iframe').show();
			});

			$('#amnestySSOModal #register-btn').click(function(){
				//update for later redirect to tutorial page
				window.amnestySSO.loginModalMode = 'register';

				//set bigger height
				$('#amnestySSOModal .modal-body iframe').height('80vh');

				window.amnestySSO.showImModalContent('register');
			});

			$('#amnestySSOModal #login-btn').click(function(){
				window.amnestySSO.showImModalContent('login');
			});

			$('#amnestySSOModal #skip-btn').click(function(){
				$('#amnestySSOModal').modal('hide');
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
						//if user hasn't tried tutorial yet then show it
						if (!window.pybossaTutorial.isSkippedOrComplete()) {
							window.location = '/project/decode-darfur/tutorial';
						} 
						//other case, just reload current window
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

// Bootstrap login/register modal if query string has ?modal=login/register/all
// ---
(function(){
	$( document ).ready(function(){

		window.amnestySSO.bootstrapLoginRegister = function() {
			//only show modal when user is not logged in
			if ( window.amnestySSO.isAnonymous != 'True') {
				return;
			}

			//not valid mode
			var validModalMode = ['login', 'register', 'all'];			
			if ( !( validModalMode.indexOf(window.amnestySSO.loginModalMode) > -1 ) ) {
				return;
			}

			switch (window.amnestySSO.loginModalMode) {
				case 'login' :
					$('#amnestySSOModal').modal('show');
					window.amnestySSO.showImModalContent('login');

					break;

				case 'register' :
					//set bigger height
					$('#amnestySSOModal .modal-body iframe').height('80vh');

					//show register modal
					$('#amnestySSOModal').modal('show');
					window.amnestySSO.showImModalContent('register');

					break;

				case 'all' :
					$('#amnestySSOModal').modal('show');

					break;
			}		
		}

		window.amnestySSO.bootstrapLoginRegister();	
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
	          <p class="modal-title h3">Comment on this area</p>\
	          <button type="button" class="close pull-right" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
	        </div>\
	        <br/>\
	        <div class="submit-comment-container">\
	          <p class="text-danger message text-center"></p>\
	          <textarea class="form-control" rows="3" id="flag-content" placeholder="Tell us if you see something in this area that our researchers and other Decoders should take a closer look at."></textarea>\
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
	<style>\
		/* \
			style in /static/css/ua-styles.css push down the place holder text, \
			so this hot fix with padding-top for place holder.\
		*/\
		textarea#flag-content::-webkit-input-placeholder { /* WebKit, Blink, Edge */\
			padding-top: 0px !important;\
			color: #B6B6B6;\
			line-height: 1.6em;\
			font-size: 14px;\
		}\
		textarea#flag-content:-moz-placeholder { /* Mozilla Firefox 4 to 18 */\
			padding-top: 0px !important;\
			color: #B6B6B6;\
			line-height: 1.6em;\
			font-size: 14px;\
		}\
		textarea#flag-content::-moz-placeholder { /* Mozilla Firefox 19+ */\
			padding-top: 0px !important;\
			color: #B6B6B6;\
			line-height: 1.6em;\
			font-size: 14px;\
		}\
		textarea#flag-content:-ms-input-placeholder { /* Internet Explorer 10-11 */\
			padding-top: 0px !important;\
			color: #B6B6B6;\
			line-height: 1.6em;\
			font-size: 14px;\
		}\
		/* flag content style */\
		textarea#flag-content {\
			font-family: sans-serif;\
			line-height: 1.6em;\
			font-size: 14px !important;\
		}\
		#flagModal2 span.text-muted,\
		#flagModal2 .after-submit-sucess p {\
			font-family: sans-serif;\
			line-height: 1.6em;\
			font-size: 14px !important;\
		}\
	</style>\
			';

		$('body').append(html);
		
		$("[data-target='#flagModal']").click(function(){
			if(!window.isInTutorial){
				//only logged-in user can comment
				if (window.amnestySSO.isAnonymous != 'True') {
					$('#flagModal2').modal('show');
				}
				//show register/login modal for new user
				else {
					window.amnestySSO.loginModalMode = 'all';
					var flagFormDescriptionHtml = '\
						<p class="h4">Sign in to help us make the most out of your hard work.</p>\
						<p>Signing in allows you to participate in discussions and allows us to give you credit for your work and make the best use of the data you provide.</p>\
					\
					';
					$('#amnestySSOModal .description').html(flagFormDescriptionHtml);
					window.amnestySSO.showImModalContent('all');
					$('#amnestySSOModal').modal('show');
				}
			}
		});

		$(".btn-flag").click(function(){
			var comment = $('#flag-content').val();
			comment = comment.trim();

			if (!comment) {
				$("#flagModal2 .message").html("Please enter your comment");
				return;
			}

			//loading effect
			$('#flagModal2').waitMe();

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
					//remove loading effect
					$('#flagModal2').waitMe('hide');
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
		});	
	});

})();