<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection details
$servername = "172.20.128.69";
$username = "fredrik";
$password = "Skole123";
$dbname = "MELDINGER";

$conn = new mysqli('172.20.128.69', 'fredrik', 'Skole123', $dbname);


// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the form data is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve task text from the form
    $taskText = $_POST["taskText"];

    // Insert task into the database
    $sql = "INSERT INTO tasks (taskText) VALUES ('$taskText')";
    
    if ($conn->query($sql) === TRUE) {
        $response = array('status' => 'success', 'message' => 'Task added successfully');
    } else {
        $response = array('status' => 'error', 'message' => 'Error adding task: ' . $conn->error);
    }

    // Output response as JSON
    header('Content-Type: application/json');
    echo json_encode($response);
}

// Close the database connection
$conn->close();
?>
