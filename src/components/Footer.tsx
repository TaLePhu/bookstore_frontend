import '../assets/styles/Footer.css'

const Footer = () => {
    return(
        <div className="footer">
            <div className='region-1'>
                {/* icon FB */}
                <a href='/'>
                    <div className='box-icon'>
                        <img className='icon-size' src="/icons/icons8-facebook-24.png" alt="icon-fb" />
                    </div>
                </a>
                {/* icon X */}
                <a href='/'>
                    <div className='box-icon'>
                        <img className='icon-size' src="/icons/icons8-x-32.png" alt="icon-X" />
                    </div>
                </a>
                {/* icon GG */}
                <a href='/'>
                    <div className='box-icon'>
                        <img className='icon-size' src="/icons/icons8-google-24.png" alt="icon-gg" />
                    </div>
                </a>
                {/* icon IG */}
                <a href='/'>
                    <div className='box-icon'>
                        <img className='icon-size' src="/icons/icons8-instagram-48.png" alt="icon-ig" />
                    </div>
                </a>
                {/* icon In */}
                <a href='/'>
                    <div className='box-icon'>
                        <img className='icon-size' src="/icons/icons8-inlink-48.png" alt="icon-in" />
                    </div>
                </a>
                {/* icon github */}
                <a href='/'>
                    <div className='box-icon'>
                        <img className='icon-size' src="/icons/icons8-github-30.png" alt="icon-github" />
                    </div>
                </a>
            </div>
            <div className='region-2'>
                <p>Đăng ký nhận bảng tin</p>
                <input className='input-email' placeholder='Nhập Email'/>
                <button className='btn-dk'>Đăng ký</button>
            </div>

            <div className='region-3'>
               
            </div>

            <p>&copy; 2025 Team12</p>

        </div>
    );
};

export default Footer;