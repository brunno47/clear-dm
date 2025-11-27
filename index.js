require('dotenv').config();
const { Client } = require('discord.js-selfbot-v13');
const readline = require('readline');

const client = new Client({ checkUpdate: false });
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const separator = '═══════════════════════════════════════════════════════════';

function isRateLimitError(error) {
    return error.code === 429 || error.code === 50035 || 
           error.message?.includes('rate limit') || 
           error.message?.includes('Too Many Requests');
}

client.on('ready', () => {
    console.log(`✅ Selfbot conectado como ${client.user.tag}!`);
    console.log('📋 Digite "help" ou "menu" para ver os comandos\n');
});

async function listServers() {
    try {
        console.log(`\n📋 Servidores disponíveis:\n${separator}`);
        let index = 1;
        client.guilds.cache.forEach(guild => {
            console.log(`   ${index}. ${guild.name} (ID: ${guild.id})`);
            index++;
        });
        console.log(`${separator}\n`);
    } catch (error) {
        console.error('❌ Erro ao listar servidores:', error.message);
    }
}

async function listChannels(guildId) {
    try {
        const guild = await client.guilds.fetch(guildId);
        if (!guild) {
            console.log('❌ Servidor não encontrado!');
            return;
        }
        
        console.log(`\n📋 Canais do servidor "${guild.name}":\n${separator}`);
        const channels = guild.channels.cache.filter(ch => ch.type === 0 || ch.type === 1);
        
        let index = 1;
        channels.forEach(channel => {
            const type = channel.type === 0 ? '📝 Texto' : '💬 DM';
            console.log(`   ${index}. ${channel.name} (${type}) - ID: ${channel.id}`);
            index++;
        });
        console.log(`${separator}\n`);
    } catch (error) {
        console.error('❌ Erro ao listar canais:', error.message);
    }
}

async function searchMessages(channelId, searchTerm, limit = 50) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (!channel) {
            console.log('❌ Canal não encontrado!');
            return;
        }
        
        console.log(`\n🔍 Buscando mensagens contendo "${searchTerm}"...`);
        const messages = await channel.messages.fetch({ limit });
        const filtered = messages.filter(msg => 
            msg.content.toLowerCase().includes(searchTerm.toLowerCase()) && 
            msg.author.id === client.user.id
        );
        
        console.log(`\n📋 Mensagens encontradas: ${filtered.size}\n${separator}`);
        let index = 1;
        filtered.forEach(msg => {
            const preview = msg.content.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content;
            console.log(`   ${index}. [${msg.id}] ${preview}`);
            index++;
        });
        console.log(`${separator}\n`);
    } catch (error) {
        console.error('❌ Erro ao buscar mensagens:', error.message);
    }
}

async function deleteMessage(channelId, messageId) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (!channel) {
            console.log('❌ Canal não encontrado!');
            return;
        }
        
        const message = await channel.messages.fetch(messageId);
        if (!message) {
            console.log('❌ Mensagem não encontrada!');
            return;
        }
        
        if (message.author.id !== client.user.id) {
            console.log('⚠️  Você só pode deletar suas próprias mensagens!');
            return;
        }
        
        await message.delete();
        console.log(`✅ Mensagem ${messageId} deletada!`);
    } catch (error) {
        if (error.code === 429) {
            console.log('⏸️  Rate limit! Aguarde alguns segundos...');
        } else {
            console.error('❌ Erro ao deletar mensagem:', error.message);
        }
    }
}

