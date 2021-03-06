$(function(){
    var customers = {};

    customers.modal = {
        show_new: function(){
            $('#mdl_new').modal({backdrop: 'static'}).show();
        }
    };

    customers.ajax = {
        save: function(data, cb){
            var url = '/customers/save',
                params = {
                    data: data
                };

            App.ajax(url, params, function(err, data){
                err ? cb(err) : cb(null, data);
            });
        },
        remove: function(code, cb){
            var url = '/customers/remove',
                params = {
                    code: code
                };

            App.ajax(url, params, function(err, data){
                err ? cb(err) : cb(null, data);
            });
        },
        get_list: function(start, stop, cb){
            var url = '/customers/get_list',
                params = {
                	start: start,
                	stop: stop
                };

            App.ajax(url, params, function(err, data){
                err ? cb(err) : cb(null, data);
            });
        },
        get_list_total: function(cb){
            var url = '/customers/get_list_total',
                params = {};

            App.ajax(url, params, function(err, data){
                err ? cb(err) : cb(null, data);
            });
        },
        search: function(query, cb){
            var url = '/customers/search',
                params = {
                    query: query
                };

            App.ajax(url, params, function(err, data){
                err ? cb(err) : cb(null, data);
            });
        },

        get_detail: function(customer_code, cb){
            var url = '/customers/get_detail',
                params = {
                    customer_code: customer_code
                };

            App.ajax(url, params, function(err, data){
                err ? cb(err) : cb(null, data);
            });
        }


    };

    customers.set_list = function(data){
    	$('#tbl_list tbody').empty();
    	if(_.size(data.rows) > 0){
            _.each(data.rows, function(v){
                $('#tbl_list tbody').append(
                    '<tr>'+
                        '<td>' + v.code + '</td>' +
                        '<td>' + v.name + '</td>' +
                        '<td>' + App.clear_null_value(v.contact_name) + '</td>' +
                        '<td>' + App.clear_null_value(v.address) + '</td>' +
                        '<td>' + App.clear_null_value(v.telephone) + '</td>' +
                        '<td>' +
                            '<div class="btn-group">' +
                            '<a href="javascript:void(0);" class="btn" data-name="edit" data-code="' + v.code + '"><i class="icon-edit"></i></a>' +
                            '<a href="javascript:void(0);" class="btn" data-name="remove" data-code="' + v.code + '"><i class="icon-trash"></i></a>' +
                            '</div>' +
                        '</td>' +
                    '</tr>'
                );
            });
        }else{
            $('#tbl_list tbody').append(
                '<tr><td colspan="6">ไม่พบรายการ</td></tr>'
            );
        }
	};

    customers.get_list = function(){
    	$('#main_paging').fadeIn('slow');
		customers.ajax.get_list_total(function(err, data){
	        if(err){
	            App.alert(err);
	        }else{
	            $('#main_paging').paging(data.total, {
	                format: " < . (qq -) nnncnnn (- pp) . >",
	                perpage: App.record_perpage,
	                lapping: 1,
	                page: 1,
	                onSelect: function(page){
	                    //console.log('page: ' + page);
	                    //console.log(this.slice);      //this.slice[0] = start, this.slice[1] = stop

	                    customers.ajax.get_list(this.slice[0], this.slice[1], function(err, data){
	                        if(err){
	                            App.alert(err);
	                            $('#tbl_list tbody').empty();
	                        }else{
	                            customers.set_list(data);
	                        }

	                    });

	                },
	                onFormat: function(type){
	                    switch (type) {

	                        case 'block':

	                            if (!this.active)
	                                return '<li class="disabled"><a href="">' + this.value + '</a></li>';
	                            else if (this.value != this.page)
	                                return '<li><a href="#' + this.value + '">' + this.value + '</a></li>';
	                            return '<li class="active"><a href="#">' + this.value + '</a></li>';

	                        case 'right':
	                        case 'left':

	                            if (!this.active) {
	                                return "";
	                            }
	                            return '<li><a href="#' + this.value + '">' + this.value + '</a></li>';

	                        case 'next':

	                            if (this.active) {
	                                return '<li><a href="#' + this.value + '">&raquo;</a></li>';
	                            }
	                            return '<li class="disabled"><a href="">&raquo;</a></li>';

	                        case 'prev':

	                            if (this.active) {
	                                return '<li><a href="#' + this.value + '">&laquo;</a></li>';
	                            }
	                            return '<li class="disabled"><a href="">&laquo;</a></li>';

	                        case 'first':

	                            if (this.active) {
	                                return '<li><a href="#' + this.value + '">&lt;</a></li>';
	                            }
	                            return '<li class="disabled"><a href="">&lt;</a></li>';

	                        case 'last':

	                            if (this.active) {
	                                return '<li><a href="#' + this.value + '">&gt;</a></li>';
	                            }
	                            return '<li class="disabled"><a href="">&gt;</a></li>';

	                        case 'fill':
	                            if (this.active) {
	                                return '<li class="disabled"><a href="#">...</a></li>';
	                            }
	                    }
	                    return ""; // return nothing for missing branches
	                }
	            });
	        }
	    });
	};

    customers.clear_form = function(){
        $('#txt_name').val('');
        $('#txt_code').val('');
        $('#txt_address').val('');
        $('#txt_contact_name').val('');
        $('#txt_telephone').val('');
        $('#txt_fax').val('');
        $('#txt_email').val('');
        $('#txt_isupdate').val('0');

        $('#txt_code').removeAttr('disabled', 'disabled');
    };

    //show new modal
    $('#btn_new').click(function(){
        customers.clear_form();
        customers.modal.show_new();
    });

    $('#btn_save').click(function(){
        var items = {};
        items.name = $('#txt_name').val();
        items.code = $('#txt_code').val();
        items.address = $('#txt_address').val();
        items.contact_name = $('#txt_contact_name').val();
        items.telephone = $('#txt_telephone').val();
        items.fax = $('#txt_fax').val();
        items.email = $('#txt_email').val();
        items.isupdate = $('#txt_isupdate').val();

        if(!items.name){
            App.alert('กรุณาระบุชื่อ');
        }else{
            customers.ajax.save(items, function(err){
                if(err){
                    App.alert(err);
                }else{
                    App.alert('บันทึกรายการเสร็จเรียบร้อยแล้ว');
                    customers.clear_form();
                    $('#mdl_new').modal('hide');
                    //load list
                    customers.get_list();
                }
            });
        }
    });

    $('a[data-name="edit"]').live('click', function(){
        var customer_code = $(this).attr('data-code');

        customers.ajax.get_detail(customer_code, function(err, data){
            if(err){
                App.alert(err);
            }else{
                $('#txt_name').val(data.rows.name);
                $('#txt_code').val(data.rows.code);
                $('#txt_address').val(data.rows.address);
                $('#txt_contact_name').val(data.rows.contact_name);
                $('#txt_telephone').val(data.rows.telephone);
                $('#txt_fax').val(data.rows.fax);
                $('#txt_email').val(data.rows.email);
                $('#txt_isupdate').val('1');

                $('#txt_code').attr('disabled', 'disabled').css('background-color', 'white');

                customers.modal.show_new();
            }
        });


    });

    $('#mdl_new').on('hidden', function(){
        customers.clear_form();
    });

    $('a[data-name="remove"]').live('click', function(){
        var code = $(this).attr('data-code');
        var t = $(this).parent().parent().parent();

        if(confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')){
            customers.ajax.remove(code, function(err){
                if(err){
                    App.alert(err);
                }else{
                    //remove row
                    App.alert('ลบรายการเสร็จเรียบร้อยแล้ว');
                    $(t).fadeOut('slow');
                }
            });
        }
    });

    //search
    $('#btn_search').click(function(){
        var query = $.trim($('#txt_query').val());

        $('#tbl_list tbody').empty();

		$('#main_paging').fadeOut('slow');

        if(query && query.length > 2){
            //do search
            customers.ajax.search(query, function(err, data){
                if(err){
                    App.alert(err);
                    $('#tbl_list tbody').append(
                        '<tr><td colspan="6">ไม่พบรายการ</td></tr>'
                    );
                }else{
                    customers.set_list(data);
                }
            });
        }else{
            customers.get_list();
        }
    });

    $('#btn_export').on('click', function(){
        App.goto_url('/prints/customer');
    });

    customers.get_list();

});
