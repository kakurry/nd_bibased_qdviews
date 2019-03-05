/**
 *@class I18N
 *description:js multi language class,should be loaded before others,singleton.
 *author:ganjp
 *date:2010-8-16
 */
var I18N = null;
if(!I18N){
I18N = {
	save: "save",
	reset: "reset",	
	close: "close",
	confirm: "confirm",
	cancel: "cancel",
	yes: "yes",
	no: "no",
	refresh: "refresh",
	loading: "loading...",
	promp: "promp",
	error: "error",
	warn:  "warn",
	add: "add",
	edit: "edit",
	del: "delete",
	search: "search",
	choose: "please choose...",
	
	msg_del_sucess: "delete records success",
	msg_del_confirm: "are you sure delete records?",
	msg_no_sel_del_record: "please first select records by deleted!",
	msg_no_sel_edit_record: "please first select records by edited!",
	msg_no_sel_view_record: "please first select records by viewed!",
	msg_single_edit_record: "only single record by edited",
	msg_single_view_record: "only single record by viewed",
	msg_bg_verify_fail: "Background verification failed!",
	msg_fg_verify_fail: "Frontground verification failed",
	msg_fg_verify_fail_tip: "there is error input char, so not save !",
	msg_saving: "saving 。。。",
	msg_system_error: "system error",
	msg_set_form_id: "please set form ID:",
	msg_pwd_not_match: "Passwords do not match",
	msg_cd_format_error: "This field should only contain letters, numbers, - and _",
	msg_chinese_format_error: "This field should only contain chinese",
	
	grid_bbar_displayMsg: "record {0} - {1} of {2}",
	grid_bbar_emptyMsg: "no records"
};
};