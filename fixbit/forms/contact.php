<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $subject = $_POST["subject"];
    $message = $_POST["message"];

    // Aquí puedes realizar validaciones y enviar el correo electrónico, por ejemplo:
    $to = "emibalvi@gmail.com";
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";

    mail($to, $subject, $message, $headers);

    // Redirige a una página de éxito después de enviar el formulario
    header("Location: success.html");
    exit();
}
?>
