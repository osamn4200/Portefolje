import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- Konfiguration (Hent fra miljøvariabler eller brug standard til test) ---
# Vi bruger nu Brevo API i stedet for Gmail SMTP (fordi porte blokeres)
BREVO_API_KEY = os.environ.get('BREVO_API_KEY')
MY_EMAIL = os.environ.get('MY_EMAIL') # Din email (både afsender og modtager)

# Sikkerhedsnet: Fjern eventuelle usynlige mellemrum fra Render
if BREVO_API_KEY: BREVO_API_KEY = BREVO_API_KEY.strip()
if MY_EMAIL: MY_EMAIL = MY_EMAIL.strip()

# Hjælpefunktion til at sende emails (Gør koden pænere og genbrugelig)
def send_email_notification(subject, body):
    if not BREVO_API_KEY or not MY_EMAIL:
        print("Fejl: Mangler API nøgle eller email.")
        return False

    url = "https://api.brevo.com/v3/smtp/email"
    
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    }
    
    # Data til Brevo
    payload = {
        "sender": {"email": MY_EMAIL, "name": "Min Portefølje"},
        "to": [{"email": MY_EMAIL}],
        "subject": subject,
        "textContent": body
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 201: # 201 betyder "Created" (Succes)
            return True
        else:
            print(f"Fejl fra Brevo: {response.text}")
            return False
    except Exception as e:
        print(f"Systemfejl: {e}")
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