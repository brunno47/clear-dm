require('dotenv').config();
const { Client } = require('discord.js-selfbot-v13');
const readline = require('readline');

const client = new Client({ checkUpdate: false });
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Cores ANSI
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m'
};

const separator = '═══════════════════════════════════════════════════════════';
const doubleSeparator = '═══════════════════════════════════════════════════════════════════════════════════';

// Função para limpar console
function clearConsole() {
    console.clear();
}

// Função para animação de loading
function showLoading(text, duration = 1000) {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    const interval = setInterval(() => {
        process.stdout.write(`\r${colors.cyan}${frames[i]} ${text}${colors.reset}`);
        i = (i + 1) % frames.length;
    }, 100);
    
    setTimeout(() => {
        clearInterval(interval);
        process.stdout.write('\r' + ' '.repeat(50) + '\r');
    }, duration);
}

// Banner ASCII
function showBanner() {
    console.clear();
    console.log(colors.cyan + `
    ╔═══════════════════════════════════════════════════════════════════════════╗
    ║                                                                           ║
    ║     ██╗      █████╗ ██████╗ ██████╗     ███████╗                          ║
    ║     ██║     ██╔══██╗██╔══██╗██╔══██╗    ██╔════╝                          ║
    ║     ██║     ███████║██████╔╝██████╔╝    ███████╗                          ║
    ║     ██║     ██╔══██║██╔══██╗██╔═══╝     ╚════██║                          ║
    ║     ███████╗██║  ██║██║  ██║██║         ███████║                          ║
    ║     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝         ╚══════╝                          ║
    ║                                                                           ║
    ║                    ${colors.bright}${colors.magenta}╔═══════════════════════════╗${colors.reset}${colors.cyan}                    ║
    ║                    ${colors.bright}${colors.magenta}╔═══════════════════════════╗${colors.reset}${colors.cyan}                    ║
    ║                    ${colors.bright}${colors.magenta}║   ${colors.yellow}Fourstatic v1.0${colors.magenta}   ║${colors.reset}${colors.cyan}                    ║
    ║                    ${colors.bright}${colors.magenta}╚═══════════════════════════╝${colors.reset}${colors.cyan}                    ║
    ║                                                                           ║
    ║                    ${colors.dim}Desenvolvido por ${colors.bright}${colors.yellow}Nine${colors.reset}${colors.cyan}                    ║
    ║                    ${colors.dim}Discord: ${colors.bright}${colors.yellow}hmgrr${colors.reset}${colors.cyan}                    ║
    ║                                                                           ║
    ╚═══════════════════════════════════════════════════════════════════════════╝
    ` + colors.reset);
}

// Função para print colorido
function printColor(text, color = 'white') {
    console.log(colors[color] + text + colors.reset);
}

function isRateLimitError(error) {
    return error.code === 429 || error.code === 50035 || 
           error.message?.includes('rate limit') || 
           error.message?.includes('Too Many Requests');
}

client.on('ready', () => {
    showBanner();
    console.log(colors.green + `\n    ✅ ${colors.bright}Fourstatic conectado com sucesso!${colors.reset}${colors.green}`);
    console.log(`    👤 Usuário: ${colors.cyan}${client.user.tag}${colors.green}`);
    console.log(`    🆔 ID: ${colors.cyan}${client.user.id}${colors.green}`);
    console.log(`    🌐 Servidores: ${colors.cyan}${client.guilds.cache.size}${colors.green}`);
    console.log(`    💬 Canais: ${colors.cyan}${client.channels.cache.size}${colors.reset}\n`);
    console.log(colors.yellow + `    💡 Digite ${colors.bright}"menu"${colors.reset}${colors.yellow} ou ${colors.bright}"help"${colors.reset}${colors.yellow} para ver os comandos disponíveis\n${colors.reset}`);
});

