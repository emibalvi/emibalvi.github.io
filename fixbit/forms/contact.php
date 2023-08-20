<?php
// Datos del servidor SMTP de Gmail
$smtpServer = 'smtp.gmail.com';
$smtpPort = 587; // El puerto puede variar según el servidor SMTP
$smtpUsername = 'emibalvi@gmail.com'; // Tu dirección de correo electrónico de Gmail
$smtpPassword = 'e46612517'; // Tu contraseña de Gmail

// Destinatario del correo
$to = 'emibalvi@gmail.com';
$subject = 'Asunto del correo';
$message = 'Este es el contenido del correo';

// Encabezados del correo
$headers = "From: $smtpUsername" . "\r\n" .
    "Reply-To: $smtpUsername" . "\r\n" .
    "X-Mailer: PHP/" . phpversion();

// Configurar el servidor SMTP
ini_set('smtp_server', $smtpServer);
ini_set('smtp_port', $smtpPort);
ini_set('smtp_username', $smtpUsername);
ini_set('smtp_password', $smtpPassword);

// Enviar el correo
if (mail($to, $subject, $message, $headers)) {
    echo 'El correo se ha enviado con éxito.';
} else {
    echo 'Error al enviar el correo.';
}
?>