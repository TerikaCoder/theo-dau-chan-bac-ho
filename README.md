# Theo dấu chân Bác Hồ — V3

Website HTML/CSS/JS thuần.

## Chạy website

Không mở `index.html` trực tiếp bằng `file://` vì trang dùng `fetch()` để đọc JSON.

```bash
cd bhweb
python3 -m http.server 8080
```

Sau đó mở `http://127.0.0.1:8080`.

## Thay ảnh

- Ảnh trang chủ: `assets/images/home/bac-ho.jpg`
- Ảnh cuộc đời: sửa đường dẫn trong `data/life.json`
- Ảnh tư liệu: sửa/thêm item trong `data/media.json`
- Ảnh sự nghiệp: sửa đường dẫn trong `data/career.json`

Mỗi category trong `data/media.json` có thể có **nhiều ảnh**. Chỉ cần thêm object mới với `category`, `title`, `year`, `src`, `source`.

## Thêm video

Trong `data/media.json`, thêm item vào `videos` và điền YouTube ID vào trường `youtube`. Năm `year` nên là năm của tư liệu gốc, không phải năm video được đăng lại.

## Chỉnh bản đồ

Các điểm tiêu biểu nằm trong `js/main.js`, mảng `journeyPoints`.

Mỗi điểm có:

- `name`: tên địa điểm
- `year`: năm / giai đoạn
- `lat`, `lng`: tọa độ
- `text`: mô tả ngắn

Trang tự nối các điểm theo thứ tự bằng đường tuyến và thêm mũi tên giữa các chặng.

## Nguồn tham khảo lịch sử

- https://hochiminh.vn/cuoc-doi-su-nghiep/bien-nien-tieu-su-ho-chi-minh
- https://hochiminh.vn/tu-lieu-anh
- https://hochiminh.vn/tu-lieu-video

Các ảnh mẫu trong thư mục `assets/images/gallery/` là **file placeholder rỗng** để giữ sẵn tên đường dẫn. Hãy thay bằng ảnh tư liệu mà bạn có quyền sử dụng.

## V3 cập nhật

- Bản đồ hành trình nhiều khu vực, có route line và mũi tên.
- Trang chủ dùng ảnh nền phía sau tiêu đề/nút Khám phá.
- Nút Light/Dark nằm sát mép phải và co giãn theo màn hình.
- Gallery Masonry nhiều ảnh trong từng category.
- `main.js` và `style.css` đã được format nhiều dòng, dễ chỉnh sửa.
- Giữ hiệu ứng loading, page transition, scroll reveal và historical cards của V3.

## V4 — Credits & music

- Category Tư liệu nằm trên **một hàng ngang**, không tự xuống dòng; trên điện thoại có thể vuốt ngang để xem hết.
- Drawer được đặt trên Leaflet map nên khi bấm nút `☰`, menu luôn nằm phía trên bản đồ.
- Logo cạnh nút `☰`: `assets/images/icon/icon.svg`. Có thể thay bằng icon riêng và giữ nguyên tên file.
- Credits là trang riêng: `credits.html`.
- Danh sách thành viên: `data/credits.json`.
- Icon Credits: `assets/images/credits/credits.svg`.
- Music metadata: `assets/music/song.json`; mỗi bài có thể khai báo `file`, `name`, `author`, `requestBy`. File nhạc đặt trong `assets/music/` như `1.mp3`, `2.mp3`...
- Trình phát chọn bài ngẫu nhiên, có đĩa xoay, timestamp, tên bài, tác giả và người request.
