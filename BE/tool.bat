@echo off
:: Kích hoạt mã hóa UTF-8 để hiển thị tiếng Việt 
chcp 65001 >nul
title [Dev] Dashboard - Website Tuyển Dụng

:MENU
cls
echo ================================================================
echo       HỆ THỐNG MICROSERVICES - WEBSITE TUYỂN DỤNG TÌM VIỆC
echo ================================================================
echo.
echo [1] Khởi chạy toàn bộ Backend (Identity, Core, Gateway)
echo [2] Khởi động lại (Tắt hết cửa sổ cũ và chạy lại)
echo [3] Đóng sạch cửa sổ và dừng Services (Kill All)
echo [4] Thoát
echo.
echo ----------------------------------------------------------------
:: Sử dụng CHOICE để bắt phím 1,2,3,4 ngay lập tức mà không lag
choice /c 1234 /n /m "Bấm phím số (1, 2, 3 hoặc 4) để chọn: "
set "userchoice=%errorlevel%"

if "%userchoice%"=="1" goto START_ALL
if "%userchoice%"=="2" goto RESTART_ALL
if "%userchoice%"=="3" goto KILL_ALL
if "%userchoice%"=="4" exit
goto MENU

:START_ALL
cls
echo [*] Đang khởi chạy các dịch vụ mới...
echo ----------------------------------------------------------------

:: Khởi chạy IdentityService với nhãn cố định [cite: 2, 3]
if exist "IdentityService" (
    start "DEV_IDENTITY" cmd /c "color 0B & title DEV_IDENTITY & cd IdentityService && echo [*] Đang chạy IdentityService... && dotnet run"
    echo   -^> Đã mở Identity Service.
)

:: Khởi chạy TuyenDung_TimViec 
if exist "TuyenDung_TimViec" (
    start "DEV_MAIN" cmd /c "color 0E & title DEV_MAIN & cd TuyenDung_TimViec && echo [*] Đang chạy TuyenDung_TimViec... && dotnet run"
    echo   -^> Đã mở Main Service.
)

:: Khởi chạy ApiGateway 
if exist "ApiGateway" (
    start "DEV_GATEWAY" cmd /c "color 0D & title DEV_GATEWAY & cd ApiGateway && echo [*] Đang chạy ApiGateway... && dotnet run"
    echo   -^> Đã mở API Gateway.
)

echo.
echo [OK] Tất cả dịch vụ đã được kích hoạt.
pause
goto MENU

:RESTART_ALL
cls
echo [*] Đang dọn dẹp để khởi động lại...
:: Đóng sạch cửa sổ cũ dựa trên Title và Image Name để giải phóng Port
taskkill /f /fi "WINDOWTITLE eq DEV_*" >nul 2>&1
taskkill /f /im dotnet.exe /t >nul 2>&1
timeout /t 2 /nobreak >nul
goto START_ALL

:KILL_ALL
cls
echo [*] Đang đóng toàn bộ cửa sổ và tiến trình...
:: Lệnh này sẽ buộc đóng các cửa sổ CMD có nhãn DEV_ 
taskkill /f /fi "WINDOWTITLE eq DEV_*" >nul 2>&1
:: Đảm bảo các tiến trình dotnet chạy ngầm cũng bị dừng 
taskkill /f /im dotnet.exe /t >nul 2>&1
echo ----------------------------------------------------------------
echo [Xong] Toàn bộ hệ thống đã được dừng sạch sẽ.
pause
goto MENU