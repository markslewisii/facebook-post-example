<?php
/* Smarty version 3.1.29, created on 2016-06-11 17:11:42
  from "/opt/httpd/fb.configuredbase.local/view/templates/index.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_575ca8be1d0429_20967070',
  'file_dependency' => 
  array (
    '93e9ed2cc83adea6e500a92666c47125e3a4b5b4' => 
    array (
      0 => '/opt/httpd/fb.configuredbase.local/view/templates/index.html',
      1 => 1465689830,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:_inc/document-top.html' => 1,
    'file:_inc/document-bottom.html' => 1,
  ),
),false)) {
function content_575ca8be1d0429_20967070 ($_smarty_tpl) {
?>

<?php $_smarty_tpl->smarty->ext->_subtemplate->render($_smarty_tpl, "file:_inc/document-top.html", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>


<button onclick="window.location.href='<?php echo $_smarty_tpl->tpl_vars['url_fb_login']->value;?>
'">Login with Facebook</button>

<?php $_smarty_tpl->smarty->ext->_subtemplate->render($_smarty_tpl, "file:_inc/document-bottom.html", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}
