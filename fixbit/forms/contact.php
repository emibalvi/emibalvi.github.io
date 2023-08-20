<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = $_POST["name"];
  $email = $_POST["email"];
  $subject = $_POST["subject"];
  $message = $_POST["message"];

  $mail = new PHPMailer(true);

  try {
      // Configuración del servidor SMTP
      $mail->isSMTP();
      $mail->Host = 'smtp.hostinger.com'; // Cambia esto al servidor SMTP de Hostinger
      $mail->SMTPAuth = true;
      $mail->Username = 'send@fixbit.com.ar'; // Tu dirección de correo de send@fixbit.com.ar
      $mail->Password = 'MaiLsEnD3R+'; // Tu contraseña de send@fixbit.com.ar
      $mail->SMTPSecure = 'ssl'; // Cambia esto a 'tls' si es necesario
      $mail->Port = 465; // El puerto debe ser 465 para SSL

      // Remitente
      $mail->setFrom($email, $name);

      // Destinatario
      $mail->addAddress('correo-destino@dominio-destino.com');

      // Asunto y contenido del correo
      $mail->Subject = $subject;
      $mail->Body = $message;

      // Envía el correo
      $mail->send();
      echo "Tu mensaje fue enviado con éxito. ¡Gracias!";
  } catch (Exception $e) {
      echo "Error al enviar el correo: {$mail->ErrorInfo}";
  }
} else {
  echo "Error al enviar el formulario.";
}
?>