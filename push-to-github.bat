@echo off
echo ========================================
echo Enviando projeto para o GitHub...
echo ========================================
echo.

git status
echo.

echo Verificando se ha arquivos para commit...
git add .
echo.

echo Fazendo commit...
git commit -m "Initial commit - Discord Selfbot by Brunno47/Nine" 2>nul
if errorlevel 1 (
    echo Nenhuma alteracao para commitar ou commit ja existe.
) else (
    echo Commit realizado com sucesso!
)
echo.

echo Configurando branch main...
git branch -M main 2>nul
echo.

echo Verificando remote...
git remote remove origin 2>nul
git remote add origin https://github.com/brunno47/clear-dm.git
echo.

echo Tentando fazer push para o GitHub...
echo NOTA: Se pedir autenticacao, voce precisara:
echo   1. Usar um Personal Access Token (PAT) do GitHub
echo   2. Ou configurar SSH keys
echo.
git push -u origin main

if errorlevel 1 (
    echo.
    echo ========================================
    echo ERRO: Falha ao fazer push!
    echo ========================================
    echo.
    echo Possiveis causas:
    echo - Falta de autenticacao (token ou senha)
    echo - Repositorio remoto nao existe ou nao tem permissao
    echo.
    echo Solucao:
    echo 1. Vá em GitHub.com ^> Settings ^> Developer settings ^> Personal access tokens
    echo 2. Crie um novo token com permissao 'repo'
    echo 3. Use o token como senha quando o Git pedir
    echo.
    echo Ou use: git push -u origin main
    echo E quando pedir senha, use seu Personal Access Token
    echo.
) else (
    echo.
    echo ========================================
    echo SUCESSO! Projeto enviado para o GitHub!
    echo ========================================
    echo.
    echo Repositorio: https://github.com/brunno47/clear-dm
    echo.
)

pause
