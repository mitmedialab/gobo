from builtins import zip
from flask_mail import Message


def send_email(mail, recipients, subject, message):
    msg = Message(subject, recipients=recipients)
    msg.body = message
    mail.send(msg)


def are_int_arrays_same(a, b):
    same = False
    if a is None and b is None:
        same = True

    if a is not None and b is not None:
        if len(a) == len(b):
            a.sort()
            b.sort()
            same = True
            for elA, elB in zip(a, b):
                if elA != elB:
                    same = False
    return same
