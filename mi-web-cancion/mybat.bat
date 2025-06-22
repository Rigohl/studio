@echo off
setlocal

REM Carpeta origen: donde tienes todo mezclado
set SOURCE=%cd%

REM Carpeta destino: tu proyecto nuevo
set DEST=%cd%\mi-web-cancion

REM Nombre de la carpeta que NO quieres copiar (el proyecto limpio)
set EXCLUDE=mi-web-cancion

echo Copiando archivos de %SOURCE% a %DEST%, excluyendo %EXCLUDE%...

for /d %%D in (%SOURCE%\*) do (
    if /i not "%%~nxD"=="%EXCLUDE%" (
        xcopy "%%D" "%DEST%\%%~nxD" /E /I /Y
    )
)

for %%F in (%SOURCE%\*) do (
    if /i not "%%~nxF"=="%~nx0" (
        copy "%%F" "%DEST%\%%~nxF" /Y
    )
)

echo Copiado completo.
pause