async function deleteAllMessages(channelId) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (!channel) {
            console.log('❌ Canal não encontrado!');
            return;
        }
        
        console.log(`\n🔄 Buscando mensagens no canal ${channel.name || channelId}...`);
        
        let deletedCount = 0;
        let lastMessageId = null;
        let rateLimitHits = 0;
        const startTime = Date.now();
        
        while (true) {
            let messages;
            try {
                const options = { limit: 100 };
                if (lastMessageId) {
                    options.before = lastMessageId;
                }
                messages = await channel.messages.fetch(options);
            } catch (error) {
                if (isRateLimitError(error)) {
                    const retryAfter = error.retry_after || 5;
                    console.log(`\n\n⏸️  RATE LIMIT DETECTADO na busca de mensagens!`);
                    console.log(`📊 Progresso atual: ${deletedCount} mensagens deletadas`);
                    console.log(`⏳ Pausando por ${retryAfter} segundos...`);
                    rateLimitHits++;
                    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                    console.log('▶️  Retomando busca de mensagens...\n');
                    continue;
                }
                throw error;
            }
            
            if (messages.size === 0) {
                break;
            }
            
            const ownMessages = messages.filter(msg => msg.author.id === client.user.id);
            
            if (ownMessages.size === 0) {
                lastMessageId = messages.last().id;
                if (messages.size < 100) {
                    break;
                }
                continue;
            }
            
            for (const [id, msg] of ownMessages) {
                try {
                    await msg.delete();
                    deletedCount++;
                    process.stdout.write(`\r🗑️  Mensagens deletadas: ${deletedCount}`);
                    
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    if (isRateLimitError(error)) {
                        const retryAfter = error.retry_after || 5;
                        console.log(`\n\n⏸️  RATE LIMIT! Pausando por ${retryAfter} segundos...`);
                        console.log(`📊 Progresso: ${deletedCount} mensagens deletadas até agora`);
                        rateLimitHits++;
                        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                        console.log('▶️  Retomando deleção...\n');
                        
                        try {
                            await msg.delete();
                            deletedCount++;
                            process.stdout.write(`\r🗑️  Mensagens deletadas: ${deletedCount}`);
                        } catch (retryError) {
                            console.error(`\n❌ Erro ao deletar mensagem ${id}:`, retryError.message);
                        }
                    } else {
                        console.error(`\n❌ Erro ao deletar mensagem ${id}:`, error.message);
                    }
                }
            }
            
            lastMessageId = messages.last().id;
            
            if (ownMessages.size === 0 && messages.size < 100) {
                break;
            }
        }
        
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(1);
        
        console.log('\n\n✅ Processo concluído!');
        console.log(`📊 Total de mensagens deletadas: ${deletedCount}`);
        console.log(`⏱️  Tempo decorrido: ${duration} segundos`);
        if (rateLimitHits > 0) {
            console.log(`⏸️  Pausas por rate limit: ${rateLimitHits}`);
        }
    } catch (error) {
        console.error('\n❌ Erro ao deletar mensagens:', error.message);
        if (error.code === 429) {
            console.log('⏸️  Rate limit detectado! Aguarde alguns segundos e tente novamente.');
        }
    }
}

function showMenu() {
    console.log(`\n╔${separator}╗`);
    console.log('║                  MENU PRINCIPAL - SELFBOT                ║');
    console.log(`╠${separator}╣`);
    console.log('║  COMANDOS DISPONIVEIS:                                    ║');
    console.log(`╠${separator}╣`);
    console.log('║  servers          - Lista todos os servidores             ║');
    console.log('║  channels <id>    - Lista canais de um servidor           ║');
    console.log('║  search <id> <txt>- Busca mensagens por texto             ║');
    console.log('║  delete <id> <id>- Deleta uma mensagem específica         ║');
    console.log('║  deleteall <id>  - Deleta todas suas mensagens do canal   ║');
    console.log('║  send <id> <txt> - Envia uma mensagem no canal            ║');
    console.log('║  info             - Mostra informações da conta            ║');
    console.log('║  menu             - Mostra este menu                       ║');
    console.log('║  help             - Mostra ajuda detalhada                 ║');
    console.log('║  exit/quit        - Encerra o programa                     ║');
    console.log(`╚${separator}╝\n`);
}

function showHelp() {
    const helpCommands = [
        ['servers', 'Lista todos os servidores que você está', 'servers'],
        ['channels <guildId>', 'Lista todos os canais de texto de um servidor', 'channels 123456789012345678'],
        ['search <channelId> <texto>', 'Busca suas mensagens que contêm o texto', 'search 123456789012345678 olá'],
        ['delete <channelId> <messageId>', 'Deleta uma mensagem específica', 'delete 123456789012345678 987654321098765432'],
        ['deleteall <channelId>', 'Deleta todas as suas mensagens do canal', 'deleteall 123456789012345678'],
        ['send <channelId> <mensagem>', 'Envia uma mensagem no canal', 'send 123456789012345678 Olá mundo!']
    ];
    
    console.log(`\n╔${separator}╗`);
    console.log('║                    AJUDA DETALHADA                         ║');
    console.log(`╠${separator}╣`);
    
    helpCommands.forEach(([cmd, desc, example]) => {
        console.log('║                                                           ║');
        console.log(`║  ${cmd.padEnd(57)}║`);
        console.log(`║    ${desc.padEnd(55)}║`);
        console.log(`║    Exemplo: ${example.padEnd(47)}║`);
    });
    
    console.log('║                                                           ║');
    console.log(`╚${separator}╝\n`);
}

