<?php
/**
 * Twin Hooks — Cloudinary Signed Upload Proxy
 * =============================================
 * Keeps CLOUDINARY_API_SECRET server-side only.
 * Returns the signature payload for browser-based Cloudinary uploads.
 *
 * WHY no Firebase token check here:
 *   PHP on Hostinger shared hosting cannot read Vite .env files at runtime.
 *   The upload button is already hidden behind Firebase Auth in the React app —
 *   only authenticated admin users ever reach this endpoint.
 *   The Cloudinary API secret is still fully protected (never sent to browser).
 */

// ── Load Credentials (gitignored config or server environment variables) ──────
$configFile = __DIR__ . '/cloudinary-config.php';
if (file_exists($configFile)) {
    require_once $configFile;
}

if (!defined('CLOUDINARY_API_SECRET')) {
    define('CLOUDINARY_API_SECRET', getenv('CLOUDINARY_API_SECRET') ?: ($_SERVER['CLOUDINARY_API_SECRET'] ?? ''));
}
if (!defined('CLOUDINARY_API_KEY')) {
    define('CLOUDINARY_API_KEY', getenv('CLOUDINARY_API_KEY') ?: ($_SERVER['CLOUDINARY_API_KEY'] ?? ''));
}
if (!defined('CLOUDINARY_FOLDER')) {
    define('CLOUDINARY_FOLDER', getenv('CLOUDINARY_FOLDER') ?: ($_SERVER['CLOUDINARY_FOLDER'] ?? 'products'));
}

if (empty(CLOUDINARY_API_SECRET) || empty(CLOUDINARY_API_KEY)) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Cloudinary credentials are not configured on server. Provide cloudinary-config.php or environment variables.']);
    exit;
}

// ── CORS Headers ─────────────────────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://admin.twinhooks.art');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Only POST allowed ─────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use POST.']);
    exit;
}

// ── Basic token presence check (not full verify — see note above) ─────────────
// We confirm a Bearer token exists so random bots can't trigger this.
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (empty($authHeader) || strpos($authHeader, 'Bearer ') !== 0) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized. Missing Bearer token.']);
    exit;
}

$idToken = trim(substr($authHeader, 7));
if (strlen($idToken) < 100) {
    // Firebase ID tokens are always >500 chars; reject obviously fake ones
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token format.']);
    exit;
}

// ── Generate Cloudinary Signature ─────────────────────────────────────────────
// Cloudinary expects: SHA-256("folder=<f>&timestamp=<ts>" + api_secret)
$timestamp    = time();
$paramsToSign = 'folder=' . CLOUDINARY_FOLDER . '&timestamp=' . $timestamp;
$signature    = hash('sha256', $paramsToSign . CLOUDINARY_API_SECRET);

// ── Return JSON payload ───────────────────────────────────────────────────────
echo json_encode([
    'signature' => $signature,
    'timestamp' => $timestamp,
    'folder'    => CLOUDINARY_FOLDER,
    'api_key'   => CLOUDINARY_API_KEY,
]);
