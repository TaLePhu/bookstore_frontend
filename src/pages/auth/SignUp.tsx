import { faL } from '@fortawesome/free-solid-svg-icons';
import React, { use, useState } from 'react';

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [notify, setNotify] = useState('');

    const [errorUserName, setErrorUserName] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('');
    const [errorPhoneNumber, setErrorPhoneNumber] = useState('');

    const handleSumit = async (e: React.FormEvent) => {
        setErrorUserName('');
        setErrorEmail('');
        setErrorPassword('');
        setErrorConfirmPassword('');

        e.preventDefault();

        //Kiem tra cac dieu kien
        const isUsernameValid = !(await kiemTraUserNameExist(username));
        const isPasswordValid = !(await kiemTraPassword(password));
        const isConfirmPasswordValid = !(await kiemTraConfirmPassword(confirmPassword));
        const isEmailValid = !(await kiemTraEmailExist(email));

        if (isUsernameValid && isPasswordValid && isConfirmPasswordValid && isEmailValid) {
            try {
                const url = `http://localhost:8080/account/sign-up`;

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password,
                        lastName: lastName,
                        firstName: firstName,
                        phoneNumber: phoneNumber,
                        isActivated: 0,
                        activationCode: '',
                    }),
                });
                if (response.ok) {
                    setNotify('Đăng ký thành công , vui lòng kiểm tra email để kích hoạt.');
                } else {
                    console.log(response.json());
                    setNotify('đã xảy ra lỗi trong quá trình đăng ký');
                }
            } catch (error) {
                setNotify('đã xảy ra lỗi trong quá trình đăng ký');
            }
        }
    };

    //----XỬ LÝ THAY ĐỔI USERNAME----
    // http://localhost:8080/users/search/existsByUsername?username=user6
    const kiemTraUserNameExist = async (username: string) => {
        const url = `http://localhost:8080/users/search/existsByUsername?username=${username}`;

        try {
            const response = await fetch(url);
            const data = await response.text();

            if (data === 'true') {
                setErrorUserName('username đã tồn tại!!!');
                return true;
            }

            return false;
        } catch (error) {
            console.log('lỗi khi kiểm tra tên đăng nhập!!!');
            return true;
        }
    };

    const handleUserNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        setErrorUserName('');

        kiemTraUserNameExist(e.target.value);
    };

    //--------XỬ LÝ THAY ĐỎI EMAIL-----------
    //http://localhost:8080/users/search/existsByUsername?email=user1@email.com
    const kiemTraEmailExist = async (email: string) => {
        const url = `http://localhost:8080/users/search/existsByEmail?email=${email}`;
        console.log(url);

        try {
            const response = await fetch(url);

            const data = await response.text();

            if (data === 'true') {
                setErrorEmail('email đã tồn tại!!!');
                return true;
            }
            return false;
        } catch (error) {
            console.log('lỗi trong quá trình kiểm tra email!!!');
            return true;
        }
    };

    const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);

        setErrorEmail('');

        kiemTraEmailExist(e.target.value);
    };

    //-------------XỬ LÝ PASSWORD CHANGE--------------
    const kiemTraPassword = (password: string) => {
        //Mật khẩu phải có ít nhất 8 ký tự và bao gồm ít nhất 1 ký tự đặc biệt (!@#$%^&*)
        const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        if (!passwordRegex.test(password)) {
            setErrorPassword('Mật khẩu phải có ít nhất 8 ký tự và bao gồm ít nhất 1 ký tự đặc biệt (!@#$%^&*)');
            return true;
        } else {
            setErrorPassword('');
            return false;
        }
    };

    const handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);

        setErrorPassword('');

        kiemTraPassword(e.target.value);
    };

    //------------XỬ LÝ CONFIRMPASSWORD CHANGE------------
    const kiemTraConfirmPassword = (confirmPassword: string) => {
        if (confirmPassword !== password) {
            setErrorConfirmPassword('mật khẩu xác nhân không khớp với mật khẩu!!!');
            return true;
        }
        return false;
    };

    const handleConfirmPasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);

        setErrorConfirmPassword('');

        kiemTraConfirmPassword(e.target.value);
    };

    //----------Xử lý phone number change --------------
    const kiemTraPhoneNumber = (phone: string) => {
        const phoneRegex = /^0\d{9}$/;

        if (!phoneRegex.test(phone)) {
            setErrorPhoneNumber('Số điện thoại không hợp lệ! Số điện thoại phải bắt đầu bằng số 0 và có 10 chữ số.');
            return true;
        }
        return false;
    };

    const handlePhoneNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);

        setErrorPhoneNumber('');

        kiemTraPhoneNumber(e.target.value);
    };

    return (
        <div style={styles.container}>
            <h2 className="text-center">ĐĂNG KÝ</h2>

            <form onSubmit={handleSumit} style={styles.form}>
                <div style={styles.gridContainer}>
                    <div style={styles.gridItem}>
                        <input
                            placeholder="Tên đăng nhập*"
                            type="text"
                            name="username"
                            id="username"
                            value={username}
                            onChange={handleUserNameChange}
                            style={styles.input}
                        />
                        <div style={styles.error}>{errorUserName}</div>

                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Mật khẩu*"
                            value={password}
                            onChange={handlePasswordChange}
                            style={styles.input}
                        />
                        <div style={styles.error}>{errorPassword}</div>

                        <input
                            placeholder="Xác nhận mật khẩu*"
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            style={styles.input}
                        />
                        <div style={styles.error}>{errorConfirmPassword}</div>
                    </div>

                    <div style={styles.gridItem}>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Họ đệm*"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            style={styles.input}
                        />
                        <div style={styles.error}></div>

                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="Tên*"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            style={styles.input}
                        />
                        <div style={styles.error}></div>

                        <input
                            type="text"
                            name="phoneNumber"
                            id="phoneNumber"
                            placeholder="Số điện thoại*"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            style={styles.input}
                        />
                        <div style={styles.error}>{errorPhoneNumber}</div>
                    </div>
                </div>

                <input
                    placeholder="Email*"
                    type="text"
                    name="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    style={styles.input}
                />
                <div style={styles.error}>{errorEmail}</div>

                <div>
                    <span>Bạn có tài khoản? </span>
                    <a href="/auth/dang-nhap" style={styles.link}>
                        Đăng nhập
                    </a>
                </div>
                <button type="submit" style={styles.button}>
                    ĐĂNG KÝ
                </button>
                <div className="text-center" style={{ color: 'green' }}>
                    {notify}
                </div>
            </form>
        </div>
    );
}

const styles = {
    container: {
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'right' as const,
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
    },
    gridItem: {
        display: 'flex',
        flexDirection: 'column' as const,
    },
    input: {
        padding: '8px',
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    button: {
        padding: '10px 0',
        backgroundColor: '#fff',
        color: '#007BFF',
        border: '1px solid #007BFF',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    link: {
        color: '#007BFF',
        textDecoration: 'none',
    },
    error: {
        color: 'red',
        fontSize: '12px',
    },
};

export default SignUp;