async function listServers() {
    try {
        showLoading('Carregando servidores...', 500);
        console.log(colors.cyan + `\n    ${doubleSeparator}`);
        console.log(`    ${colors.bright}📋 SERVIDORES DISPONÍVEIS${colors.reset}${colors.cyan}`);
        console.log(`    ${doubleSeparator}${colors.reset}\n`);
        
        let index = 1;
        const servers = Array.from(client.guilds.cache.values());
        
        servers.forEach(guild => {
            const icon = guild.iconURL() ? '🖼️' : '📁';
            console.log(colors.white + `    ${colors.cyan}[${index}]${colors.reset} ${icon} ${colors.bright}${guild.name}${colors.reset}`);
            console.log(colors.dim + `        🆔 ID: ${guild.id}${colors.reset}`);
            console.log(colors.dim + `        👥 Membros: ${guild.memberCount || 'N/A'}${colors.reset}\n`);
            index++;
        });
        
        console.log(colors.cyan + `    ${doubleSeparator}${colors.reset}\n`);
    } catch (error) {
        printColor(`    ❌ Erro ao listar servidores: ${error.message}`, 'red');
    }
}

async function listChannels(guildId) {
    try {
        showLoading('Carregando canais...', 500);
        let guild;
        try {
            guild = await client.guilds.fetch(guildId);
        } catch (fetchError) {
            if (fetchError.code === 50001 || fetchError.message?.includes('Missing Access')) {
                printColor('    ❌ Erro: Sem acesso ao servidor!', 'red');
                printColor('    💡 Você não é membro deste servidor ou não tem permissão', 'yellow');
                return;
            }
            throw fetchError;
        }
        
        if (!guild) {
            printColor('    ❌ Servidor não encontrado!', 'red');
            printColor('    💡 Verifique se o ID do servidor está correto', 'yellow');
            return;
        }
        
        console.log(colors.cyan + `\n    ${doubleSeparator}`);
        console.log(`    ${colors.bright}📋 CANAIS DO SERVIDOR: ${guild.name}${colors.reset}${colors.cyan}`);
        console.log(`    ${doubleSeparator}${colors.reset}\n`);
        
        const channels = guild.channels.cache.filter(ch => ch.type === 0 || ch.type === 1);
        
        let index = 1;
        channels.forEach(channel => {
            const type = channel.type === 0 ? '📝 Texto' : '💬 DM';
            const icon = channel.type === 0 ? '💬' : '📨';
            console.log(colors.white + `    ${colors.cyan}[${index}]${colors.reset} ${icon} ${colors.bright}${channel.name || 'Sem nome'}${colors.reset}`);
            console.log(colors.dim + `        📌 Tipo: ${type}${colors.reset}`);
            console.log(colors.dim + `        🆔 ID: ${channel.id}${colors.reset}\n`);
            index++;
        });
        
        console.log(colors.cyan + `    ${doubleSeparator}${colors.reset}\n`);
    } catch (error) {
        printColor(`    ❌ Erro ao listar canais: ${error.message}`, 'red');
    }
}

