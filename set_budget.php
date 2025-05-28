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

.budget-card {
    border: 3px solid #28a745; /* bootstrap green */
    background-color: #e9f7ef; /* light green background */
    color: #155724; /* dark green text */
    border-radius: 5px;
    margin: 10px 0;
    padding: 10px;
}

.budget-btn {
    background-color: #28a745;
    border: 1px solid #28a745;
    color: white;
}

.budget-btn:hover {
    background-color: #218838;
    border-color: #1e7e34;
    color: white;
}
<div class="container mt-4">
  <div class="row">
    <!-- Your expense cards like Today's Expense, Yesterday's Expense etc. -->
  </div>
</div>
<div class="container mt-4">
    <h4>Set Monthly Budget</h4>
    <form action="set_budget.php" method="POST" class="mb-3">
        <div class="form-group">
            <label for="budget_amount">Budget Amount (₹):</label>
            <input type="number" class="form-control" id="budget_amount" name="budget_amount" required>
        </div>
        <input type="hidden" name="month_year" value="<?php echo date('Y-m'); ?>">
        <button type="submit" class="btn budget-btn mt-2">Set Budget</button>
    </form>
</div>

<?php
$current_month = date('Y-m');
$budget_query = mysqli_query($con, "SELECT budget_amount FROM budgets WHERE user_id = '$userid' AND month_year = '$current_month'");
$current_budget = mysqli_fetch_assoc($budget_query);
$current_budget_amount = $current_budget ? $current_budget['budget_amount'] : 0;
?>

<div class="card text-center budget-card">
    <div class="card-body">
        <h5 class="card-title">Current Month Budget</h5>
        <p class="card-text">₹<?php echo $current_budget_amount; ?></p>
    </div>
</div>
