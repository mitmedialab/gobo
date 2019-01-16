from flask_mail import Message


def send_email(mail, recipients, subject, message):
    msg = Message(subject, recipients=recipients)
    msg.body = message
    mail.send(msg)
