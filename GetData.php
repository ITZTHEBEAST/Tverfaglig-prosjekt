<?php
// Angi feilrapporteringsnivå for visning av feilmeldinger
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Detaljer for databaseforbindelse
$servername = "172.20.128.69";
$username = "fredrik";
$password = "Skole123";
$dbname = "MELDINGER";

// Opprett en ny mysqli-forbindelse
$conn = new mysqli($servername, $username, $password, $dbname);

// Sjekk tilkoblingen
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Hent oppgaver fra databasen
$sql = "SELECT * FROM tasks";
$result = $conn->query($sql);

if ($result) {
    $tasks = array();
    while ($row = $result->fetch_assoc()) {
        $tasks[] = array('taskId' => $row['id'], 'taskText' => $row['taskText']);
    }

    // Sett opp svar i tilfelle suksess
    $response = array('status' => 'success', 'tasks' => $tasks);
} else {
    // Sett opp svar i tilfelle feil
    $response = array('status' => 'error', 'message' => 'Error fetching tasks: ' . $conn->error);
}

// Utgang respons som JSON
header('Content-Type: application/json');
echo json_encode($response);

// Lukk databaseforbindelsen
$conn->close();
?>
