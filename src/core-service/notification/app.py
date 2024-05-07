from flask import Flask, request, jsonify
import smtplib, os
from email.message import EmailMessage

app = Flask(__name__)

os.environ["GMAIL_ADDRESS"] = "gowreeshan1@gmail.com"
os.environ["GMAIL_PASSWORD"] = "nglk spuo vkmb oehz"

EMAIL_ADDRESS = os.environ.get("GMAIL_ADDRESS")
EMAIL_PASSWORD = os.environ.get("GMAIL_PASSWORD")

@app.route('/send_notification', methods=['POST'])
def send_notification():
    try:
        data = request.json
        receiver_address = data.get("rec_email")

        if not receiver_address:
            return jsonify({"error": "No recipient provided"}), 400

        msg = EmailMessage()
        msg.set_content("Your Question is ready")
        msg["Subject"] = "Generated Questions And Answers"
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = receiver_address

        with smtplib.SMTP("smtp.gmail.com", 587) as session:
            session.starttls()
            session.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            session.send_message(msg)
        
        return jsonify({"message": "Email sent successfully"}), 200

    except Exception as err:
        return jsonify({"error": str(err)}), 500

if __name__ == '__main__':
    app.run(debug=True)
