# ĐỒ ÁN 3: XÂY DỰNG WEBSITE TUYỂN DỤNG VÀ TÌM VIỆC LÀM

## 📝 Mô tả nghiệp vụ hệ thống (Business Logic)

Hệ thống được thiết kế như một sàn giao dịch việc làm trực tuyến, kết nối nhu cầu tìm kiếm nhân sự của doanh nghiệp và nhu cầu tìm kiếm cơ hội nghề nghiệp của người lao động.

---

## 🎯 Mục tiêu hệ thống (System Objectives)

- Xây dựng nền tảng kết nối giữa nhà tuyển dụng và người tìm việc.
- Hỗ trợ ứng viên tìm kiếm việc làm nhanh chóng và hiệu quả.
- Giúp doanh nghiệp dễ dàng đăng tin tuyển dụng và quản lý ứng viên.
- Cung cấp hệ thống quản trị để kiểm duyệt và quản lý dữ liệu.

---

## 👥 Vai trò người dùng (User Roles)

Hệ thống bao gồm 3 vai trò chính:

### 1. Ứng viên (Candidate)
- Tìm kiếm việc làm
- Ứng tuyển công việc
- Quản lý hồ sơ cá nhân

### 2. Nhà tuyển dụng (Recruiter)
- Đăng tin tuyển dụng
- Quản lý danh sách ứng viên
- Quản lý thông tin công ty

### 3. Quản trị viên (Admin)
- Kiểm duyệt nội dung
- Quản lý danh mục hệ thống
- Theo dõi thống kê hoạt động

---

# 1. Phân hệ dành cho Ứng viên (Candidate)

### Quản lý hồ sơ
Tạo và cập nhật thông tin cá nhân, kỹ năng, kinh nghiệm làm việc và tải lên CV (PDF/Word).

### Tìm kiếm việc làm
Tìm kiếm thông minh theo:
- Từ khóa
- Ngành nghề
- Địa điểm
- Mức lương mong muốn

### Ứng tuyển
Gửi hồ sơ trực tuyến cho các vị trí đang tuyển dụng và theo dõi trạng thái ứng tuyển:
- Đang chờ
- Đã xem
- Đạt / Không đạt

### Lưu việc làm
Đánh dấu các công việc yêu thích để xem lại sau.

---

# 2. Phân hệ dành cho Nhà tuyển dụng (Recruiter)

### Quản lý tin tuyển dụng
Đăng tin tuyển mới, chỉnh sửa thông tin hoặc đóng các vị trí đã tuyển đủ.

### Quản lý hồ sơ ứng tuyển
Xem danh sách ứng viên, duyệt CV và thay đổi trạng thái hồ sơ của ứng viên.

### Quản lý thông tin công ty
Cập nhật giới thiệu doanh nghiệp, quy mô và chế độ phúc lợi để thu hút nhân tài.

---

# 3. Phân hệ dành cho Quản trị viên (Admin)

### Kiểm duyệt nội dung
Phê duyệt hoặc từ chối các tin tuyển dụng/tài khoản doanh nghiệp mới để đảm bảo uy tín hệ thống.

### Quản lý danh mục
Quản lý danh sách:
- Ngành nghề
- Tỉnh thành
- Loại hình công việc
  - Full-time
  - Part-time
  - Remote

### Thống kê
Theo dõi:
- Số lượng người dùng mới
- Số tin tuyển dụng
- Lượt tương tác hằng tháng

---

## ⚙️ Quy trình nghiệp vụ chính (Workflow)

### Quy trình Đăng tin
Nhà tuyển dụng đăng nhập  
→ Nhập nội dung tuyển dụng  
→ Admin phê duyệt  
→ Tin hiển thị trên Website

### Quy trình Ứng tuyển
Ứng viên tìm kiếm công việc  
→ Nhấn "Ứng tuyển"  
→ Chọn CV từ hệ thống  
→ Nhà tuyển dụng nhận thông báo  
→ Phản hồi kết quả

---

## 🚀 Các chức năng chính của hệ thống (Main Features)

- Đăng ký / đăng nhập tài khoản
- Quản lý hồ sơ ứng viên
- Tìm kiếm và lọc việc làm
- Ứng tuyển trực tuyến
- Lưu việc làm yêu thích
- Đăng tin tuyển dụng
- Quản lý hồ sơ ứng viên
- Kiểm duyệt nội dung bởi Admin
- Thống kê hệ thống

---

## 🛠 Công nghệ sử dụng

### Frontend
ReactJS + TypeScript

### Backend
C#

### Database
SQL Server
