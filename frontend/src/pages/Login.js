import { useState } from "react";
import { api, setToken } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const submit = async () => {
    const res = await api.post("/auth/login", { email, password: pass });
    setToken(res.data.token);
    alert("Logged in");
  };

  return (
    <div>
      <input onChange={e => setEmail(e.target.value)} placeholder="Email"/>
      <input onChange={e => setPass(e.target.value)} placeholder="Password"/>
      <button onClick={submit}>Login</button>
    </div>
  );
}
