// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

$('document').ready(function() {
	var global_username = '';

	sinchClient = new SinchClient({
		applicationKey: 'a5d826f0-4a0a-48a1-8f82-6e7b5c641d5a',
		capabilities: {calling: true},
		startActiveConnection: true,
		onLogMessage: function(message) {
			console.log(message);
		},
	});

	var sessionName = 'sinchSessionAUTH-' + sinchClient.applicationKey;

	$('#registerForm').on('submit', function(event) {
		event.preventDefault();

		var signUpObj = {};
		signUpObj.username = $('#registerForm input#username').val();
		signUpObj.password = $('#registerForm input#password').val();

		Q($.post('http://0.0.0.0:3000/register', JSON.stringify(signUpObj), {}, "json"))
			.then(sinchClient.start.bind(sinchClient))
			.then(function() {
				global_username = signUpObj.username;
				showUI();
				localStorage[sessionName] = JSON.stringify(sinchClient.getSession());
				})
			.fail(handleError);;
	});

	$('#loginForm').on('submit', function(event) {
		event.preventDefault();

		var signInObj = {};
		signInObj.username = $('#loginForm input#username').val();
		signInObj.password = $('#loginForm input#password').val();

		Q($.post('http://0.0.0.0:3000/login', JSON.stringify(signInObj), {}, "json"))
			.then(sinchClient.start.bind(sinchClient))
			.then(function() {
				global_username = signInObj.username;
				showUI();
				localStorage[sessionName] = JSON.stringify(sinchClient.getSession());
				})
			.fail(handleError);
	});

	/*** Handle errors, report them and re-enable UI ***/

	var handleError = function(error) {
		try {
			error.responseJSON = error.responseJSON || {};
			error.errorCode = error.errorCode || error.responseJSON.errorCode || '0';
			error.message = error.message || (error.errorCode  + ' ' + (error.responseJSON.message || 'No backend'));
		}
		catch(e) {
			console.error('FAIL', e);
			error.message = "Server failure";
		}

		//Enable buttons
		$('button#createUser').prop('disabled', false);
		$('button#loginUser').prop('disabled', false);
	}
});



