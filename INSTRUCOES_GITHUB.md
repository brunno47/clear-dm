# Instruções para Enviar o Projeto para o GitHub

## Problema
O push para o GitHub pode falhar por falta de autenticação. Siga os passos abaixo:

## Solução 1: Usar Personal Access Token (Recomendado)

1. **Criar um Personal Access Token no GitHub:**
   - Acesse: https://github.com/settings/tokens
   - Clique em "Generate new token" > "Generate new token (classic)"
   - Dê um nome (ex: "clear-dm-push")
   - Marque a opção **"repo"** (acesso completo aos repositórios)
   - Clique em "Generate token"
   - **COPIE O TOKEN** (você só verá ele uma vez!)

2. **Fazer o push usando o token:**
   ```bash
   git push -u origin main
   ```
   - Quando pedir **Username**: digite `brunno47`
   - Quando pedir **Password**: cole o Personal Access Token (não use sua senha do GitHub!)

## Solução 2: Usar SSH (Alternativa)

1. **Gerar chave SSH (se ainda não tiver):**
   ```bash
   ssh-keygen -t ed25519 -C "seu-email@exemplo.com"
   ```

2. **Adicionar a chave ao GitHub:**
   - Copie o conteúdo de `~/.ssh/id_ed25519.pub`
   - Vá em: https://github.com/settings/keys
   - Clique em "New SSH key"
   - Cole a chave e salve

3. **Alterar o remote para SSH:**
   ```bash
   git remote set-url origin git@github.com:brunno47/clear-dm.git
   git push -u origin main
   ```

## Solução 3: Usar o Script Batch

Execute o arquivo `push-to-github.bat` que foi criado. Ele tentará fazer o push e mostrará mensagens de erro mais claras.

## Verificar se Funcionou

Após o push, acesse: https://github.com/brunno47/clear-dm

Você deve ver todos os arquivos do projeto lá.
