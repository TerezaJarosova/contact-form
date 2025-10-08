<?php
/* Načtení souborů potřebných pro PHPMailer */
require 'PHPMailer.php';
require 'SMTP.php';
require 'Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/* Načtení a sanitizace dat z formuláře */
$name     = str_replace(["\r","\n"], " ", strip_tags(trim($_POST["name"] ?? "")));
$surname  = str_replace(["\r","\n"], " ", strip_tags(trim($_POST["surname"] ?? "")));
$email    = filter_var(trim($_POST["email"] ?? ""), FILTER_SANITIZE_EMAIL);
$message  = trim($_POST["message"] ?? "");

/* Kontrola povinných polí a formátu e-mailu */
if (empty($name) || empty($surname) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($message)) {
    echo "error";
    exit;
}

/* Vytvoření instance PHPMailer */
$mail = new PHPMailer(true);

try {
    /* Nastavení SMTP serveru */
    $mail->isSMTP();
    $mail->Host       = 'mail.spacemail.com';     
    $mail->SMTPAuth   = true;
    $mail->Username   = 'contact@theas.design';   
    $mail->Password   = '4h4J=c-%H9vN4&n';            
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; 
    $mail->Port       = 465;

    /* Kódování a znaky */
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';

    /* Hlavička a adresát */
    $mail->setFrom('contact@theas.design', "Thèa's Design – kontaktní formulář");
    $mail->addAddress('contact@theas.design');
    $mail->addReplyTo($email, "$name $surname");

    /* Obsah e-mailu */
    $mail->isHTML(false); 
    $mail->Subject = "Máte novou zprávu od: $email";
    $mail->Body    = "Jméno: $name\nPříjmení: $surname\nEmail: $email\n\nZpráva:\n$message";

    /* Odeslání e-mailu */
    $mail->send();

    echo "success";
} catch (Exception $e) {
    /* Chyba při odesílání */
    echo "error";
}
