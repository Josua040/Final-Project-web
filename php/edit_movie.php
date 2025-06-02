<?php
header('Content-Type: application/json');
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = (int)($_POST['movieId'] ?? 0);
    $image = $_POST['movieImage'] ?? 'https://via.placeholder.com/80x120/e94560/ffffff?text=No+Image';
    $title = $_POST['movieTitle'] ?? '';
    $description = $_POST['movieDescription'] ?? '';
    $year = (int)($_POST['movieYear'] ?? 0);
    $rating = (float)($_POST['movieRating'] ?? 0.0);

    if ($id <= 0 || empty($title) || empty($description) || $year < 1900 || $year > 2030 || $rating < 0 || $rating > 10) {
        echo json_encode(['success' => false, 'message' => 'Data tidak valid']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE movies SET image = ?, title = ?, description = ?, year = ?, rating = ? WHERE id = ?");
        $stmt->execute([$image, $title, $description, $year, $rating, $id]);
        echo json_encode(['success' => true, 'message' => 'Film berhasil diupdate']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Gagal mengupdate film: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Metode tidak diizinkan']);
}
?>