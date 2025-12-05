const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const axios = require("axios");

// ---------------------------------------------
// 1. SEND EMAIL USING GMAIL APP PASSWORD
// ---------------------------------------------
async function sendSupportEmail(name, email, orderId, message) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SUPPORT_EMAIL,
      pass: process.env.SUPPORT_EMAIL_PASS,
    },
  });

  return transporter.sendMail({
    from: process.env.SUPPORT_EMAIL,
    to: process.env.SUPPORT_EMAIL,
    subject: `Support Request - Order ${orderId}`,
    text: `Customer Name: ${name}
Customer Email: ${email}
Order ID: ${orderId}
Message: ${message}`,
  });
}

// ------------------------------------------------
// 2. CREATE JIRA TICKET (NEXT-GEN PROJECTS)
// ------------------------------------------------
async function createJiraTicket(name, email, orderId, message) {
  const auth = Buffer.from(
    `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
  ).toString("base64");

  const payload = {
    fields: {
      project: { key: process.env.JIRA_PROJECT_KEY },
      summary: `Support Issue - Order ${orderId}`,
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: `Customer: ${name}` },
            ],
          },
          {
            type: "paragraph",
            content: [
              { type: "text", text: `Email: ${email}` },
            ],
          },
          {
            type: "paragraph",
            content: [
              { type: "text", text: `Order ID: ${orderId}` },
            ],
          },
          {
            type: "paragraph",
            content: [
              { type: "text", text: `Issue: ${message}` },
            ],
          },
        ],
      },
      issuetype: { id: "10017" } // Task type in NES project
    },
  };

  const res = await axios.post(
    `${process.env.JIRA_BASE_URL}/rest/api/3/issue`,
    payload,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.key; // Example: NES-5
}

// ------------------------------------------------
// 3. POST /api/support/create
// ------------------------------------------------
router.post("/create", async (req, res) => {
  try {
    const { name, email, orderId, message } = req.body;

    await sendSupportEmail(name, email, orderId, message);

    const ticketKey = await createJiraTicket(name, email, orderId, message);

    res.json({
      success: true,
      message: "Support ticket created successfully",
      ticket: ticketKey,
    });
  } catch (error) {
    console.error("Support error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;

