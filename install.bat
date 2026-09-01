@echo off
REM =====================================================================
REM  AE 脚本管理器 - 一键安装 / 卸载脚本
REM  功能：把 ae-script-manager.jsx 及其下属的 ScriptFile 整个目录
REM        复制安装到 After Effects 的 ScriptUI Panels 目录
REM  用法：
REM        双击运行                 -> 交互选择要安装的 AE 版本
REM        install.bat /all         -> 安装到所有检测到的 AE 版本
REM        install.bat /uninstall   -> 卸载（脚本与 ScriptFile 可选保留）
REM        install.bat /ae "路径"    -> 手动指定 ScriptUI Panels 目录
REM        install.bat /help        -> 查看帮助
REM =====================================================================
setlocal EnableDelayedExpansion
chcp 65001 >nul 2>&1
title AE 脚本管理器 - 一键安装

REM ---------- 0. 初始化 ----------
set "SRC=%~dp0"
if "%SRC:~-1%"=="\" set "SRC=%SRC:~0,-1%"
set "JSX_NAME=ae-script-manager.jsx"
set "RES_DIR=ScriptFile"
set "MODE="
set "MANUAL_DIR="

if /i "%~1"=="/all"       set "MODE=ALL"
if /i "%~1"=="/uninstall" set "MODE=UNINSTALL"
if /i "%~1"=="/help"      goto :HELP
if /i "%~1"=="/ae"        set "MANUAL_DIR=%~2"

echo.
echo  ============================================================
echo    AE 脚本管理器 - 一键安装程序
echo  ============================================================
echo    源目录: %SRC%
echo.

REM ---------- 1. 校验源文件 ----------
if not exist "%SRC%\%JSX_NAME%" (
    echo  [错误] 未找到 %JSX_NAME%
    echo         请确认本 bat 与脚本管理器主文件放在同一目录。
    goto :END
)
if not exist "%SRC%\%RES_DIR%\" (
    echo  [警告] 未找到 %RES_DIR% 目录，将只安装主脚本文件。
    set "HAS_RES=0"
) else (
    set "HAS_RES=1"
)

REM ---------- 2. 权限检测（Program Files 需要管理员） ----------
net session >nul 2>&1
if errorlevel 1 (
    echo  [提示] 需要管理员权限才能写入 AE 安装目录，正在请求提权...
    powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -ArgumentList '%MODE%','%MANUAL_DIR%' -Verb RunAs"
    goto :EOF
)

REM ---------- 3. 探测 AE 的 ScriptUI Panels 目录 ----------
set "CNT=0"
set "SKIPALL=0"
if defined MANUAL_DIR goto :USE_MANUAL

echo  正在检测已安装的 After Effects 版本...
echo.

REM 3.1 从注册表枚举（Adobe After Effects 主版本键：17.0=2020 ... 25.0=2025）
for %%R in (
    "HKLM\SOFTWARE\Adobe\After Effects"
    "HKLM\SOFTWARE\WOW6432Node\Adobe\After Effects"
) do (
    for /f "delims=" %%K in ('reg query %%R 2^>nul') do (
        set "VKEY=%%K"
        if /i not "!VKEY!"==%%R (
            set "AEPATH="
            for /f "tokens=2,*" %%P in ('reg query "!VKEY!" /v InstallPath 2^>nul ^| find /i "InstallPath"') do (
                set "AEPATH=%%Q"
            )
            if defined AEPATH call :ADD_AE "!AEPATH!" "!VKEY!"
        )
    )
)

