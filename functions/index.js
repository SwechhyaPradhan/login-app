const {onCall} = require("firebase-functions/v2/https");
const axios = require("axios");

const KHALTI_BASE_URL = "https://dev.khalti.com/api/v2"; // sandbox/test

exports.initiateKhaltiPayment = onCall(async (request) => {
  const {amount, orderId, customerName, customerEmail} = request.data;

  const payload = {
    return_url: "http://localhost:3000/checkout/verify", // update later for production
    website_url: "http://localhost:3000",
    amount: Math.round(amount * 100), // NPR to paisa, must be an integer
    purchase_order_id: orderId,
    purchase_order_name: `Order-${orderId}`,
    customer_info: {
      name: customerName,
      email: customerEmail,
    },
  };

  try {
    const response = await axios.post(
        `${KHALTI_BASE_URL}/epayment/initiate/`,
        payload,
        {
          headers: {Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`},
        },
    );
    return response.data; // { pidx, payment_url }
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("Failed to initiate Khalti payment");
  }
});

exports.verifyKhaltiPayment = onCall(async (request) => {
  const {pidx} = request.data;

  try {
    const response = await axios.post(
        `${KHALTI_BASE_URL}/epayment/lookup/`,
        {pidx},
        {
          headers: {Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`},
        },
    );
    return response.data; // { status: "Completed" | "Pending" | ... }
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("Failed to verify Khalti payment");
  }
});