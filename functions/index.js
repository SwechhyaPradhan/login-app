const {onCall} = require("firebase-functions/v2/https");
const {defineString} = require("firebase-functions/params");
const axios = require("axios");

const khaltiSecretKey = defineString("KHALTI_SECRET_KEY");

const KHALTI_BASE_URL = "https://khalti.com/api/v2";
const VERCEL_URL = "https://login-app-omega.vercel.app";

exports.initiateKhaltiPayment = onCall(
    {
      cors: [
        "https://login-app-omega.vercel.app",
        "https://login-g1vs6tkj9-swechhyas-projects-6445cd3f.vercel.app",
        "http://localhost:3000",
      ],
    },
    async (request) => {
      const {amount, orderId, customerName, customerEmail} = request.data;

      const payload = {
        return_url: `${VERCEL_URL}/checkout/verify`,
        website_url: VERCEL_URL,
        amount: Math.round(amount * 100),
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
              headers: {
                Authorization: `Key ${khaltiSecretKey.value()}`,
              },
            },
        );
        return response.data;
      } catch (error) {
        console.error(error.response?.data || error.message);
        throw new Error("Failed to initiate Khalti payment");
      }
    });

exports.verifyKhaltiPayment = onCall(
    {
      cors: [
        "https://login-app-omega.vercel.app",
        "http://localhost:3000",
      ],
    },
    async (request) => {
      const {pidx} = request.data;

      try {
        const response = await axios.post(
            `${KHALTI_BASE_URL}/epayment/lookup/`,
            {pidx},
            {
              headers: {
                Authorization: `Key ${khaltiSecretKey.value()}`,
              },
            },
        );
        return response.data;
      } catch (error) {
        console.error(error.response?.data || error.message);
        throw new Error("Failed to verify Khalti payment");
      }
    });
