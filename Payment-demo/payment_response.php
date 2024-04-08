<?php
// Retrieve the payment response data from POST parameters
$response = json_decode(file_get_contents('php://input'), true);

// Extract the relevant data from the response
$merchantReference = $response['merchant_reference'];
$reasonCode = $response['reason_code'];
$reasonMessage = $response['reason_message'];
$status = $response['status'];
$amount = $response['amount'];
$transactionId = $response['_id'];
$url = $response['url'];

// Process the payment response based on the status
if ($status === 'PENDING') {
    // Payment is pending
    // Redirect the customer to the Sofort payment page
    header("Location: $url");
    exit;
} elseif ($status === 'APPROVED') {
    // Payment is approved
    // Update your database or perform any necessary actions
    // ...
} elseif ($status === 'DECLINED') {
    // Payment is declined
    // Handle the declined payment scenario
    // ...
} else {
    // Handle other payment statuses
    // ...
}

// Send a response back to Sofort
$response = [
    'status' => 'success',
    'message' => 'Payment response processed successfully'
];

header('Content-Type: application/json');
echo json_encode($response);
exit;
?>
