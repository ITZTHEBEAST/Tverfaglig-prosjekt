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

// Check if the form data is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["taskText"])) {
        // Retrieve task text from the form
        $taskText = $_POST["taskText"];

        // Insert task into the database using prepared statement
        $sql = "INSERT INTO tasks (taskText) VALUES (?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $taskText);

        if ($stmt->execute()) {
            $response = array('status' => 'success', 'message' => 'Task added successfully', 'taskText' => $taskText, 'taskId' => $stmt->insert_id);
        } else {
            $response = array('status' => 'error', 'message' => 'Error adding task: ' . $stmt->error);
        }

        $stmt->close();
    } elseif (isset($_POST["taskId"])) {
        // Delete task from the database using prepared statement
        $taskId = $_POST["taskId"];

        $sql = "DELETE FROM tasks WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $taskId);

    

    // Output response as JSON
    header('Content-Type: application/json');
    echo json_encode($response);

    if ($stmt->execute()) {
        $response = array('status' => 'success', 'message' => 'Task deleted successfully');
    } else {
        $response = array('status' => 'error', 'message' => 'Error deleting task: ' . $stmt->error);
    }

    $stmt->close();
    } else {
        $response = array('status' => 'error', 'message' => 'Invalid request');
    }
}

// Close the database connection
$conn->close();
?>