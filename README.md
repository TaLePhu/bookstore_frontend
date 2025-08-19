# 📚 Bookstore Frontend - Web Bán Sách Trực Tuyến

> Ứng dụng web frontend hiện đại cho hệ thống bán sách trực tuyến - Đồ án Kiến Trúc và Thiết Kế Phần Mềm

## 🌟 Tổng Quan

Hệ thống nhà sách trực tuyến được phát triển nhằm đáp ứng nhu cầu tìm kiếm, chọn mua sách một cách nhanh chóng, tiện lợi, không giới hạn về thời gian và địa điểm. Dự án cung cấp một nền tảng cho người dùng có thể duyệt, tìm kiếm và mua sách một cách dễ dàng, đồng thời hỗ trợ quản lý kho sách, đơn hàng và người dùng cho quản trị viên.

## 🎯 Mục Tiêu Dự Án

- **Giao diện thân thiện**: Xây dựng website bán sách với UI/UX dễ sử dụng
- **Chức năng đầy đủ**: Hỗ trợ đăng ký, đăng nhập, tìm kiếm, giỏ hàng và thanh toán
- **Quản lý toàn diện**: Cho phép admin quản lý sách, thể loại, người dùng và đơn hàng
- **Hiệu suất cao**: Đảm bảo tính bảo mật, hiệu suất và khả năng mở rộng

## 👥 Đội Ngũ Phát Triển

**Nhóm 12 - Trường Đại học Công nghiệp TP.HCM**

- **Tạ Lê Phú** (20081011) - Nhóm trưởng | Backend Developer
- **Nguyễn Cao Trí** (21041951) - Frontend Developer  
- **Trần Thị Quỳnh Như** (21058591) - UI/UX Designer
- **Nguyễn Văn Thạch** (21082071) - Frontend Developer

## 🚀 Tính Năng Chính

### 👤 Người Dùng Chưa Đăng Nhập (Guest)
- 📖 Xem danh sách sách và thông tin chi tiết
- 🔍 Tìm kiếm sách theo tên, tác giả, thể loại
- 🛒 Thêm sách vào giỏ hàng tạm thời
- 📝 Đăng ký tài khoản mới

### 🛍️ Khách Hàng (Customer)
- 🔐 Đăng nhập/đăng xuất hệ thống
- 🛒 Quản lý giỏ hàng (thêm, xóa, chỉnh sửa số lượng)
- 💳 Xử lý thanh toán và đặt hàng
- 👤 Cập nhật thông tin tài khoản cá nhân
- 📋 Xem lịch sử đơn hàng
- 🔑 Đổi mật khẩu và khôi phục mật khẩu

### ⚙️ Quản Trị Viên (Admin)
- 📚 Quản lý sản phẩm (thêm, sửa, xóa, cập nhật tồn kho)
- 🏷️ Quản lý thể loại sách
- 👥 Quản lý tài khoản người dùng
- 📦 Quản lý đơn hàng và cập nhật trạng thái

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **Framework**: React.js với Create React App
- **Routing**: React Router
- **State Management**: React Hooks & Context API
- **HTTP Client**: Axios
- **Styling**: CSS3 / Styled Components
- **Build Tool**: Webpack (via CRA)

### Backend Integration
- **Architecture**: Layered Architecture Pattern
- **API**: RESTful API
- **Database**: MySQL
- **Authentication**: JWT Token

## 🏗️ Kiến Trúc Hệ Thống

Dự án áp dụng **Layered Architecture** với các lớp:

```
┌─────────────────────────┐
│    Presentation Layer   │  ← React Frontend
├─────────────────────────┤
│     Controller Layer    │  ← API Endpoints
├─────────────────────────┤
│      Service Layer      │  ← Business Logic
├─────────────────────────┤
│    Repository Layer     │  ← Data Access
├─────────────────────────┤
│     Database Layer      │  ← MySQL
└─────────────────────────┘
```

## 📋 Yêu Cầu Hệ Thống

- Node.js (version 14.0.0 hoặc cao hơn)
- npm hoặc yarn
- Git
- Modern browser (Chrome, Firefox, Safari, Edge)

## 🚀 Hướng Dẫn Cài Đặt

### 1. Clone Repository

```bash
git clone https://github.com/TaLePhu/bookstore_frontend.git
cd bookstore_frontend
```

### 2. Chuyển sang nhánh phát triển

```bash
git checkout develope
```

### 3. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

### 4. Cấu hình environment

```bash
# Tạo file .env và cấu hình API endpoints
cp .env.example .env
```

### 5. Chạy ứng dụng

```bash
npm start
# hoặc
yarn start
```

