var dateModalInfo = '';

function dirtyView() {
	if (filter_data.changed === false) {
		filter_data.changed = true;
		$("[data-toggle=popover]").popover('show');
	}
}

$(document).ready(function() {
	$('#priority').slider({ formater: function (value) { return value.toFixed(2); } }).on('slide', function(ev) {
		dirtyView();

		filter_data.priority_from = ev.value[0].toFixed(2);
		filter_data.priority_to = ev.value[1].toFixed(2);
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

    $('.datepicker').datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: "yy-mm-dd"
    });

	$('#dateModal').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget);
		var info = button.data('info');

		dateModalInfo = info;

		var modal = $(this);
		var interval = ['from', 'to'];

		interval.forEach(function(attr) {
		    var dateTime = filter_data[info + '_' + attr];
		    var dateEntry = modal.find('.modal-body #date_' + attr);
		    var timeEntry = modal.find('.modal-body #time_' + attr);

		    if (dateTime) {
		        dateEntry.val(dateTime.substring(0, dateTime.indexOf('T')));
			    timeEntry.val(dateTime.substring(dateTime.indexOf('T') + 1));
		    }
		    else{
		        dateEntry.val("");
                timeEntry.val("");
		    }
		});
	});

	$('#saveDateModal').click(function() {
		var info = dateModalInfo;
		var modal = $('#dateModal');

		var time_from = modal.find('.modal-body #time_from').val();
		var time_to = modal.find('.modal-body #time_to').val();
		var date_from = modal.find('.modal-body #date_from').val();
		var date_to = modal.find('.modal-body #date_to').val();

		var from = '', to = '';
		if (date_from) {
			from = date_from + 'T' + (time_from || '00:00');
		}
		if (date_to) {
			to = date_to + 'T' + (time_to || '23:59');
		}

		filter_data[info + '_from'] = from;
		filter_data[info + '_to'] = to;

		modal.modal('hide');
		refresh();
	});

	$('.records_per_page').click(function() {
		records_per_page = parseInt($(this).text());

		refresh();
	});

	$('.pagination-tasks-browse').click(function() {
		var preparedFilters = prepareFilters();
		$(this).attr('href', $(this).attr('href') + "?" + $.param(preparedFilters));
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

  var firstShow = true;
  var filterCount = 0;
  var filterRowModel = null;
  $('.remove-filter-button').click(removeFilterRow);

  function removeFilterRow() {
    if (filterCount === 1) {
      $('.filter-field-name').val(0);
      $('.filter-field-value').val(null)
                              .prop('disabled', true);
    }
    else {
      $(this).parents('.row').remove();
      filterCount -= 1;
    }
  };

  function enableOnChange(event) {
    var row = $(this).parents('.row');
    row.find('.filter-field-value')
       .prop('disabled', false);
    row.find('.filter-field-operator')
       .prop('disabled', false);
  };

  function addFieldFilterRow(fieldName, operator, fieldValue, enabled) {
    fieldName = fieldName || "";
    operator = operator || "";
    fieldValue = fieldValue || "";

    var toAppend = filterRowModel.clone();

    toAppend.find('.filter-field-name')
            .val(fieldName)
            .change(enableOnChange);
    toAppend.find('.filter-field-operator')
            .val(operator)
            .prop('disabled', !enabled);
    toAppend.find('.filter-field-value')
            .val(fieldValue)
            .prop('disabled', !enabled);
    toAppend.find('.remove-filter-button')
            .click(removeFilterRow);

    $('#filterModal .filter-rows').append(toAppend);
    filterCount += 1;
  };

  function createFilterRowModel() {
      $('.filter-field-name').change(enableOnChange);
      var model = $('#filterModal .filter-rows .row').first();

      filterRowModel = model.clone();
      model.remove();
  };

  $('#filterModal').on('show.bs.modal', function(event) {
    if (firstShow) {
      createFilterRowModel();
      addFieldFilterRow();
    }
    if (firstShow && filter_data.filter_by_field) {
      filter_data.filter_by_field.forEach(function(elt) {
        addFieldFilterRow(elt[0], elt[1], elt[2], true);
      });
    }
    firstShow = false;
  });

  $('#saveFilterModal').click(function() {
    var filterRows = $('#filterModal .filter-rows .row');
    filterRows = $.makeArray(filterRows);

    var filters = filterRows.map(function(elt) {
      var elt = $(elt);
      var fieldName = elt.find('.filter-field-name').val();
      var operator = elt.find('.filter-field-operator').val();
      var fieldValue = elt.find('.filter-field-value').val();
      if (fieldName) {
        return [fieldName, operator, fieldValue];
      }
    }).filter(function(elt) {
      return elt;
    });
    filter_data.filter_by_field = filters;

    $('#filterModal').modal('hide');
    refresh();
  });

  $('.add-filter-row-button').click(function(evt) {
    addFieldFilterRow();
  });

    function getSelection() {
        var taskIds = [];
        for (var id in selectedTasks) {
            if (selectedTasks[id]) {
                taskIds.push(parseInt(id));
            }
        }
        return taskIds;
    };

    $('#btn-edit-priority').click(function() {
        $("#update-priority-modal").modal("show");
    });

    $('#save-priority-modal').click(function() {
        var priority = parseFloat($("#priority-value").val());
        $("#update-priority-modal").modal("hide");
        window.scrollTo(0, 0);
        if (isNaN(priority) || priority < 0 || priority > 1) {
            pybossaNotify("Invalid priority", true, "warning");
            return;
        }
        var data = getFilterObject();
        data.priority_0 = priority;
        var url = getUrlFor("/priorityupdate");
        sendUpdateRequest(url, data).done(function(res) {
            refresh();
        });
    });

    $('#btn-edit-redundancy').click(function() {
        $("#update-redundancy-modal").modal("show");
    });

    $('#save-redundancy-modal').click(function() {
        var redundancy = parseInt($("#redundancy-value").val());
        $("#update-redundancy-modal").modal("hide");
        MAX_ALLOWED = 1000;
        MIN_ALLOWED = 1;
        window.scrollTo(0, 0);
        if (isNaN(redundancy) || redundancy < MIN_ALLOWED || redundancy > MAX_ALLOWED) {
            pybossaNotify("Invalid redundancy: please enter a value between " +
                          MIN_ALLOWED + " and " + MAX_ALLOWED, true, "warning");
            return;
        }
        var data = getFilterObject();
        data.n_answers = redundancy;
        var url = getUrlFor("/redundancyupdate");
        sendUpdateRequest(url, data).done(function(res) {
            refresh();
        });
    });

    $('#save-delete-modal').click(function() {
        $("#delete-tasks-modal").modal("hide");
        window.scrollTo(0, 0);
        var data = getFilterObject();
        var url = getUrlFor("/deleteselected");
        sendUpdateRequest(url, data).done(function(res) {
            if (res.enqueued) {
                pybossaNotify("Your request has been enqueued, you will receive an email when the task deletion is complete.", true, "warning");
            }
            else {
                refresh();
            }
        });
    });

    function getUrlFor(endpoint) {
        var baseUrl = window.location.pathname.split('/browse')[0];
        return baseUrl + endpoint;
    };

    function getFilterObject() {
        taskIds = getSelection();
        if (taskIds.length) {
            return {
                taskIds: taskIds
            };
        }
        else {
            return {
                filters: prepareFilters()
            };
        }
    };

    function sendUpdateRequest(endpoint, data) {
        return $.ajax({
            type: "POST",
            url: endpoint,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data)
        }).fail(function(res) {
            pybossaNotify("There was an error processing the request.", true, "warning");
        });
    };

    $(".task-checkbox").click(function(evt) {
        var rowElt = $(this).parents('.task-row').first();
        if (this.checked) {
            rowElt.addClass('bg-primary');
        }
        else {
            rowElt.removeClass('bg-primary');
        }
        var taskId = rowElt.first()
                           .find('a.label')
                           .html()
                           .replace('#', '');
        selectedTasks[taskId] = this.checked;
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
    var preparedFilters = $.extend(true, {}, filter_data);
	preparedFilters['order_by'] = null;
    var filter_by_field = preparedFilters['filter_by_field'] || [];
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
		preparedFilters['order_by'] = order_by.join(',');
	}

	preparedFilters['display_columns'] = null;
	$("a.columns_settings:has(input:checked)").each(function() {
		display_columns.push($(this).attr('data-value'));
	});

	if (display_columns.length > 0) {
		preparedFilters['display_columns'] = JSON.stringify(display_columns);
	}

	for(key in preparedFilters) {
		if(preparedFilters[key] == null) {
			delete preparedFilters[key];
		}
	}

  if (filter_by_field.length > 0) {
    preparedFilters['filter_by_field'] = JSON.stringify(filter_by_field);
  }
  return preparedFilters;
}

function refresh() {
	var preparedFilters = prepareFilters();

	window.location.replace(first_page_url + (!isNaN(records_per_page) ? ("/1/" + records_per_page) : "") + "?" + $.param(preparedFilters));
}
