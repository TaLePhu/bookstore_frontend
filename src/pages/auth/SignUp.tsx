import React, { useState } from "react";

interface FormData {
  username: string;
  lastName: string;
  firstName: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  email: string;
}

interface Errors {
  username?: string;
  lastName?: string;
  firstName?: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
  email?: string;
}

function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    lastName: "",
    firstName: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    email: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!formData.username)
      newErrors.username = "Tên đăng nhập không được để trống";
    if (!formData.lastName) newErrors.lastName = "Họ không được để trống";
    if (!formData.firstName) newErrors.firstName = "Tên không được để trống";
    if (!formData.password) newErrors.password = "Mật khẩu không được để trống";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Số điện thoại không được để trống";
    if (!formData.email) newErrors.email = "Email không được để trống";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Đăng ký thành công!");
      // Handle the form submission logic here (e.g., send data to server)
    }
  };

  return (
    <div style={styles.container}>
      <h2 className="text-center">ĐĂNG KÝ</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.gridContainer}>
          <div style={styles.gridItem}>
            <input
              placeholder="Tên đăng nhập*"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.username && (
              <div style={styles.error}>{errors.username}</div>
            )}

            <input
              type="password"
              name="password"
              placeholder="Mật khẩu*"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.password && (
              <div style={styles.error}>{errors.password}</div>
            )}

            <input
              placeholder="Xác nhận mật khẩu*"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.confirmPassword && (
              <div style={styles.error}>{errors.confirmPassword}</div>
            )}
          </div>
          <div style={styles.gridItem}>
            <input
              type="text"
              name="lastName"
              placeholder="Họ đệm*"
              value={formData.lastName}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.lastName && (
              <div style={styles.error}>{errors.lastName}</div>
            )}

            <input
              type="text"
              name="firstName"
              placeholder="Tên*"
              value={formData.firstName}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.firstName && (
              <div style={styles.error}>{errors.firstName}</div>
            )}

            <input
              type="text"
              name="phoneNumber"
              placeholder="Số điện thoại*"
              value={formData.phoneNumber}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.phoneNumber && (
              <div style={styles.error}>{errors.phoneNumber}</div>
            )}
          </div>
        </div>

        <input
          placeholder="Email*"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.email && <div style={styles.error}>{errors.email}</div>}

        <div>
          <span>Bạn có tài khoản? </span>
          <a href="/auth/dang-nhap" style={styles.link}>
            Đăng nhập
          </a>
        </div>
        <button type="submit" style={styles.button}>
          ĐĂNG KÝ
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "right" as const,
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  gridItem: {
    display: "flex",
    flexDirection: "column" as const,
  },
  input: {
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  button: {
    padding: "10px 0",
    backgroundColor: "#fff",
    color: "#007BFF",
    border: "1px solid #007BFF",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
  },
  link: {
    color: "#007BFF",
    textDecoration: "none",
  },
  error: {
    color: "red",
    fontSize: "12px",
  },
};

export default SignUp;