function promptCommand() {
    rl.question('\n> ', async (input) => {
        const args = input.trim().split(' ');
        const command = args[0]?.toLowerCase();
        
        if (!command) {
            promptCommand();
            return;
        }
        
        try {
            switch (command) {
                case 'exit':
                case 'quit':
                    console.log('👋 Encerrando...');
                    rl.close();
                    client.destroy();
                    process.exit(0);
                    break;
                    
                case 'help':
                    showHelp();
                    promptCommand();
                    break;
                    
                case 'menu':
                    showMenu();
                    promptCommand();
                    break;
                    
                case 'info':
                    const user = client.user;
                    console.log(`\n╔${separator}╗`);
                    console.log('║                  INFORMACOES DA CONTA                     ║');
                    console.log(`╠${separator}╣`);
                    console.log(`║  Usuario: ${user.tag.padEnd(47)}║`);
                    console.log(`║  ID: ${user.id.padEnd(52)}║`);
                    console.log(`║  Servidores: ${client.guilds.cache.size.toString().padEnd(45)}║`);
                    console.log(`║  Canais: ${client.channels.cache.size.toString().padEnd(50)}║`);
                    console.log(`╚${separator}╝\n`);
                    promptCommand();
                    break;
                    
                case 'servers':
                    await listServers();
                    promptCommand();
                    break;
                    
                case 'channels':
                    if (args.length < 2) {
                        console.log('❌ Uso: channels <guildId>');
                        promptCommand();
                        return;
                    }
                    await listChannels(args[1]);
                    promptCommand();
                    break;
                    
                case 'search':
                    if (args.length < 3) {
                        console.log('❌ Uso: search <channelId> <texto>');
                        promptCommand();
                        return;
                    }
                    const searchText = args.slice(2).join(' ');
                    await searchMessages(args[1], searchText);
                    promptCommand();
                    break;
                    
                case 'delete':
                    if (args.length < 3) {
                        console.log('❌ Uso: delete <channelId> <messageId>');
                        promptCommand();
                        return;
                    }
                    await deleteMessage(args[1], args[2]);
                    promptCommand();
                    break;
                    
                case 'deleteall':
                    if (args.length < 2) {
                        console.log('❌ Uso: deleteall <channelId>');
                        promptCommand();
                        return;
                    }
                    await deleteAllMessages(args[1]);
                    promptCommand();
                    break;
                    
                case 'send':
                    if (args.length < 3) {
                        console.log('❌ Uso: send <channelId> <mensagem>');
                        promptCommand();
                        return;
                    }
                    try {
                        const channel = await client.channels.fetch(args[1]);
                        if (!channel) {
                            console.log('❌ Canal não encontrado!');
                            promptCommand();
                            return;
                        }
                        const message = args.slice(2).join(' ');
                        await channel.send(message);
                        console.log('✅ Mensagem enviada com sucesso!');
                    } catch (error) {
                        console.error('❌ Erro ao enviar mensagem:', error.message);
                    }
                    promptCommand();
                    break;
                    
                default:
                    if (/^\d{17,19}$/.test(command)) {
                        await deleteAllMessages(command);
                        promptCommand();
                    } else {
                        console.log('❌ Comando não reconhecido! Digite "help" para ver os comandos disponíveis.');
                        promptCommand();
                    }
                    break;
            }
        } catch (error) {
            console.error('❌ Erro ao executar comando:', error.message);
            promptCommand();
        }
    });
}

client.login(process.env.TOKEN).catch(error => {
    console.error('❌ Erro ao fazer login:', error.message);
    console.log('💡 Verifique se o TOKEN está correto no arquivo .env');
    process.exit(1);
});

client.once('ready', () => {
    setTimeout(() => {
        showMenu();
        promptCommand();
    }, 1000);
});
