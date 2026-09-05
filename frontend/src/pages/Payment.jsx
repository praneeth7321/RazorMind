import { useState } from "react";
import axios from "axios";
import { createPayment } from "../api/payment";

export default function Payment() {
  const [amount, setAmount] = useState(100);

  const [customerHistory, setCustomerHistory] = useState(
    "First-time customer"
  );

  const [location, setLocation] = useState(
    "Same City"
  );

  const [device, setDevice] = useState(
    "Known Device"
  );

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

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

        customer_history: customerHistory,
        location: location,
        device: device,
      });

      const options = {
        key: "rzp_test_TXePfwRVAu33fp",

        amount: order.amount,

        currency: order.currency,

        name: "RazorMind",

        description: "Fraud Detection Demo",

        order_id: order.razorpay_order_id,

        handler: async function (response) {
          try {
            const verify = await axios.post(
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

            console.log(verify.data);

            alert(
              `Payment Successful!\nRisk Score: ${verify.data.risk_score}\nDecision: ${verify.data.ai_decision.decision}`
            );
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

      new window.Razorpay(options).open();
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
        gap: "15px",
        width: "350px",
      }}
    >
      <h1>RazorMind</h1>

      <label>Amount</label>

      <input
        type="number"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
      />

      <label>Customer History</label>

      <select
        value={customerHistory}
        onChange={(e) =>
          setCustomerHistory(e.target.value)
        }
      >
        <option>First-time customer</option>
        <option>Returning customer</option>
      </select>

      <label>Location</label>

      <select
        value={location}
        onChange={(e) =>
          setLocation(e.target.value)
        }
      >
        <option>Same City</option>
        <option>Different City</option>
      </select>

      <label>Device</label>

      <select
        value={device}
        onChange={(e) =>
          setDevice(e.target.value)
        }
      >
        <option>Known Device</option>
        <option>New Device</option>
      </select>

      <button onClick={handlePayment}>
        Pay with Razorpay
      </button>
    </div>
  );
}