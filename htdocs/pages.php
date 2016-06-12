<?php
/**
 * @var string $id ID of person or page to view posts for
 */
require __DIR__ . '/../vendor/autoload.php';

if(!session_id()) {
    session_start();
}

$fb = new Facebook\Facebook([
	'app_id' => FB_APPID, // Replace {app-id} with your app id
	'app_secret' => FB_APPSECRET,
	'default_graph_version' => FB_GRAPHVERSION,
	'default_access_token' => $_SESSION['fb_access_token']
]);

### OUTPUT
$smartyObj = new ConfiguredSmarty();

// get posts for specific profile or page
if (isset($_GET['id'])) {
	if ($_SESSION['fb_page']['id'] != $_GET['id']) { // new ID save info
		$_SESSION['fb_page'] = array(
			'id' => $_GET['id']
		);
	}
	$postList = $fb->get('/' . $_SESSION['fb_page']['id'] . '/posts');
	// $postEdge = $postList->getGraphEdge();
	// var_dump($postEdge->getTotalCount());
	// exit();
	$smartyObj->assign('fb_posts', $postList->getGraphEdge()->asArray());
	$template = 'posts.html';

// show profile and available pages
} else {
	unset($_SESSION['fb_page']);
	$meResponse = $fb->get('/me');
	$pagesResponse = $fb->get('/me/accounts');
	$smartyObj->assign('fb_user', $meResponse->getGraphUser()->asArray());
	$smartyObj->assign('fb_pages', $pagesResponse->getGraphEdge()->asArray());
	$template = 'pages.html';
}


$smartyObj->display($template);