async function searchMessages(channelId, searchTerm, limit = 50) {
    try {
        showLoading(`Buscando mensagens contendo "${searchTerm}"...`, 800);
        let channel;
        try {
            channel = await client.channels.fetch(channelId);
        } catch (fetchError) {
            if (fetchError.code === 50001 || fetchError.message?.includes('Missing Access')) {
                printColor('    ❌ Erro: Sem acesso ao canal!', 'red');
                printColor('    💡 Verifique se você tem permissão para acessar este canal', 'yellow');
                return;
            }
            throw fetchError;
        }
        
        if (!channel) {
            printColor('    ❌ Canal não encontrado!', 'red');
            return;
        }
        
        console.log(colors.cyan + `\n    ${doubleSeparator}`);
        console.log(`    ${colors.bright}🔍 RESULTADOS DA BUSCA${colors.reset}${colors.cyan}`);
        console.log(`    ${doubleSeparator}${colors.reset}\n`);
        console.log(colors.yellow + `    🔎 Termo buscado: ${colors.bright}"${searchTerm}"${colors.reset}\n`);
        
        const messages = await channel.messages.fetch({ limit });
        const filtered = messages.filter(msg => 
            msg.content.toLowerCase().includes(searchTerm.toLowerCase()) && 
            msg.author.id === client.user.id
        );
        
        if (filtered.size === 0) {
            printColor('    ⚠️  Nenhuma mensagem encontrada!', 'yellow');
        } else {
            console.log(colors.green + `    ✅ ${colors.bright}${filtered.size}${colors.reset}${colors.green} mensagem(ns) encontrada(s):\n${colors.reset}`);
            
            let index = 1;
            filtered.forEach(msg => {
                const preview = msg.content.length > 80 ? msg.content.substring(0, 80) + '...' : msg.content;
                const date = new Date(msg.createdTimestamp).toLocaleString('pt-BR');
                console.log(colors.white + `    ${colors.cyan}[${index}]${colors.reset} ${colors.dim}${date}${colors.reset}`);
                console.log(colors.white + `        💬 ${preview}`);
                console.log(colors.dim + `        🆔 ID: ${msg.id}${colors.reset}\n`);
                index++;
            });
        }
        
        console.log(colors.cyan + `    ${doubleSeparator}${colors.reset}\n`);
    } catch (error) {
        printColor(`    ❌ Erro ao buscar mensagens: ${error.message}`, 'red');
    }
}

async function deleteMessage(channelId, messageId) {
    try {
        showLoading('Deletando mensagem...', 500);
        let channel;
        try {
            channel = await client.channels.fetch(channelId);
        } catch (fetchError) {
            if (fetchError.code === 50001 || fetchError.message?.includes('Missing Access')) {
                printColor('    ❌ Erro: Sem acesso ao canal!', 'red');
                printColor('    💡 Verifique se você tem permissão para acessar este canal', 'yellow');
                return;
            }
            throw fetchError;
        }
        
        if (!channel) {
            printColor('    ❌ Canal não encontrado!', 'red');
            return;
        }
        
        let message;
        try {
            message = await channel.messages.fetch(messageId);
        } catch (msgError) {
            if (msgError.code === 10008) {
                printColor('    ❌ Mensagem não encontrada!', 'red');
                printColor('    💡 A mensagem pode ter sido deletada ou o ID está incorreto', 'yellow');
                return;
            }
            if (msgError.code === 50001) {
                printColor('    ❌ Erro: Sem permissão para acessar mensagens deste canal!', 'red');
                return;
            }
            throw msgError;
        }
        
        if (!message) {
            printColor('    ❌ Mensagem não encontrada!', 'red');
            return;
        }
        
        if (message.author.id !== client.user.id) {
            printColor('    ⚠️  Você só pode deletar suas próprias mensagens!', 'yellow');
            return;
        }
        
        await message.delete();
        printColor(`    ✅ Mensagem deletada com sucesso! (ID: ${messageId})`, 'green');
    } catch (error) {
        if (error.code === 429) {
            printColor('    ⏸️  Rate limit! Aguarde alguns segundos...', 'yellow');
        } else if (error.code === 50001 || error.message?.includes('Missing Access')) {
            printColor('    ❌ Erro: Sem acesso ao canal ou mensagem!', 'red');
            printColor('    💡 Verifique suas permissões', 'yellow');
        } else if (error.code === 10008) {
            printColor('    ❌ Mensagem não encontrada!', 'red');
        } else {
            printColor(`    ❌ Erro ao deletar mensagem: ${error.message}`, 'red');
            if (error.code) {
                printColor(`    🔢 Código do erro: ${error.code}`, 'dim');
            }
        }
    }
}

