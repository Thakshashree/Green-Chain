import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { email, company } = req.body;

  try {
    // Generate test SMTP service account from ethereal.email
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Greenchain AI" <noreply@greenchain-ecologix.com>', // sender address
      to: email, // list of receivers
      subject: "Welcome to Greenchain Ecologix X AI!", // Subject line
      text: `Hello ${company},\n\nYour 14-day free trial workspace has been provisioned.\nStart optimizing your supply chain today!`, // plain text body
      html: `<b>Hello ${company},</b><br><br>Your 14-day free trial workspace has been provisioned.<br>Start optimizing your supply chain today!`, // html body
    });

    // Preview URL is provided by Ethereal email so the user can literally see the sent email in browser!
    const previewUrl = nodemailer.getTestMessageUrl(info);
    
    res.status(200).json({ 
      success: true, 
      message: "Message sent successfully",
      previewUrl 
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend email server running on http://localhost:${PORT}`);
});