Ứng dụng sẽ chạy tại [http://localhost:3000](http://localhost:3000)

## 🧪 Chạy Tests

```bash
npm test
# hoặc
yarn test
```

## 🏭 Build Production

```bash
npm run build
# hoặc
yarn build
```

## 📁 Cấu Trúc Dự Án

```
bookstore_frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/        # Reusable components
│   │   ├── common/       # Common UI components
│   │   ├── auth/         # Authentication components
│   │   ├── product/      # Product-related components
│   │   └── cart/         # Shopping cart components
│   ├── pages/            # Page components
│   │   ├── Home/         # Trang chủ
│   │   ├── ProductList/  # Danh sách sản phẩm
│   │   ├── ProductDetail/# Chi tiết sản phẩm
│   │   ├── Cart/         # Giỏ hàng
│   │   ├── Checkout/     # Thanh toán
│   │   ├── Auth/         # Đăng nhập/Đăng ký
│   │   └── Admin/        # Quản trị
│   ├── services/         # API service calls
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── contexts/         # React contexts
│   ├── styles/           # CSS styles
│   └── App.js            # Main App component
├── package.json
└── README.md
```

## 🔗 API Endpoints

### Guest APIs
- `GET /api/books` - Lấy danh sách sách
- `GET /api/books/:id` - Lấy chi tiết sách
- `POST /api/auth/register` - Đăng ký tài khoản

### Customer APIs
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart` - Thêm vào giỏ hàng
- `PUT /api/cart/:id` - Cập nhật giỏ hàng
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders` - Lịch sử đơn hàng
- `PUT /api/profile` - Cập nhật thông tin cá nhân

### Admin APIs
- `GET /api/admin/books` - Quản lý sách
- `POST /api/admin/books` - Thêm sách mới
- `PUT /api/admin/books/:id` - Cập nhật sách
- `DELETE /api/admin/books/:id` - Xóa sách
- `GET /api/admin/users` - Quản lý người dùng
- `GET /api/admin/orders` - Quản lý đơn hàng

## 🎨 Thiết Kế UML

Dự án được thiết kế với các sơ đồ UML đầy đủ:
- **Use Case Diagram**: Mô tả tương tác của 3 actors (Guest, Customer, Admin)
- **Class Diagram**: Định nghĩa cấu trúc các lớp đối tượng
- **ERD Diagram**: Thiết kế cơ sở dữ liệu MySQL

## 🌐 Liên Kết Repository

- **Frontend**: [bookstore_frontend](https://github.com/TaLePhu/bookstore_frontend)
- **Backend**: [team12_project_software_architecture](https://github.com/TaLePhu/team12_project_software_architecture)

## 🚀 Deployment

Ứng dụng có thể được deploy trên:
- **Netlify**: Tự động deploy từ GitHub
- **Vercel**: Zero-config deployment
- **Firebase Hosting**: Google hosting platform
- **GitHub Pages**: Static hosting

## 🔧 Scripts Có Sẵn

```bash
npm start          # Chạy development server
npm test           # Chạy test suite
npm run build      # Build production
npm run eject      # Eject CRA configuration
```

## 📱 Hỗ Trợ Trình Duyệt

- Chrome (latest)
- Firefox (latest) 
- Safari (latest)
- Edge (latest)

## 🤝 Đóng Góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/TenTinhNang`)
3. Commit thay đổi (`git commit -m 'Thêm tính năng mới'`)
4. Push to branch (`git push origin feature/TenTinhNang`)
5. Tạo Pull Request

## 📚 Tài Liệu Tham Khảo

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- [Layered Architecture Pattern](https://docs.microsoft.com/en-us/previous-versions/msp-n-p/ff649690(v=pandp.10))

## 🎓 Thông Tin Học Thuật

**Đề tài**: Xây dựng ứng dụng web bán sách  
**Môn học**: Kiến Trúc và Thiết Kế Phần Mềm  
**Trường**: Đại học Công nghiệp TP.HCM  
**Khóa**: 2020-2024  

## 🏆 Điểm Nổi Bật Kỹ Thuật

- ✅ **Kiến trúc phân lớp**: Áp dụng Layered Architecture pattern
- ✅ **Separation of Concerns**: Tách biệt rõ ràng các layer
- ✅ **Responsive Design**: Tương thích đa thiết bị
- ✅ **State Management**: Quản lý state hiệu quả với React Hooks
- ✅ **API Integration**: Tích hợp mượt mà với backend RESTful API
- ✅ **Component Architecture**: Thiết kế component tái sử dụng
- ✅ **Modern JavaScript**: Sử dụng ES6+ features
- ✅ **Code Quality**: Tuân thủ coding standards và best practices

## 🔍 Dành Cho Nhà Tuyển Dụng

### Kỹ Năng Được Thể Hiện:

**Frontend Development:**
- Thành thạo React.js và ecosystem
- Thiết kế responsive UI/UX
- Quản lý state phức tạp
- Tích hợp API và xử lý async operations

**Software Architecture:**
- Hiểu biết về Layered Architecture
- Áp dụng design patterns trong thực tế
- Thiết kế hệ thống scalable và maintainable

**Team Collaboration:**
- Làm việc nhóm hiệu quả (4 thành viên)
- Phân chia công việc rõ ràng theo WBS
- Sử dụng Git workflow chuyên nghiệp

**Problem Solving:**
- Phân tích yêu cầu bằng UML
- Thiết kế database với ERD
- Xử lý nghiệp vụ phức tạp (e-commerce workflow)

### Phạm Vi Chức Năng:
- **3 loại người dùng**: Guest, Customer, Admin
- **15+ API endpoints** tích hợp
- **Workflow hoàn chỉnh**: Từ browsing đến checkout
- **Admin panel**: Quản lý toàn diện hệ thống

## 📧 Liên Hệ

**Tạ Lê Phú** - Nhóm trưởng & Backend Lead  
- GitHub: [@TaLePhu](https://github.com/TaLePhu)
- Repository: [Backend](https://github.com/TaLePhu/team12_project_software_architecture) | [Frontend](https://github.com/TaLePhu/bookstore_frontend)

## 📄 License

Dự án được phát triển cho mục đích học tập tại Trường Đại học Công nghiệp TP.HCM.

---

*Dự án thể hiện khả năng phát triển ứng dụng web full-stack với kiến trúc chuyên nghiệp và workflow hoàn chỉnh.*
