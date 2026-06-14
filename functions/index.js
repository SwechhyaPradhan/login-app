const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    "https://login-app-omega.vercel.app",
    "https://login-g1vs6tkj9-swechhyas-projects-6445cd3f.vercel.app",
    "http://localhost:3000",
  ],
}));

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;
const KHALTI_BASE_URL = "https://khalti.com/api/v2";
const VERCEL_URL = "https://login-app-omega.vercel.app";

app.post("/initiate-payment", async (req, res) => {
  const {amount, orderId, customerName, customerEmail} = req.body;

  try {
    const response = await axios.post(
      `${KHALTI_BASE_URL}/epayment/initiate/`,
      {
        return_url: `${VERCEL_URL}/checkout/verify`,
        website_url: VERCEL_URL,
        amount: Math.round(amount * 100),
        purchase_order_id: orderId,
        purchase_order_name: `Order-${orderId}`,
        customer_info: {
          name: customerName,
          email: customerEmail,
        },
      },
      {
        headers: {Authorization: `Key ${KHALTI_SECRET_KEY}`},
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({error: "Payment initiation failed"});
  }
});

app.post("/verify-payment", async (req, res) => {
  const {pidx} = req.body;

  try {
    const response = await axios.post(
      `${KHALTI_BASE_URL}/epayment/lookup/`,
      {pidx},
      {
        headers: {Authorization: `Key ${KHALTI_SECRET_KEY}`},
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({error: "Payment verification failed"});
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));