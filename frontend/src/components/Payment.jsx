import { useState } from "react";
import axios from "axios";
import { createPayment } from "../api/payment";

export default function Payment() {
  const [amount, setAmount] = useState(100);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const loaded = await loadRazorpay();

    if (!loaded) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    try {
      const order = await createPayment({
        merchant_id: 1,
        customer_id: 1,
        amount: Number(amount),
      });

      console.log(order);

      const options = {
        key: "rzp_test_TXePfwRVAu33fp",

        amount: order.amount,

        currency: order.currency,

        name: "RazorMind",

        description: "Fraud Detection Demo",

        order_id: order.razorpay_order_id,

        handler: async function (response) {
          try {
            await axios.post(
              "http://127.0.0.1:8000/payments/verify",
              {
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,
              }
            );

            alert("Payment Successful");
          } catch (err) {
            console.error(err);
            alert("Verification Failed");
          }
        },

        prefill: {
          name: "Demo User",
          email: "demo@gmail.com",
          contact: "9999999999",
        },

        theme: {
          color: "#22c55e",
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert("Payment Failed");
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "300px",
      }}
    >
      <h1>RazorMind</h1>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handlePayment}>
        Pay with Razorpay
      </button>
    </div>
  );
}