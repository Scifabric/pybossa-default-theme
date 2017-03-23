var dateModalInfo = '';

function dirtyView() {
	if (filter_data.changed === false) {
		filter_data.changed = true;
		$("[data-toggle=popover]").popover('show');
	}
}
function checkDateValidity() {
	if (!this.checkValidity()) {
		var form_group = $(this).closest('.form-group');
		if (!form_group.hasClass('has-error')) {
			form_group.addClass('has-error');
		}
	}
}
$(document).ready(function() {
	$('#priority').slider().on('slide', function(ev) {
		dirtyView();

		filter_data.priority_from = ev.value[0];
		filter_data.priority_to = ev.value[1];
	});
	$('#pcomplete').slider().on('slide', function(ev) {
		dirtyView();

		filter_data.pcomplete_from = ev.value[0];
		filter_data.pcomplete_to = ev.value[1];
	});
	$('#task_id').change(function() {
		dirtyView();

		filter_data.task_id = $(this).val();
		console.log(filter_data.task_id);
	});

	$('#dateModal').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget);
		var info = button.data('info');

		dateModalInfo = info;

		var modal = $(this);
		modal.find('.modal-body #time_from').val(filter_data[info + '_from']).focusout(checkDateValidity).closest('.form-group').removeClass('has-error');
		modal.find('.modal-body #time_to').val(filter_data[info + '_to']).focusout(checkDateValidity).closest('.form-group').removeClass('has-error');
	});

	$('#saveDateModal').click(function() {
		var info = dateModalInfo;
		var modal = $('#dateModal');

		var time_from = modal.find('.modal-body #time_from');
		var time_to = modal.find('.modal-body #time_to');

		if (!time_from[0].checkValidity() || !time_to[0].checkValidity()) {
			return;
		}

		filter_data[info + '_from'] = time_from.val();
		filter_data[info + '_to'] = time_to.val();

		modal.modal('hide');
		dirtyView();
	});

	$('.records_per_page').click(function() {
		records_per_page = parseInt($(this).text());

		refresh();
	});

	$('.pagination-tasks-browse').click(function() {
		prepareFilters();
		$(this).attr('href', $(this).attr('href') + "?" + $.param(filter_data));
	})

	$("#btnRefresh").click(function() {
		refresh();
	});

	$("#tasksGrid th[data-sort]").click(function(evt) {
		dirtyView();
		
		var column = $(this);

		if (!evt.ctrlKey) {
			$("#tasksGrid th[data-sort!=" + column.attr('data-sort') + "]").removeClass('sort-asc sort-desc');
		}

		if (!column.hasClass('sort-asc') && !column.hasClass('sort-desc')) {
			column.addClass('sort-desc');
		} else {
			$(this).toggleClass('sort-asc sort-desc');
		}
	});

	$("#columnsSettings").on("hide.bs.dropdown", function(event) {
		refresh();
	});

	$('#infoModal').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget);
		var url = button.data('info');

		//var modal = $(this);
		var loadingInfo = $('#loadingInfo').show();
		var taskInfo = $('#taskInfo').hide().text('');

		$.get(url)
			.done(function(data) { displayTaskInfo(taskInfo, data); })
			.fail(function() { taskInfo.text('Error loading data'); })
			.always(function() {loadingInfo.hide(); taskInfo.show();});
	});
});

function displayTaskInfo(taskInfo, data) {
	if (data.length < 1) { 
		return;
	}

	var headers = [];
	var info = '<table><thead><tr>';
	// Extract headers
	for (var headerName in data[0].info) {
		headers.push(headerName);
		info += '<th>' + headerName + '</th>'
	}
	info += '</tr></thead><tbody>';
	for (var i = 0; i < data.length; i++) {
		info += '<tr>';
		for (var j = 0; j < headers.length; j++) {
			var headerName = headers[j];
			info += '<td>' + JSON.stringify(data[i].info[headerName]) + '</td>';
		}
		info += '</tr>';
	}
	info += '</tbody></html>';
	taskInfo.html(info);
}

function prepareFilters() {
	filter_data['order_by'] = null;
	var order_by = [];
	var display_columns = [];
	var sortColumns = $("#tasksGrid th[data-sort]");
	sortColumns.filter(".sort-asc").each(function() {
		order_by.push($(this).attr('data-sort') + ' asc');
	});
	sortColumns.filter(".sort-desc").each(function() {
		order_by.push($(this).attr('data-sort') + ' desc');
	});

	if (order_by.length > 0) {
		filter_data['order_by'] = order_by.join(',');
	}

	filter_data['display_columns'] = null;
	$("a.columns_settings:has(input:checked)").each(function() {
		display_columns.push($(this).attr('data-value'));
	});

	if (display_columns.length > 0) {
		filter_data['display_columns'] = JSON.stringify(display_columns);
	}

	for(key in filter_data) {
		if(filter_data[key] == null) {
			delete filter_data[key]; 
		}
	}
}

function refresh() {
	prepareFilters();	
	
	window.location.replace(first_page_url + (!isNaN(records_per_page) ? ("/1/" + records_per_page) : "") + "?" + $.param(filter_data));
}