import { useEffect, useState } from "react";
import axios from "axios";

function VendorDashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/protected/vendor-dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setMessage(res.data.message);
      } catch (error) {
        if (error.response?.status === 401) {
          setMessage("Session expired. Please login again.");
          localStorage.clear();
        } else {
          setMessage("Something went wrong. Try again later.");
        }
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Vendor Dashboard</h1>
      <p>{message}</p>
    </div>
  );
}

export default VendorDashboard;
