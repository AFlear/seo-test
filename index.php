<?php
ini_set('display_errors', 'on'); // Display all errors on screen
error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT & ~E_DEPRECATED);
header("Cache-Control: public");
header("Expires: " . date("r", time() + 3600));
header('Content-Type: text/html; charset=UTF-8');
ob_start();
@session_start();
//    define('DS', DIRECTORY_SEPARATOR);
define('DS', '/');
define('HOST', dirname(__FILE__)); // Root path
define('MULTI_LANGUAGE', false);
define('APPLICATION', 'frontend'); // Choose application - backend|frontend
define('PROFILER', false); // On/off profiler
define('START_TIME', microtime(true)); // For profiler. Don't touch!
define('START_MEMORY', memory_get_usage()); // For profiler. Don't touch!

require_once 'loader.php';

Core\Route::factory()->execute();
\Profiler::view();
