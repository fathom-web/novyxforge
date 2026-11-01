<?php
declare(strict_types=1);

// Same-origin, privacy-friendly visit registrations. No IP address, fingerprint or user agent stored.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');

function sendCounterResponse(int $code, array $payload): void {
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method !== 'GET' && $method !== 'POST') {
    header('Allow: GET, POST');
    sendCounterResponse(405, ['error' => 'Method not allowed']);
}
if ($method === 'POST') {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '' && !in_array($origin, ['https://novyxforge.com', 'https://www.novyxforge.com'], true)) {
        sendCounterResponse(403, ['error' => 'Origin not allowed']);
    }
    $fetchSite = $_SERVER['HTTP_SEC_FETCH_SITE'] ?? '';
    if ($fetchSite !== '' && !in_array($fetchSite, ['same-origin', 'same-site', 'none'], true)) {
        sendCounterResponse(403, ['error' => 'Cross-site request blocked']);
    }
}

// Override with NOVYX_COUNTER_FILE to keep state outside the public document root.
// Default state is an ignored PHP file, which exits if requested directly via the web server.
$stateFile = getenv('NOVYX_COUNTER_FILE') ?: __DIR__ . '/.visitor-counter-state.php';
$handle = @fopen($stateFile, 'c+');
if ($handle === false) sendCounterResponse(503, ['error' => 'Visitor counter storage unavailable']);
if (!flock($handle, LOCK_EX)) {
    fclose($handle);
    sendCounterResponse(503, ['error' => 'Visitor counter busy']);
}
rewind($handle);
$stored = stream_get_contents($handle);
$raw = trim(str_replace('<?php exit; ?>', '', $stored === false ? '' : $stored));
$visits = ctype_digit($raw) ? max(0, (int)$raw) : 0;
if ($method === 'POST') {
    if ($visits >= PHP_INT_MAX) {
        flock($handle, LOCK_UN);
        fclose($handle);
        sendCounterResponse(503, ['error' => 'Counter limit reached']);
    }
    ++$visits;
    rewind($handle);
    $value = "<?php exit; ?>\n" . $visits . "\n";
    if (!ftruncate($handle, 0) || fwrite($handle, $value) !== strlen($value) || !fflush($handle)) {
        flock($handle, LOCK_UN);
        fclose($handle);
        sendCounterResponse(503, ['error' => 'Visitor counter could not be saved']);
    }
}
flock($handle, LOCK_UN);
fclose($handle);
sendCounterResponse(200, ['visits' => $visits]);
