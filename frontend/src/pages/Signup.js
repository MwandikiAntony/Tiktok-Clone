import { useState } from "react";
import { api, setToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const submit = async () => {
    try {
      const res = await api.post("/auth/signup", {
        username,
        email,
        password: pass,
      });

      // Save token for future requests
      setToken(res.data.token);

      alert("Signup successful!");
      navigate("/");
    } catch (err) {
      alert("Signup failed: " + err.response?.data || err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Account</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <button onClick={submit}>Sign Up</button>
    </div>
  );
}
