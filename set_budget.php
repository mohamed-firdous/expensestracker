<?php
session_start();
include('config.php');

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$message = '';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_SESSION['user_id'];
    $month = $_POST['month']; // format: YYYY-MM
    $amount = $_POST['amount'];

    // Check if record exists
    $check = mysqli_query($conn, "SELECT * FROM monthly_budget WHERE user_id='$user_id' AND month='$month'");
    if (mysqli_num_rows($check) > 0) {
        // Update budget
        $query = "UPDATE monthly_budget SET amount='$amount' WHERE user_id='$user_id' AND month='$month'";
    } else {
        // Insert new budget
        $query = "INSERT INTO monthly_budget (user_id, month, amount) VALUES ('$user_id', '$month', '$amount')";
    }

    if (mysqli_query($conn, $query)) {
        $message = "Budget saved successfully.";
    } else {
        $message = "Error: " . mysqli_error($conn);
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Set Monthly Budget</title>
</head>
<body>
    <h2>Set Monthly Budget</h2>
    <?php if ($message) echo "<p>$message</p>"; ?>
    <form method="POST">
        <label>Month (YYYY-MM):</label>
        <input type="month" name="month" required><br><br>
        <label>Budget Amount:</label>
        <input type="number" step="0.01" name="amount" required><br><br>
        <input type="submit" value="Save Budget">
    </form>
    <a href="index.php">Back to Dashboard</a>
</body>
</html>

