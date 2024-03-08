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

// Sjekk om skjemadata er sendt inn
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["taskText"])) {
        // Hent oppgavetekst fra skjemaet
        $taskText = $_POST["taskText"];

        // Sett inn oppgaven i databasen ved hjelp av forberedt uttalelse
        $sql = "INSERT INTO tasks (taskText) VALUES (?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $taskText);

        if ($stmt->execute()) {
            // Sett opp svar i tilfelle suksess
            $response = array('status' => 'success', 'message' => 'Task added successfully', 'taskText' => $taskText, 'taskId' => $stmt->insert_id);
        } else {
            // Sett opp svar i tilfelle feil
            $response = array('status' => 'error', 'message' => 'Error adding task: ' . $stmt->error);
        }

        $stmt->close();
    } elseif (isset($_POST["taskId"])) {
        // Slett oppgaven fra databasen ved hjelp av forberedt uttalelse
        $taskId = $_POST["taskId"];

        $sql = "DELETE FROM tasks WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $taskId);

        // Sett opp svar i tilfelle suksess eller feil
        if ($stmt->execute()) {
            $response = array('status' => 'success', 'message' => 'Task deleted successfully');
        } else {
            $response = array('status' => 'error', 'message' => 'Error deleting task: ' . $stmt->error);
        }

        $stmt->close();
    } else {
        // Sett opp svar for ugyldig forespørsel
        $response = array('status' => 'error', 'message' => 'Invalid request');
    }

    // Utgang respons som JSON
    header('Content-Type: application/json');
    echo json_encode($response);
}

// Lukk databaseforbindelsen
$conn->close();
?>
