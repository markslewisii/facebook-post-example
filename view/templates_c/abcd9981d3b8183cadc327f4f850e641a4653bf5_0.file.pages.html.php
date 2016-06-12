<?php
/* Smarty version 3.1.29, created on 2016-06-11 18:46:43
  from "/opt/httpd/fb.configuredbase.local/view/templates/pages.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_575cbf03d13c07_86723096',
  'file_dependency' => 
  array (
    'abcd9981d3b8183cadc327f4f850e641a4653bf5' => 
    array (
      0 => '/opt/httpd/fb.configuredbase.local/view/templates/pages.html',
      1 => 1465695998,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:_inc/document-top.html' => 1,
    'file:_inc/document-bottom.html' => 1,
  ),
),false)) {
function content_575cbf03d13c07_86723096 ($_smarty_tpl) {
?>

<?php $_smarty_tpl->_cache['capture_stack'][] = array("js_script", null, null); ob_start(); ?>
jQuery(document).ready(function() {

	jQuery('div[fb-page-id]').click(function() {
		window.location.href = '/pages.php?id=' + jQuery(this).attr('fb-page-id');
	});
});
<?php list($_capture_buffer, $_capture_assign, $_capture_append) = array_pop($_smarty_tpl->_cache['capture_stack']);
if (!empty($_capture_buffer)) {
 if (isset($_capture_assign)) $_smarty_tpl->assign($_capture_assign, ob_get_contents());
 if (isset( $_capture_append)) $_smarty_tpl->append( $_capture_append, ob_get_contents());
$_smarty_tpl->_cache['__smarty_capture'][$_capture_buffer]=ob_get_clean();
} else $_smarty_tpl->capture_error();?>

<?php $_smarty_tpl->smarty->ext->_subtemplate->render($_smarty_tpl, "file:_inc/document-top.html", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('script'=>(isset($_smarty_tpl->_cache['__smarty_capture']['js_script']) ? $_smarty_tpl->_cache['__smarty_capture']['js_script'] : null)), 0, false);
?>

<h2>User</h2>
<div fb-page-id="<?php echo $_smarty_tpl->tpl_vars['fb_user']->value['id'];?>
">
	<img src="//graph.facebook.com/v2.6/<?php echo $_smarty_tpl->tpl_vars['fb_user']->value['id'];?>
/picture?redirect=1&type=large" /> <?php echo $_smarty_tpl->tpl_vars['fb_user']->value['name'];?>

</div>
<h2>Pages</h2>
<?php
$_from = $_smarty_tpl->tpl_vars['fb_pages']->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_page_0_saved_item = isset($_smarty_tpl->tpl_vars['page']) ? $_smarty_tpl->tpl_vars['page'] : false;
$_smarty_tpl->tpl_vars['page'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['page']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['page']->value) {
$_smarty_tpl->tpl_vars['page']->_loop = true;
$__foreach_page_0_saved_local_item = $_smarty_tpl->tpl_vars['page'];
?>
<div fb-page-id="<?php echo $_smarty_tpl->tpl_vars['page']->value['id'];?>
">
	<img src="//graph.facebook.com/v2.6/<?php echo $_smarty_tpl->tpl_vars['page']->value['id'];?>
/picture" /> <?php echo $_smarty_tpl->tpl_vars['page']->value['name'];?>

</div>
<?php
$_smarty_tpl->tpl_vars['page'] = $__foreach_page_0_saved_local_item;
}
if ($__foreach_page_0_saved_item) {
$_smarty_tpl->tpl_vars['page'] = $__foreach_page_0_saved_item;
}
?>

<?php $_smarty_tpl->smarty->ext->_subtemplate->render($_smarty_tpl, "file:_inc/document-bottom.html", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>

<?php }
}
