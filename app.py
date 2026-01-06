import os
import smtplib
from email.message import EmailMessage
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- Konfiguration (Hent fra miljøvariabler eller brug standard til test) ---
# VIGTIGT: På Render.com skal du indstille disse i "Environment Variables"
EMAIL_ADDRESS = os.environ.get('EMAIL_USER') 
EMAIL_PASSWORD = os.environ.get('EMAIL_PASS')

# Hjælpefunktion til at sende emails (Gør koden pænere og genbrugelig)
def send_email_notification(subject, body):
    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        print("Fejl: Email-oplysninger mangler. Tjek dine miljøvariabler.")
        return False

    try:
        msg = EmailMessage()
        msg['Subject'] = subject
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = EMAIL_ADDRESS # Sender mailen til dig selv
        msg.set_content(body)

        # Forbind til Gmails server (Brug port 587 og STARTTLS)
        with smtplib.SMTP('smtp.gmail.com', 587, timeout=30) as smtp:
            smtp.starttls()
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)
        return True
    except Exception as e:
        print(f"Fejl ved afsendelse af email: {e}")
        return False

@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.json
    subject = f"Ny besked fra portefølje: {data.get('name')}"
    body = f"Navn: {data.get('name')}\nEmail: {data.get('email')}\n\nBesked:\n{data.get('message')}"
    
    # Send emailen (og print i terminalen som backup)
    print(f"--- {subject} ---\n{body}\n----------------")
    if send_email_notification(subject, body):
        return jsonify({"status": "success", "message": "Besked modtaget"}), 200
    else:
        return jsonify({"status": "error", "message": "Kunne ikke sende email"}), 500

@app.route('/book-meeting', methods=['POST'])
def book_meeting():
    data = request.json
    subject = "Ny Mødeforespørgsel"
    body = f"En bruger vil gerne booke et møde.\n\nEmail: {data.get('email')}\nDato: {data.get('date')}\nTid: {data.get('time')}"
    
    # Send emailen (og print i terminalen som backup)
    print(f"--- {subject} ---\n{body}\n----------------")
    if send_email_notification(subject, body):
        return jsonify({"status": "success", "message": "Booking modtaget"}), 200
    else:
        return jsonify({"status": "error", "message": "Kunne ikke sende email"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)