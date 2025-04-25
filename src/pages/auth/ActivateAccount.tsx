import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ActivateAccount() {
    const { email } = useParams();
    const { activationCode } = useParams();
    const [isActivated, setIsActivated] = useState(false);
    const [notify, setNotify] = useState('');

    useEffect(() => {
        console.log('email: ', email);
        console.log('activation: ', activationCode);

        activateAccount();
    }, []);

    //`http://localhost:8080/tai-khoan/kich-hoat?email=${email}&maKichHoat=${maKichHoat}`;
    const activateAccount = async () => {
        try {
            const url = `http://localhost:8080/account/activate?email=${email}&activationCode=${activationCode}`;

            const res = await fetch(url, { method: 'GET' });

            if (res.ok) {
                setIsActivated(true);
            } else {
                setNotify(res.text + '');
            }
        } catch (error) {
            console.log('lỗi khi kích hoạt: ', error);
        }
    };

    return (
        <div className="text-center">
            <h1>Kích hoạt tài khoản:</h1>
            {isActivated ? (
                <p style={{ fontSize: 18, fontWeight: 'bold', color: ' green' }}>
                    tài khoản đã kích hoạt thành công, đăng nhập để tiếp tục dùng dịch vụ
                </p>
            ) : (
                <p>{notify}</p>
            )}
        </div>
    );
}

export default ActivateAccount;