async function editMessage(channelId, messageId, newContent) {
    try {
        showLoading('Editando mensagem...', 500);
        let channel;
        try {
            channel = await client.channels.fetch(channelId);
        } catch (fetchError) {
            if (fetchError.code === 50001 || fetchError.message?.includes('Missing Access')) {
                printColor('    ❌ Erro: Sem acesso ao canal!', 'red');
                printColor('    💡 Verifique se você tem permissão para acessar este canal', 'yellow');
                return;
            }
            throw fetchError;
        }
        
        if (!channel) {
            printColor('    ❌ Canal não encontrado!', 'red');
            return;
        }
        
        let message;
        try {
            message = await channel.messages.fetch(messageId);
        } catch (msgError) {
            if (msgError.code === 10008) {
                printColor('    ❌ Mensagem não encontrada!', 'red');
                printColor('    💡 A mensagem pode ter sido deletada ou o ID está incorreto', 'yellow');
                return;
            }
            if (msgError.code === 50001) {
                printColor('    ❌ Erro: Sem permissão para acessar mensagens deste canal!', 'red');
                return;
            }
            throw msgError;
        }
        
        if (!message) {
            printColor('    ❌ Mensagem não encontrada!', 'red');
            return;
        }
        
        if (message.author.id !== client.user.id) {
            printColor('    ⚠️  Você só pode editar suas próprias mensagens!', 'yellow');
            return;
        }
        
        await message.edit(newContent);
        printColor(`    ✅ Mensagem editada com sucesso! (ID: ${messageId})`, 'green');
    } catch (error) {
        if (error.code === 429) {
            printColor('    ⏸️  Rate limit! Aguarde alguns segundos...', 'yellow');
        } else if (error.code === 50001 || error.message?.includes('Missing Access')) {
            printColor('    ❌ Erro: Sem acesso ao canal ou mensagem!', 'red');
            printColor('    💡 Verifique suas permissões', 'yellow');
        } else if (error.code === 10008) {
            printColor('    ❌ Mensagem não encontrada!', 'red');
        } else if (error.code === 50005) {
            printColor('    ❌ Erro: Não é possível editar esta mensagem!', 'red');
            printColor('    💡 Algumas mensagens não podem ser editadas após um tempo', 'yellow');
        } else {
            printColor(`    ❌ Erro ao editar mensagem: ${error.message}`, 'red');
            if (error.code) {
                printColor(`    🔢 Código do erro: ${error.code}`, 'dim');
            }
        }
    }
}

