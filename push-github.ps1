Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Enviando projeto para o GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está no diretório correto
if (-not (Test-Path "index.js")) {
    Write-Host "ERRO: Execute este script na pasta do projeto!" -ForegroundColor Red
    exit 1
}

# Verificar status do Git
Write-Host "Status do repositório:" -ForegroundColor Yellow
git status
Write-Host ""

# Adicionar arquivos
Write-Host "Adicionando arquivos..." -ForegroundColor Yellow
git add .
Write-Host ""

# Fazer commit
Write-Host "Fazendo commit..." -ForegroundColor Yellow
$commitResult = git commit -m "Initial commit - Discord Selfbot by Brunno47/Nine" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Commit realizado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "Nenhuma alteração para commitar ou commit já existe." -ForegroundColor Yellow
}
Write-Host ""

# Configurar branch
Write-Host "Configurando branch main..." -ForegroundColor Yellow
git branch -M main 2>&1 | Out-Null
Write-Host ""

# Configurar remote
Write-Host "Configurando remote origin..." -ForegroundColor Yellow
git remote remove origin 2>&1 | Out-Null
git remote add origin https://github.com/brunno47/clear-dm.git
Write-Host "Remote configurado: https://github.com/brunno47/clear-dm.git" -ForegroundColor Green
Write-Host ""

# Tentar fazer push
Write-Host "Tentando fazer push para o GitHub..." -ForegroundColor Yellow
Write-Host "NOTA: Se pedir autenticação, você precisará usar um Personal Access Token" -ForegroundColor Cyan
Write-Host "      Crie um em: https://github.com/settings/tokens" -ForegroundColor Cyan
Write-Host ""

$pushResult = git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCESSO! Projeto enviado para o GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repositório: https://github.com/brunno47/clear-dm" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "ERRO ao fazer push!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Saída do erro:" -ForegroundColor Yellow
    Write-Host $pushResult -ForegroundColor Red
    Write-Host ""
    Write-Host "Possíveis causas:" -ForegroundColor Yellow
    Write-Host "- Falta de autenticação (precisa de Personal Access Token)" -ForegroundColor White
    Write-Host "- Repositório remoto não existe ou não tem permissão" -ForegroundColor White
    Write-Host ""
    Write-Host "Solução:" -ForegroundColor Yellow
    Write-Host "1. Vá em: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "2. Crie um novo token com permissão 'repo'" -ForegroundColor White
    Write-Host "3. Execute novamente: git push -u origin main" -ForegroundColor White
    Write-Host "4. Quando pedir senha, use o Personal Access Token" -ForegroundColor White
    Write-Host ""
}
