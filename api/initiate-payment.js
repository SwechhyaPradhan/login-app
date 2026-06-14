const axios = require("axios");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { amount, orderId, customerName, customerEmail } = req.body;

  try {
    const response = await axios.post(
      "https://khalti.com/api/v2/epayment/initiate/",
      {
        return_url: "https://login-app-omega.vercel.app/checkout/verify",
        website_url: "https://login-app-omega.vercel.app",
        amount: Math.round(amount * 100),
        purchase_order_id: orderId,
        purchase_order_name: `Order-${orderId}`,
        customer_info: {
          name: customerName,
          email: customerEmail,
        },
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ 
      error: "Payment initiation failed", 
      details: error.response?.data || error.message 
    });
}
};