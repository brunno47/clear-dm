# Discord Selfbot - Deletar Mensagens

Um selfbot para Discord que permite deletar mensagens via ID do canal.

**Desenvolvido por [Brunno47/Nine](https://github.com/brunno47)**

## ⚠️ Aviso Importante

**O uso de selfbots viola os Termos de Serviço do Discord.** Este projeto é apenas para fins educacionais. Use por sua própria conta e risco. O Discord pode banir sua conta se detectar o uso de selfbots.

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Token de autenticação do Discord (token de usuário, não bot token)

## 🚀 Instalação

1. Clone ou baixe este repositório
2. Instale as dependências:
```bash
npm install
```

3. Copie o arquivo `.env.example` para `.env`:
```bash
copy .env.example .env
```

4. Edite o arquivo `.env` e adicione seu token do Discord:
```
TOKEN=seu_token_aqui
```

## 🔑 Como obter o token do Discord

1. Abra o Discord no navegador
2. Pressione `F12` para abrir as ferramentas de desenvolvedor
3. Vá para a aba "Network" (Rede)
4. Recarregue a página (F5)
5. Procure por uma requisição chamada "messages" ou "gateway"
6. Vá para a aba "Headers" e procure por "authorization"
7. Copie o token (não compartilhe este token com ninguém!)

**Alternativa:** Use a extensão do navegador para obter o token mais facilmente.

## 📖 Como Usar

1. Inicie o selfbot:
```bash
npm start
```

2. Aguarde a conexão (você verá "✅ Selfbot conectado como [seu nome]!")

3. Use os comandos disponíveis:

### Comandos Disponíveis

- **`delete <channelId> <messageId>`**
  - Deleta uma mensagem específica
  - Exemplo: `delete 123456789012345678 987654321098765432`

- **`deleteAll <channelId>`**
  - Deleta todas as suas mensagens do canal
  - Exemplo: `deleteAll 123456789012345678`

- **`deleteRange <channelId> <startId> <endId>`**
  - Deleta mensagens em um intervalo específico
  - Exemplo: `deleteRange 123456789012345678 111111111111111111 222222222222222222`

- **`help`**
  - Mostra a lista de comandos disponíveis

- **`exit` ou `quit`**
  - Encerra o programa

## 🔍 Como obter IDs

### ID do Canal
1. Ative o "Modo Desenvolvedor" nas configurações do Discord (Configurações > Avançado > Modo Desenvolvedor)
2. Clique com o botão direito no canal e selecione "Copiar ID"

### ID da Mensagem
1. Com o Modo Desenvolvedor ativado
2. Clique com o botão direito na mensagem e selecione "Copiar ID"

## ⚙️ Funcionalidades

- ✅ Deletar mensagens individuais por ID
- ✅ Deletar todas as mensagens de um canal
- ✅ Deletar mensagens em um intervalo específico
- ✅ Proteção contra rate limits (delay entre deleções)
- ✅ Interface de linha de comando interativa
- ✅ Validação de mensagens (só deleta suas próprias mensagens)

## 🛡️ Segurança

- **NUNCA compartilhe seu token do Discord**
- Mantenha o arquivo `.env` privado e não o commite no Git
- Use este selfbot apenas em contas pessoais de teste
- Esteja ciente dos riscos de banimento

## 📝 Notas

- O selfbot só pode deletar mensagens que você mesmo enviou
- Há um delay de 1 segundo entre cada deleção para evitar rate limits
- Para canais com muitas mensagens, o processo pode demorar

## 📄 Licença

MIT

## ⚠️ Disclaimer

Este software é fornecido "como está", sem garantias. O uso deste selfbot é de sua total responsabilidade. O Discord pode banir contas que usam selfbots.