async function deleteAllMessages(channelId) {
    try {
        showLoading('Verificando acesso ao canal...', 500);
        let channel;
        try {
            channel = await client.channels.fetch(channelId);
        } catch (fetchError) {
            if (fetchError.code === 50001 || fetchError.message?.includes('Missing Access')) {
                printColor('    ❌ Erro: Sem acesso ao canal!', 'red');
                printColor('    💡 Possíveis causas:', 'yellow');
                printColor('       • Você não tem permissão para acessar este canal', 'yellow');
                printColor('       • O canal foi deletado ou você foi removido do servidor', 'yellow');
                printColor('       • O ID do canal está incorreto', 'yellow');
                return;
            }
            throw fetchError;
        }
        
        if (!channel) {
            printColor('    ❌ Canal não encontrado!', 'red');
            printColor('    💡 Verifique se o ID do canal está correto', 'yellow');
            return;
        }
        
        // Verificar se consegue acessar mensagens
        try {
            await channel.messages.fetch({ limit: 1 });
        } catch (accessError) {
            if (accessError.code === 50001 || accessError.message?.includes('Missing Access')) {
                printColor('    ❌ Erro: Sem permissão para acessar mensagens deste canal!', 'red');
                printColor('    💡 Você precisa ter permissão para ver o histórico de mensagens', 'yellow');
                return;
            }
            throw accessError;
        }
        
        console.log(colors.cyan + `\n    ${doubleSeparator}`);
        console.log(`    ${colors.bright}🗑️  DELETANDO TODAS AS MENSAGENS${colors.reset}${colors.cyan}`);
        console.log(`    ${doubleSeparator}${colors.reset}\n`);
        console.log(colors.yellow + `    📍 Canal: ${colors.bright}${channel.name || 'DM'}${colors.reset}`);
        console.log(colors.yellow + `    🆔 ID: ${colors.bright}${channelId}${colors.reset}\n`);
        
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
                    console.log(colors.yellow + `\n    ⏸️  RATE LIMIT DETECTADO!`);
                    console.log(`    📊 Progresso: ${colors.bright}${deletedCount}${colors.reset}${colors.yellow} mensagens deletadas`);
                    console.log(`    ⏳ Pausando por ${retryAfter} segundos...${colors.reset}\n`);
                    rateLimitHits++;
                    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                    console.log(colors.green + '    ▶️  Retomando deleção...\n' + colors.reset);
                    continue;
                }
                if (error.code === 50001 || error.message?.includes('Missing Access')) {
                    printColor('\n    ❌ Erro: Perdeu acesso ao canal durante a operação!', 'red');
                    printColor(`    📊 Mensagens deletadas até agora: ${deletedCount}`, 'yellow');
                    return;
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
                    process.stdout.write(`\r${colors.cyan}    🗑️  Mensagens deletadas: ${colors.bright}${deletedCount}${colors.reset}`);
                    
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    if (isRateLimitError(error)) {
                        const retryAfter = error.retry_after || 5;
                        console.log(colors.yellow + `\n\n    ⏸️  RATE LIMIT! Pausando por ${retryAfter} segundos...`);
                        console.log(`    📊 Progresso: ${deletedCount} mensagens deletadas até agora${colors.reset}\n`);
                        rateLimitHits++;
                        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                        console.log(colors.green + '    ▶️  Retomando deleção...\n' + colors.reset);
                        
                        try {
                            await msg.delete();
                            deletedCount++;
                            process.stdout.write(`\r${colors.cyan}    🗑️  Mensagens deletadas: ${colors.bright}${deletedCount}${colors.reset}`);
                        } catch (retryError) {
                            printColor(`    ❌ Erro ao deletar mensagem ${id}: ${retryError.message}`, 'red');
                        }
                    } else {
                        printColor(`    ❌ Erro ao deletar mensagem ${id}: ${error.message}`, 'red');
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
        
        console.log('\n');
        console.log(colors.green + `    ${doubleSeparator}`);
        console.log(`    ${colors.bright}✅ PROCESSO CONCLUÍDO!${colors.reset}${colors.green}`);
        console.log(`    ${doubleSeparator}${colors.reset}\n`);
        console.log(colors.cyan + `    📊 Total de mensagens deletadas: ${colors.bright}${deletedCount}${colors.reset}`);
        console.log(`    ⏱️  Tempo decorrido: ${colors.bright}${duration}s${colors.reset}`);
        if (rateLimitHits > 0) {
            console.log(`    ⏸️  Pausas por rate limit: ${colors.bright}${rateLimitHits}${colors.reset}`);
        }
        console.log(colors.green + `    ${doubleSeparator}${colors.reset}\n`);
    } catch (error) {
        console.log('');
        if (error.code === 50001 || error.message?.includes('Missing Access')) {
            printColor('    ❌ Erro: Sem acesso ao canal!', 'red');
            printColor('    💡 Possíveis soluções:', 'yellow');
            printColor('       • Verifique se você tem permissão para acessar o canal', 'yellow');
            printColor('       • Certifique-se de que o ID do canal está correto', 'yellow');
            printColor('       • Se for um servidor, verifique se você ainda é membro', 'yellow');
        } else if (error.code === 50013) {
            printColor('    ❌ Erro: Sem permissão para deletar mensagens!', 'red');
            printColor('    💡 Você precisa ter permissão para gerenciar mensagens', 'yellow');
        } else if (error.code === 429) {
            printColor('    ⏸️  Rate limit detectado! Aguarde alguns segundos e tente novamente.', 'yellow');
        } else if (error.code === 10008) {
            printColor('    ❌ Erro: Canal não encontrado!', 'red');
            printColor('    💡 O canal pode ter sido deletado ou o ID está incorreto', 'yellow');
        } else {
            printColor(`    ❌ Erro ao deletar mensagens: ${error.message}`, 'red');
            if (error.code) {
                printColor(`    🔢 Código do erro: ${error.code}`, 'dim');
            }
        }
        console.log('');
    }
}

async function showStats() {
    try {
        const user = client.user;
        const guilds = client.guilds.cache;
        const channels = client.channels.cache;
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        console.log(colors.cyan + `\n    ${doubleSeparator}`);
        console.log(`    ${colors.bright}📊 ESTATÍSTICAS DO FOURSTATIC${colors.reset}${colors.cyan}`);
        console.log(`    ${doubleSeparator}${colors.reset}\n`);
        
        console.log(colors.white + `    ${colors.bright}👤 INFORMAÇÕES DA CONTA:${colors.reset}`);
        console.log(`        🏷️  Usuário: ${colors.cyan}${user.tag}${colors.reset}`);
        console.log(`        🆔 ID: ${colors.cyan}${user.id}${colors.reset}`);
        console.log(`        🤖 Bot: ${colors.yellow}${user.bot ? 'Sim' : 'Não'}${colors.reset}\n`);
        
        console.log(colors.white + `    ${colors.bright}🌐 ESTATÍSTICAS:${colors.reset}`);
        console.log(`        🏰 Servidores: ${colors.cyan}${guilds.size}${colors.reset}`);
        console.log(`        💬 Canais: ${colors.cyan}${channels.size}${colors.reset}`);
        console.log(`        📝 Canais de texto: ${colors.cyan}${channels.filter(c => c.type === 0).size}${colors.reset}`);
        console.log(`        📨 DMs: ${colors.cyan}${channels.filter(c => c.type === 1).size}${colors.reset}\n`);
        
        console.log(colors.white + `    ${colors.bright}⏱️  TEMPO DE ATIVIDADE:${colors.reset}`);
        console.log(`        🕐 ${hours}h ${minutes}m ${seconds}s${colors.reset}\n`);
        
        console.log(colors.cyan + `    ${doubleSeparator}${colors.reset}\n`);
    } catch (error) {
        printColor(`    ❌ Erro ao obter estatísticas: ${error.message}`, 'red');
    }
}

function showMenu() {
    console.log(colors.cyan + `\n    ${doubleSeparator}`);
    console.log(`    ${colors.bright}${colors.magenta}╔═══════════════════════════════════════════════╗${colors.reset}${colors.cyan}`);
    console.log(`    ${colors.bright}${colors.magenta}║${colors.reset}${colors.cyan}         ${colors.bright}MENU PRINCIPAL - ${colors.yellow}Fourstatic${colors.reset}${colors.cyan}          ${colors.bright}${colors.magenta}║${colors.reset}${colors.cyan}`);
    console.log(`    ${colors.bright}${colors.magenta}╚═══════════════════════════════════════════════╝${colors.reset}${colors.cyan}`);
    console.log(`    ${doubleSeparator}${colors.reset}\n`);
    
    const commands = [
        { cmd: 'servers', desc: 'Lista todos os servidores', icon: '🏰' },
        { cmd: 'channels <id>', desc: 'Lista canais de um servidor', icon: '💬' },
        { cmd: 'search <id> <txt>', desc: 'Busca mensagens por texto', icon: '🔍' },
        { cmd: 'delete <id> <id>', desc: 'Deleta uma mensagem específica', icon: '🗑️' },
        { cmd: 'edit <id> <id> <txt>', desc: 'Edita uma mensagem', icon: '✏️' },
        { cmd: 'deleteall <id>', desc: 'Deleta todas suas mensagens do canal', icon: '💥' },
        { cmd: 'send <id> <txt>', desc: 'Envia uma mensagem no canal', icon: '📤' },
        { cmd: 'stats', desc: 'Mostra estatísticas do Fourstatic', icon: '📊' },
        { cmd: 'info', desc: 'Mostra informações da conta', icon: 'ℹ️' },
        { cmd: 'clear', desc: 'Limpa o console', icon: '🧹' },
        { cmd: 'menu', desc: 'Mostra este menu', icon: '📋' },
        { cmd: 'help', desc: 'Mostra ajuda detalhada', icon: '❓' },
        { cmd: 'exit/quit', desc: 'Encerra o programa', icon: '👋' }
    ];
    
    commands.forEach(({ cmd, desc, icon }) => {
        const cmdPadded = cmd.padEnd(25);
        console.log(colors.white + `    ${icon} ${colors.cyan}${cmdPadded}${colors.reset} ${colors.dim}${desc}${colors.reset}`);
    });
    
    console.log(colors.cyan + `\n    ${doubleSeparator}${colors.reset}\n`);
}

function showHelp() {
    const helpCommands = [
        ['servers', 'Lista todos os servidores que você está', 'servers'],
        ['channels <guildId>', 'Lista todos os canais de texto de um servidor', 'channels 123456789012345678'],
        ['search <channelId> <texto>', 'Busca suas mensagens que contêm o texto', 'search 123456789012345678 olá'],
        ['delete <channelId> <messageId>', 'Deleta uma mensagem específica', 'delete 123456789012345678 987654321098765432'],
        ['edit <channelId> <messageId> <novoTexto>', 'Edita uma mensagem existente', 'edit 123456789012345678 987654321098765432 Nova mensagem'],
        ['deleteall <channelId>', 'Deleta todas as suas mensagens do canal', 'deleteall 123456789012345678'],
        ['send <channelId> <mensagem>', 'Envia uma mensagem no canal', 'send 123456789012345678 Olá mundo!'],
        ['stats', 'Mostra estatísticas detalhadas do Fourstatic', 'stats'],
        ['info', 'Mostra informações da sua conta', 'info'],
        ['clear', 'Limpa o console', 'clear']
    ];
    
    console.log(colors.cyan + `\n    ${doubleSeparator}`);
    console.log(`    ${colors.bright}${colors.magenta}╔═══════════════════════════════════════════════╗${colors.reset}${colors.cyan}`);
    console.log(`    ${colors.bright}${colors.magenta}║${colors.reset}${colors.cyan}            ${colors.bright}AJUDA DETALHADA - ${colors.yellow}Fourstatic${colors.reset}${colors.cyan}          ${colors.bright}${colors.magenta}║${colors.reset}${colors.cyan}`);
    console.log(`    ${colors.bright}${colors.magenta}╚═══════════════════════════════════════════════╝${colors.reset}${colors.cyan}`);
    console.log(`    ${doubleSeparator}${colors.reset}\n`);
    
    helpCommands.forEach(([cmd, desc, example], index) => {
        console.log(colors.white + `    ${colors.cyan}[${index + 1}]${colors.reset} ${colors.bright}${cmd}${colors.reset}`);
        console.log(colors.dim + `        📝 ${desc}${colors.reset}`);
        console.log(colors.dim + `        💡 Exemplo: ${colors.cyan}${example}${colors.reset}\n`);
    });
    
    console.log(colors.cyan + `    ${doubleSeparator}${colors.reset}\n`);
}

function promptCommand() {
    rl.question(colors.cyan + '\n    Fourstatic > ' + colors.reset, async (input) => {
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
                    console.log(colors.yellow + '\n    👋 Encerrando Fourstatic...\n' + colors.reset);
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
                    
                case 'clear':
                    clearConsole();
                    showBanner();
                    promptCommand();
                    break;
                    
                case 'info':
                case 'stats':
                    await showStats();
                    promptCommand();
                    break;
                    
                case 'servers':
                    await listServers();
                    promptCommand();
                    break;
                    
                case 'channels':
                    if (args.length < 2) {
                        printColor('    ❌ Uso: channels <guildId>', 'red');
                        promptCommand();
                        return;
                    }
                    await listChannels(args[1]);
                    promptCommand();
                    break;
                    
                case 'search':
                    if (args.length < 3) {
                        printColor('    ❌ Uso: search <channelId> <texto>', 'red');
                        promptCommand();
                        return;
                    }
                    const searchText = args.slice(2).join(' ');
                    await searchMessages(args[1], searchText);
                    promptCommand();
                    break;
                    
                case 'delete':
                    if (args.length < 3) {
                        printColor('    ❌ Uso: delete <channelId> <messageId>', 'red');
                        promptCommand();
                        return;
                    }
                    await deleteMessage(args[1], args[2]);
                    promptCommand();
                    break;
                    
                case 'edit':
                    if (args.length < 4) {
                        printColor('    ❌ Uso: edit <channelId> <messageId> <novoTexto>', 'red');
                        promptCommand();
                        return;
                    }
                    const newContent = args.slice(3).join(' ');
                    await editMessage(args[1], args[2], newContent);
                    promptCommand();
                    break;
                    
                case 'deleteall':
                    if (args.length < 2) {
                        printColor('    ❌ Uso: deleteall <channelId>', 'red');
                        promptCommand();
                        return;
                    }
                    await deleteAllMessages(args[1]);
                    promptCommand();
                    break;
                    
                case 'send':
                    if (args.length < 3) {
                        printColor('    ❌ Uso: send <channelId> <mensagem>', 'red');
                        promptCommand();
                        return;
                    }
                    try {
                        showLoading('Enviando mensagem...', 500);
                        let channel;
                        try {
                            channel = await client.channels.fetch(args[1]);
                        } catch (fetchError) {
                            if (fetchError.code === 50001 || fetchError.message?.includes('Missing Access')) {
                                printColor('    ❌ Erro: Sem acesso ao canal!', 'red');
                                printColor('    💡 Verifique se você tem permissão para enviar mensagens neste canal', 'yellow');
                                promptCommand();
                                return;
                            }
                            throw fetchError;
                        }
                        
                        if (!channel) {
                            printColor('    ❌ Canal não encontrado!', 'red');
                            promptCommand();
                            return;
                        }
                        
                        const message = args.slice(2).join(' ');
                        await channel.send(message);
                        printColor('    ✅ Mensagem enviada com sucesso!', 'green');
                    } catch (error) {
                        if (error.code === 50001 || error.message?.includes('Missing Access')) {
                            printColor('    ❌ Erro: Sem acesso ao canal!', 'red');
                            printColor('    💡 Verifique se você tem permissão para enviar mensagens', 'yellow');
                        } else if (error.code === 50013) {
                            printColor('    ❌ Erro: Sem permissão para enviar mensagens neste canal!', 'red');
                            printColor('    💡 Você precisa ter permissão para enviar mensagens', 'yellow');
                        } else if (error.code === 50035) {
                            printColor('    ❌ Erro: Mensagem muito longa ou inválida!', 'red');
                            printColor('    💡 Tente uma mensagem mais curta', 'yellow');
                        } else {
                            printColor(`    ❌ Erro ao enviar mensagem: ${error.message}`, 'red');
                            if (error.code) {
                                printColor(`    🔢 Código do erro: ${error.code}`, 'dim');
                            }
                        }
                    }
                    promptCommand();
                    break;
                    
                default:
                    if (/^\d{17,19}$/.test(command)) {
                        await deleteAllMessages(command);
                        promptCommand();
                    } else {
                        printColor('    ❌ Comando não reconhecido! Digite "help" para ver os comandos disponíveis.', 'red');
                        promptCommand();
                    }
                    break;
            }
        } catch (error) {
            printColor(`    ❌ Erro ao executar comando: ${error.message}`, 'red');
            promptCommand();
        }
    });
}

client.login(process.env.TOKEN).catch(error => {
    printColor(`\n    ❌ Erro ao fazer login: ${error.message}`, 'red');
    printColor('    💡 Verifique se o TOKEN está correto no arquivo .env\n', 'yellow');
    process.exit(1);
});

client.once('ready', () => {
    setTimeout(() => {
        showMenu();
        promptCommand();
    }, 1000);
});
