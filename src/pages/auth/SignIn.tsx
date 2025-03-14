import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/LoginForm.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle the form submission logic here
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <div
      className="login-container"
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "5px",
      }}>
      <h2>ĐĂNG NHẬP</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Tên đăng nhập*"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Mật khẩu*"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="footer-links">
          <p>
            Bạn chưa có tài khoản? <Link to="/auth/dang-ky">Đăng ký</Link>
          </p>
        </div>
        <button type="submit" className="login-btn">
          ĐĂNG NHẬP
        </button>
      </form>
      <div className="footer-links">
        <p>
          <a href="#">Quên mật khẩu</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
