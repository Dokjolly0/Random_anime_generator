import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { logService } from "../api/log/log.service";

dotenv.config();

class EmailService {
  private transporter;
  private from: string;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtps.aruba.it", // Host SMTP di Aruba
      port: 465, // Porta per SSL
      secure: true, // True per SSL, False per TLS (se usi la porta 587)
      auth: {
        user: "info@alexviolatto.it", // Il tuo indirizzo email di autenticazione su Aruba
        pass: "Qazswx03!", // La password del tuo account email
      },
    });
    this.from = "info@alexviolatto.it"; // Imposta il mittente fisso (es. noreply@tuodominio.com)
  }

  async sendEmail(to: string, subject: string, htmlContent: string) {
    const mailOptions = {
      from: this.from, // Mittente fisso
      to: to, // Destinatario passato come parametro
      subject: subject, // Oggetto passato come parametro
      html: htmlContent, // Contenuto HTML passato come parametro
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logService.createSimpleLog("Email send", `Email inviata a ${to}`);
    } catch (error) {
      logService.createSimpleLog(
        "Email send error",
        `Errore durante l'invio dell'email a ${to}`,
        error
      );
      throw new Error("Errore durante l'invio dell'email");
    }
  }

  async sendConfirmationEmail(
    username: string,
    userId: string,
    confirmationCode: string
  ) {
    const confirmationLink = `${process.env.BASE_URL}/api/auth/confirm-email?userId=${userId}&code=${confirmationCode}`;

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
            <h2 style="color: #333;">Conferma il tuo indirizzo email</h2>
            <p>Ciao, Grazie per esserti registrato con noi! Per completare la tua registrazione, per favore conferma il tuo indirizzo email cliccando sul pulsante qui sotto:</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${confirmationLink}" style="background-color: #f48c06; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Conferma la tua email</a>
            </div>
            <p>Se non riesci a cliccare il pulsante, clicca il seguente link:</p>
            <p><a href="${confirmationLink}">${confirmationLink}</a></p>
            <p style="color: #777;">Se non hai richiesto questa registrazione, puoi ignorare questa email.</p>
            <p>Grazie,<br>Il team di MyBanking</p>
        </div>
    `;

    const mailOptions = {
      from: this.from,
      to: username,
      subject: "Conferma la tua email",
      html: htmlContent,
    };
    console.log(username, userId, confirmationCode);
    await this.transporter.sendMail(mailOptions);
  }
}

export const emailService = new EmailService();
