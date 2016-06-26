<?php
/* Smarty version 3.1.29, created on 2016-06-12 15:57:19
  from "/opt/httpd/fb.configuredbase.local/view/templates/_inc/document-top.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_575de8cf942591_73464306',
  'file_dependency' => 
  array (
    '82d82efcc371bf7a17a4759ad9a5e0995cf450ed' => 
    array (
      0 => '/opt/httpd/fb.configuredbase.local/view/templates/_inc/document-top.html',
      1 => 1465772228,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_575de8cf942591_73464306 ($_smarty_tpl) {
?>

<!doctype html>

<html lang="en">
<head>
	<meta charset="utf-8" />
	<title><?php echo $_smarty_tpl->tpl_vars['title']->value;?>
</title>

	
	<?php if (isset($_smarty_tpl->tpl_vars['css']->value)) {?>
		<?php
$_from = $_smarty_tpl->tpl_vars['css']->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_css_file_0_saved_item = isset($_smarty_tpl->tpl_vars['css_file']) ? $_smarty_tpl->tpl_vars['css_file'] : false;
$_smarty_tpl->tpl_vars['css_file'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['css_file']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['css_file']->value) {
$_smarty_tpl->tpl_vars['css_file']->_loop = true;
$__foreach_css_file_0_saved_local_item = $_smarty_tpl->tpl_vars['css_file'];
?>
		<link rel="stylesheet" href="<?php echo $_smarty_tpl->tpl_vars['css_file']->value;?>
" />
		<?php
$_smarty_tpl->tpl_vars['css_file'] = $__foreach_css_file_0_saved_local_item;
}
if ($__foreach_css_file_0_saved_item) {
$_smarty_tpl->tpl_vars['css_file'] = $__foreach_css_file_0_saved_item;
}
?>
	<?php } else { ?>
		<link rel="stylesheet" href="/js/jQRangeSlider/css/iThing.css" />
	<?php }?>

	
	<?php if (isset($_smarty_tpl->tpl_vars['js']->value)) {?>
		<?php
$_from = $_smarty_tpl->tpl_vars['js']->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_js_file_1_saved_item = isset($_smarty_tpl->tpl_vars['js_file']) ? $_smarty_tpl->tpl_vars['js_file'] : false;
$_smarty_tpl->tpl_vars['js_file'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['js_file']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['js_file']->value) {
$_smarty_tpl->tpl_vars['js_file']->_loop = true;
$__foreach_js_file_1_saved_local_item = $_smarty_tpl->tpl_vars['js_file'];
?>
		<?php echo '<script'; ?>
 src="<?php echo $_smarty_tpl->tpl_vars['js_file']->value;?>
"><?php echo '</script'; ?>
>
		<?php
$_smarty_tpl->tpl_vars['js_file'] = $__foreach_js_file_1_saved_local_item;
}
if ($__foreach_js_file_1_saved_item) {
$_smarty_tpl->tpl_vars['js_file'] = $__foreach_js_file_1_saved_item;
}
?>
	<?php } else { ?>
	<link rel="stylesheet" href="/js/jquery-ui-1.11.4/jquery-ui.min.css">
	<?php echo '<script'; ?>
 src="//code.jquery.com/jquery-2.2.4.js"><?php echo '</script'; ?>
>
	<?php echo '<script'; ?>
 src="/js/jquery-ui-1.11.4/jquery-ui.min.js"><?php echo '</script'; ?>
>

	<link rel="stylesheet" href="/js/jQRangeSlider-5.7.2/css/iThing.css" type="text/css" />
	<?php echo '<script'; ?>
 src="/js/jQRangeSlider-5.7.2/jQAllRangeSliders-min.js"><?php echo '</script'; ?>
>
	<?php }?>
	<?php echo '<script'; ?>
>
		<?php echo $_smarty_tpl->tpl_vars['script']->value;?>

	<?php echo '</script'; ?>
>
	
</head>
<body><?php }
}
