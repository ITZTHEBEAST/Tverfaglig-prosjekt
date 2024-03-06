<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection details
$servername = "172.20.128.69";
$username = "fredrik";
$password = "Skole123";
$dbname = "MELDINGER";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch tasks from the database
$sql = "SELECT * FROM tasks";
$result = $conn->query($sql);

if ($result) {
    $tasks = array();
    while ($row = $result->fetch_assoc()) {
        $tasks[] = array('taskId' => $row['id'], 'taskText' => $row['taskText']);
    }

    $response = array('status' => 'success', 'tasks' => $tasks);
} else {
    $response = array('status' => 'error', 'message' => 'Error fetching tasks: ' . $conn->error);
}

// Output response as JSON
header('Content-Type: application/json');
echo json_encode($response);

// Close the database connection
$conn->close();
?>
