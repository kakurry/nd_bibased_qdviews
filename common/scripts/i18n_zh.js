/**
 *@class I18N
 *description:js multi language class,should be loaded before others,singleton.
 *author:ganjp
 *date:2010-8-16
 */
var I18N = null;
if(!I18N){
I18N = {
	save: "保存",
	reset: "重置",
	close: "关闭",
	confirm: "确定",
	cancel: "取消",
	yes: "是",
	no: "否",
	refresh: "刷新",
	loading: "请稍等...",
	promp: "提示",
	error: "错误",
	warn:  "警告",
	add: "增加",
	edit: "编辑",
	del: "删除",
	search: "查询",
	choose: "请选择...",
	
	msg_del_sucess: "成功删除所选的数据!",
	msg_del_confirm: "确认要删除数据吗?",
	msg_no_sel_del_record: "请先选择要删除的行!",
	msg_no_sel_edit_record: "请先选择要编辑的行!",
	msg_no_sel_view_record: "请先选择要查看的行!",
	msg_single_edit_record: "编辑时只能单选!",
	msg_single_view_record: "查看时只能单选!",
	msg_bg_verify_fail: "后台验证失败",
	msg_fg_verify_fail: "前台验证失败",
	msg_fg_verify_fail_tip: "有必填项为空或非法字符不能保存!",
	msg_saving: "正在保存...",
	msg_system_error: "系统错误",
	msg_set_form_id: "请在表单中设置ID项:",
	msg_pwd_not_match: "密码不一致",
	msg_cd_format_error: "该输入项只能包含半角字母,数字,-和_",
	msg_chinese_format_error: "该项只能输入中文",
		
	grid_bbar_displayMsg:"记录 {0} - {1} 共 {2}",
	grid_bbar_emptyMsg:"没有数据记录"
};
};
