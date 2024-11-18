from twilio.rest import Client
from django.conf import settings

def send_sms(to_phone_number, message):
    # Twilio client setup
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

    # Sending the SMS
    message = client.messages.create(
        body=message,
        from_=settings.TWILIO_PHONE_NUMB,  # Your Twilio number
        to=to_phone_number  # Recipient's phone number
    )

    return message.sid
