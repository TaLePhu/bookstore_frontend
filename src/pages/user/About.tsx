import React from 'react';
import '../../assets/styles/About.css'; // Import your CSS file here

const About = () => {
    return (
        <div className="about-container">
            <div className="about-card">
                <h2>Giới thiệu về nhà sách PTTN</h2>
                <div className="about-content">
                    <div className="about-info">
                        <p>
                            <strong>Tên website:</strong> PTTN
                        </p>
                        <p>
                            <strong>Địa chỉ:</strong> 12, nguyễn văn bảo, phường 4, quận gò vấp, tp.hcm
                        </p>
                        <p>
                            <strong>Số điện thoại:</strong> 0123456789
                        </p>
                        <p>
                            <strong>Email:</strong> talephu6308@gmail.com
                        </p>
                    </div>
                    <div className="about-logo">
                        <img src="/logoTeam.png" alt="nhà sách PTTN" />
                        <p>
                            <strong>NHÀ SÁCH</strong>
                            <br />
                            PTTN
                        </p>
                    </div>
                </div>
            </div>

            <div className="map-card">
                <h2>Google maps</h2>
                <div className="map-container">
                    <iframe
                        title="ZoiBook Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.8582379826526!2d106.68427047480563!3d10.822158889329419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174deb3ef536f31%3A0x8b7bb8b7c956157b!2sIndustrial%20University%20of%20Ho%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1745600818021!5m2!1sen!2s"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default About;
