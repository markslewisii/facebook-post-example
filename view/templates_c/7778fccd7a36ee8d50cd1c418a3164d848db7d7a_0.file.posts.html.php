<?php
/* Smarty version 3.1.29, created on 2016-06-11 22:56:25
  from "/opt/httpd/fb.configuredbase.local/view/templates/posts.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_575cf989382127_75463807',
  'file_dependency' => 
  array (
    '7778fccd7a36ee8d50cd1c418a3164d848db7d7a' => 
    array (
      0 => '/opt/httpd/fb.configuredbase.local/view/templates/posts.html',
      1 => 1465710980,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:_inc/document-top.html' => 1,
    'file:_inc/document-bottom.html' => 1,
  ),
),false)) {
function content_575cf989382127_75463807 ($_smarty_tpl) {
?>

<?php $_smarty_tpl->_cache['capture_stack'][] = array("js_script", null, null); ob_start(); ?>
jQuery(window).load(function() {

	jQuery('div[fb-page-id]').click(function() {
		window.location.href = '/pages.php?id=' + jQuery(this).attr('fb-page-id');
	});

	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
	jQuery("#date_slider").dateRangeSlider();

});



<?php list($_capture_buffer, $_capture_assign, $_capture_append) = array_pop($_smarty_tpl->_cache['capture_stack']);
if (!empty($_capture_buffer)) {
 if (isset($_capture_assign)) $_smarty_tpl->assign($_capture_assign, ob_get_contents());
 if (isset( $_capture_append)) $_smarty_tpl->append( $_capture_append, ob_get_contents());
$_smarty_tpl->_cache['__smarty_capture'][$_capture_buffer]=ob_get_clean();
} else $_smarty_tpl->capture_error();
$_smarty_tpl->smarty->ext->_subtemplate->render($_smarty_tpl, "file:_inc/document-top.html", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array('script'=>(isset($_smarty_tpl->_cache['__smarty_capture']['js_script']) ? $_smarty_tpl->_cache['__smarty_capture']['js_script'] : null)), 0, false);
?>

<h2>Posts</h2>

<div id="date_slider"></div>

<?php
$_from = $_smarty_tpl->tpl_vars['fb_posts']->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_post_0_saved_item = isset($_smarty_tpl->tpl_vars['post']) ? $_smarty_tpl->tpl_vars['post'] : false;
$_smarty_tpl->tpl_vars['post'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['post']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['post']->value) {
$_smarty_tpl->tpl_vars['post']->_loop = true;
$__foreach_post_0_saved_local_item = $_smarty_tpl->tpl_vars['post'];
?>
<div fb-post-id="<?php echo $_smarty_tpl->tpl_vars['post']->value;?>
">
	<strong><?php echo $_smarty_tpl->tpl_vars['post']->value['created_time']->timezone;?>
</strong><br />
	<?php echo print_r($_smarty_tpl->tpl_vars['post']->value);?>

</div>
<?php
$_smarty_tpl->tpl_vars['post'] = $__foreach_post_0_saved_local_item;
}
if ($__foreach_post_0_saved_item) {
$_smarty_tpl->tpl_vars['post'] = $__foreach_post_0_saved_item;
}
?>

<?php $_smarty_tpl->smarty->ext->_subtemplate->render($_smarty_tpl, "file:_inc/document-bottom.html", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>

<?php }
}