REM 3.2 注册表查不到时，扫描常见安装盘符（兼容绿色版 / 自定义盘）
if "%CNT%"=="0" (
    echo  注册表中未找到 AE 安装信息，尝试扫描常见安装路径...
    for %%D in (C D E F G) do (
        for %%V in (2020 2021 2022 2023 2024 2025) do (
            if exist "%%D:\Program Files\Adobe\Adobe After Effects %%V\Support Files\Scripts\ScriptUI Panels" (
                call :ADD_AE "%%D:\Program Files\Adobe\Adobe After Effects %%V\" "AE %%V (扫描)"
            )
            if exist "%%D:\Adobe\Adobe After Effects %%V\Support Files\Scripts\ScriptUI Panels" (
                call :ADD_AE "%%D:\Adobe\Adobe After Effects %%V\" "AE %%V (扫描)"
            )
        )
    )
)

goto :AFTER_DETECT

:USE_MANUAL
if not exist "%MANUAL_DIR%" (
    echo  [错误] 指定的目录不存在: %MANUAL_DIR%
    goto :END
)
set /a CNT+=1
set "AE%CNT%_DIR=%MANUAL_DIR%"
set "AE%CNT%_NAME=手动指定"

:AFTER_DETECT
if "%CNT%"=="0" (
    echo  [错误] 未能检测到任何 After Effects 安装目录。
    echo.
    echo  请手动指定 ScriptUI Panels 目录，例如：
    echo      install.bat /ae "D:\Software\Adobe\Adobe After Effects 2024\Support Files\Scripts\ScriptUI Panels"
    goto :END
)

REM ---------- 4. 选择目标 ----------
if /i "%MODE%"=="ALL" goto :DO_ALL
if not defined MANUAL_DIR if "%CNT%"=="1" goto :PICK1

echo  检测到以下位置：
echo  ------------------------------------------------------------
for /L %%i in (1,1,%CNT%) do echo    [%%i] !AE%%i_NAME!
echo                     !AE%%i_DIR!
echo  ------------------------------------------------------------
set "PICK="
set /p "PICK=请输入序号（直接回车=安装到全部，Q=取消）: "
if /i "%PICK%"=="Q" goto :END
if "%PICK%"=="" goto :DO_ALL
set /a "IDX=%PICK%" 2>nul
if not defined IDX goto :END
if %IDX% LSS 1 goto :END
if %IDX% GTR %CNT% goto :END
set "TARGET=!AE%IDX%_DIR!"
call :INSTALL_ONE "%TARGET%"
goto :DONE

:PICK1
set "TARGET=!AE1_DIR!"
echo  目标: !AE1_NAME!
echo        !AE1_DIR!
call :INSTALL_ONE "%TARGET%"
goto :DONE

:DO_ALL
for /L %%i in (1,1,%CNT%) do (
    echo.
    echo  ---- [%%i/%CNT%] !AE%%i_NAME! ----
    call :INSTALL_ONE "!AE%%i_DIR!"
)
goto :DONE

REM =====================================================================
REM  子程序：添加一个 AE 候选路径
REM =====================================================================
:ADD_AE
set "RAW=%~1"
set "LBL=%~2"
if not defined RAW goto :EOF
if "%RAW:~-1%"=="\" set "RAW=%RAW:~0,-1%"
set "PANELS=%RAW%\Support Files\Scripts\ScriptUI Panels"
if not exist "%PANELS%" (
    if not exist "%RAW%\Support Files" goto :EOF
    set "PANELS=%RAW%\Support Files\Scripts\ScriptUI Panels"
)
REM 去重
for /L %%j in (1,1,%CNT%) do if /i "!AE%%j_DIR!"=="%PANELS%" goto :EOF
set /a CNT+=1
set "AE%CNT%_DIR=%PANELS%"
set "AE%CNT%_NAME=%LBL%"
echo    [发现] %LBL%
echo           %PANELS%
goto :EOF

REM =====================================================================
REM  子程序：安装到单个目录（含自动备份）
REM =====================================================================
:INSTALL_ONE
set "DST=%~1"
if not exist "%DST%" (
    echo   正在创建目录: %DST%
    md "%DST%" 2>nul
    if errorlevel 1 ( echo   [错误] 无法创建目录，已跳过。 & goto :EOF )
)

