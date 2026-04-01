@echo off
:: Set font và kích hoạt UTF-8 để hiển thị tiếng Việt
chcp 65001 >nul
title [Dev] Bootstrapper - Website Tuyen Dung Tim Viec
color 0A

echo ================================================================
echo       HỆ THỐNG MICROSERVICES - WEBSITE TUYỂN DỤNG TÌM VIỆC
echo ================================================================
echo.
echo Dang kiem tra va khoi dong cac dich vu (Services)...
echo ----------------------------------------------------------------

:: 1. Chạy Identity Service (Cốt lõi - cần chạy trước)
echo [1/3] Starting IdentityService...
if exist "IdentityService" (
    :: Mở cửa sổ mới màu Xanh lơ (0B), set title và chạy lệnh
    start "Identity Service" cmd /k "color 0B & title [Service] Identity & cd IdentityService && echo [*] Dang khoi dong IdentityService... && dotnet run"
    echo   -^> OK! Da mo cua so IdentityService.
) else (
    echo   -^> LỖI: Khong tim thay thu muc IdentityService!
)
echo.

:: 2. Chạy TuyenDung_TimViec (Service chính)
echo [2/3] Starting TuyenDung_TimViec Service...
if exist "TuyenDung_TimViec" (
    :: Mở cửa sổ mới màu Vàng (0E)
    start "TuyenDung_TimViec" cmd /k "color 0E & title [Service] TuyenDung_TimViec & cd TuyenDung_TimViec && echo [*] Dang khoi dong TuyenDung_TimViec... && dotnet run"
    echo   -^> OK! Da mo cua so TuyenDung_TimViec.
) else (
    echo   -^> LỖI: Khong tim thay thu muc TuyenDung_TimViec!
)
echo.

:: 3. Chạy ApiGateway (Chạy cuối để gom các service)
echo [3/3] Starting API Gateway...
if exist "ApiGateway" (
    :: Mở cửa sổ mới màu Tím (0D)
    start "API Gateway" cmd /k "color 0D & title [Gateway] ApiGateway & cd ApiGateway && echo [*] Dang khoi dong ApiGateway... && dotnet run"
    echo   -^> OK! Da mo cua so ApiGateway.
) else (
    echo   -^> LỖI: Khong tim thay thu muc ApiGateway!
)
echo.

echo ----------------------------------------------------------------
echo HOÀN TẤT! Cả 3 Services đang được chạy trên các cửa sổ riêng.
echo *Lưu ý: Dưới Taskbar của Windows, bạn rê chuột vào icon CMD 
echo         để thấy tên từng Service rất dễ quản lý.
echo ================================================================
pause