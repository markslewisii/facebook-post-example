<?php
require __DIR__ . '/../vendor/autoload.php';

if(!session_id()) {
    session_start();
}

$fb = new Facebook\Facebook([
	'app_id' => FB_APPID, // Replace {app-id} with your app id
	'app_secret' => FB_APPSECRET,
	'default_graph_version' => FB_GRAPHVERSION,
]);

$helper = $fb->getRedirectLoginHelper();

$permissions = ['user_posts','manage_pages']; // Optional permissions
$loginUrl = $helper->getLoginUrl('http://'. $_SERVER['SERVER_NAME'] .'/fb-callback.php', $permissions);

### OUTPUT
$smartyObj = new ConfiguredSmarty();
$smartyObj->assign('url_fb_login', $loginUrl);
$smartyObj->display('index.html');