REM 备份旧版本
if exist "%DST%\%JSX_NAME%" (
    set "BK=%DST%\_backup\%DATE:~0,4%%DATE:~5,2%%DATE:~8,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%"
    set "BK=!BK: =0!"
    md "!BK!" 2>nul
    copy /Y "%DST%\%JSX_NAME%" "!BK!\" >nul 2>&1
    echo   已备份旧版本到: _backup\
)

REM 复制主脚本
copy /Y "%SRC%\%JSX_NAME%" "%DST%\" >nul 2>&1
if errorlevel 1 ( echo   [错误] 主脚本复制失败，已跳过。 & goto :EOF )
echo   [OK] %JSX_NAME%

REM 复制脚本资源目录（镜像同步，保留目录结构；/XD 排除缓存与备份）
if "%HAS_RES%"=="1" (
    robocopy "%SRC%\%RES_DIR%" "%DST%\%RES_DIR%" /E /XO /R:2 /W:1 /NFL /NDL /NJH /NJS /NP /XD "_backup" "cache" >nul 2>&1
    if errorlevel 8 (
        echo   [警告] 脚本目录复制出现异常，错误码: %errorlevel%
    ) else (
        echo   [OK] %RES_DIR%\  ^(脚本 + 图标 + 子目录^)
    )
)
echo   [完成] %DST%
goto :EOF

REM =====================================================================
REM  卸载
REM =====================================================================
:UNINSTALL
echo  卸载模式：将删除各 AE 面板目录中的 %JSX_NAME%
echo.
set /p "CFM=确认卸载？(Y/N): "
if /i not "%CFM%"=="Y" goto :END
for /L %%i in (1,1,%CNT%) do (
    if exist "!AE%%i_DIR!\%JSX_NAME%" (
        del /F /Q "!AE%%i_DIR!\%JSX_NAME%" >nul 2>&1
        echo   [已删除] !AE%%i_DIR!\%JSX_NAME%
    )
    if exist "!AE%%i_DIR!\%RES_DIR%\" (
        echo.
        echo  发现脚本资源目录: !AE%%i_DIR!\%RES_DIR%
        set "DELRES="
        set /p "DELRES=是否一并删除你的脚本文件（不可恢复）？(Y/N): "
        if /i "!DELRES!"=="Y" (
            rd /S /Q "!AE%%i_DIR!\%RES_DIR%" 2>nul
            echo   [已删除] ScriptFile
        ) else (
            echo   [已保留] ScriptFile
        )
    )
)
goto :DONE

REM =====================================================================
:HELP
echo.
echo  AE 脚本管理器 - 安装脚本
echo.
echo  用法:
echo      install.bat              交互选择 AE 版本安装
echo      install.bat /all         安装到所有检测到的 AE 版本
echo      install.bat /uninstall   卸载
echo      install.bat /ae "目录"   手动指定 ScriptUI Panels 目录
echo      install.bat /help        显示本帮助
echo.
echo  说明:
echo      - 本脚本会把 ae-script-manager.jsx 与整个 ScriptFile 目录
echo        一起复制到 AE 的 ScriptUI Panels 文件夹；
echo      - 覆盖安装前会自动备份旧版到 ScriptUI Panels\_backup\ 下；
echo      - 复制使用 robocopy /XO，已存在且未修改的文件会跳过，重复安装很快；
echo      - 安装后重启 AE，在菜单栏 窗口(Window) 最底部即可找到面板。
echo.
goto :END

:DONE
echo.
echo  ============================================================
echo   操作完成！
echo   请重启 After Effects，然后在菜单栏
echo   「窗口(Window)」列表的最底部找到并打开脚本管理器面板。
echo   若面板未显示，请确认已勾选：
echo   首选项 - 常规 - "允许脚本写入文件和访问网络"
echo  ============================================================
echo.

:END
endlocal
pause
