<?php
/**
 * @var string $id ID of person or page to view posts for
 */
require __DIR__ . '/../vendor/autoload.php';

/**
 * @todo throw error if no session
 */
if(!session_id()) {
    session_start();
}

$endpoint = $_GET['endpoint'];

$qs = $_GET;
unset($qs['endpoint']);
$qs['access_token'] = $_SESSION['fb_access_token'];

header('content-type: application/json');
echo file_get_contents('https://graph.facebook.com/' . FB_GRAPHVERSION . $endpoint . '?' . http_build_query($qs));