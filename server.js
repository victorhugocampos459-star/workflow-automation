const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
    authStrategy: new LocalAuth()
});

// Guarda temporariamente os dados de cada conversa
const usuarios = {};

client.on("qr", (qr) => {
    console.log("📱 Escaneie o QR Code com o WhatsApp:");
    qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
    console.log("✅ CEEP Conecta conectado ao WhatsApp!");

    try {
        const versao = await client.getWWebVersion();
        console.log("🌐 WhatsApp Web:", versao);
    } catch (erro) {
        console.log("⚠️ Não foi possível descobrir a versão do WhatsApp Web.");
    }
});

client.on("message", async (message) => {
    const texto = message.body.toLowerCase().trim();
    const numero = message.from;

    console.log("📩 Mensagem recebida:", message.body);

    // Cria o usuário quando ele entra pela primeira vez
    if (!usuarios[numero]) {
        usuarios[numero] = {
            etapa: "nome",
            nome: "",
            turma: "",
            responsavel: "",
            solicitacao: ""
        };
    }

    const usuario = usuarios[numero];

    console.log("🔎 Verificando comando:", texto);

    // ==========================================
    // INICIAR ATENDIMENTO
    // ==========================================

    if (
        texto === "oi" ||
        texto === "olá" ||
        texto === "ola" ||
        texto === "menu" ||
        texto === "início" ||
        texto === "inicio"
    ) {
        console.log("🤖 Comando reconhecido! Tentando responder...");

        usuarios[numero] = {
            etapa: "nome",
            nome: "",
            turma: "",
            responsavel: "",
            solicitacao: ""
        };

        await message.reply(
            "👋 *Olá! Seja bem-vindo ao CEEP Conecta!*\n\n" +
            "Sou o assistente virtual do CEEP Ibiporã.\n\n" +
            "Para iniciar seu atendimento, preciso de algumas informações.\n\n" +
            "👤 *1. Informe o nome completo do aluno:*"
        );

        return;
    }

    // ==========================================
    // NOME DO ALUNO
    // ==========================================

    if (usuario.etapa === "nome") {
        usuario.nome = message.body.trim();
        usuario.etapa = "turma";

        await message.reply(
            "✅ Nome registrado!\n\n" +
            "🎓 *2. Agora informe a série e a turma do aluno:*\n\n" +
            "Exemplo: *2º DS - 2ºA*"
        );

        return;
    }

    // ==========================================
    // TURMA
    // ==========================================

    if (usuario.etapa === "turma") {
        usuario.turma = message.body.trim();
        usuario.etapa = "responsavel";

        await message.reply(
            "✅ Turma registrada!\n\n" +
            "👨‍👩‍👦 *3. Informe o nome completo do responsável pelo aluno:*"
        );

        return;
    }

    // ==========================================
    // RESPONSÁVEL
    // ==========================================

    if (usuario.etapa === "responsavel") {
        usuario.responsavel = message.body.trim();
        usuario.etapa = "menu";

        await message.reply(
            "✅ Informações registradas!\n\n" +
            "👤 *Aluno:* " + usuario.nome + "\n" +
            "🎓 *Turma:* " + usuario.turma + "\n" +
            "👨‍👩‍👦 *Responsável:* " + usuario.responsavel + "\n\n" +
            "━━━━━━━━━━━━━━━━━━\n\n" +
            "📚 *COMO PODEMOS AJUDAR?*\n\n" +
            "1️⃣ Matrículas\n" +
            "2️⃣ Reclamações\n" +
            "3️⃣ Notas\n" +
            "4️⃣ Faltas\n" +
            "5️⃣ Atestados\n" +
            "6️⃣ Transferências\n" +
            "7️⃣ Materiais\n" +
            "8️⃣ Relatório comportamental\n" +
            "9️⃣ Agendar atendimento\n" +
            "🔟 Sugestões\n\n" +
            "Digite o número da opção desejada."
        );

        return;
    }

    // ==========================================
    // SUBMENU DE MATRÍCULAS
    // ==========================================

    if (usuario.etapa === "matriculas") {

        if (texto === "1") {
            usuario.etapa = "matricula";

            await message.reply(
                "📝 *MATRÍCULA*\n\n" +
                "Informe o que você gostaria de saber ou solicitar sobre matrícula."
            );

            return;
        }

        if (texto === "2") {
            usuario.etapa = "rematricula";

            await message.reply(
                "🔄 *REMATRÍCULA*\n\n" +
                "Informe o que você gostaria de saber ou solicitar sobre rematrícula."
            );

            return;
        }

        if (texto === "3") {
            usuario.etapa = "duvida_matricula";

            await message.reply(
                "❓ *DÚVIDAS SOBRE MATRÍCULA*\n\n" +
                "Escreva sua dúvida e ela será encaminhada para a equipe responsável."
            );

            return;
        }

        await message.reply(
            "🤔 Não reconheci essa opção.\n\n" +
            "Digite *1*, *2* ou *3*."
        );

        return;
    }

    // ==========================================
    // SOLICITAÇÃO DE MATRÍCULA
    // ==========================================

    if (usuario.etapa === "matricula") {
        usuario.solicitacao = message.body.trim();

        await message.reply(
            "✅ Solicitação registrada!\n\n" +
            "📚 *MATRÍCULA*\n\n" +
            "👤 *Aluno:* " + usuario.nome + "\n" +
            "🎓 *Turma:* " + usuario.turma + "\n" +
            "👨‍👩‍👦 *Responsável:* " + usuario.responsavel + "\n\n" +
            "📝 *Solicitação:*\n" +
            usuario.solicitacao + "\n\n" +
            "━━━━━━━━━━━━━━━━━━\n\n" +
            "Sua solicitação foi registrada no atendimento.\n\n" +
            "A equipe responsável poderá analisar a solicitação e entrar em contato.\n\n" +
            "Digite *menu* para voltar ao menu principal."
        );

        usuario.etapa = "finalizado";

        return;
    }

    // ==========================================
    // SOLICITAÇÃO DE REMATRÍCULA
    // ==========================================

    if (usuario.etapa === "rematricula") {
        usuario.solicitacao = message.body.trim();

        await message.reply(
            "✅ Solicitação registrada!\n\n" +
            "🔄 *REMATRÍCULA*\n\n" +
            "👤 *Aluno:* " + usuario.nome + "\n" +
            "🎓 *Turma:* " + usuario.turma + "\n" +
            "👨‍👩‍👦 *Responsável:* " + usuario.responsavel + "\n\n" +
            "📝 *Solicitação:*\n" +
            usuario.solicitacao + "\n\n" +
            "━━━━━━━━━━━━━━━━━━\n\n" +
            "Sua solicitação foi registrada no atendimento.\n\n" +
            "A equipe responsável poderá analisar a solicitação e entrar em contato.\n\n" +
            "Digite *menu* para voltar ao menu principal."
        );

        usuario.etapa = "finalizado";

        return;
    }

    // ==========================================
    // DÚVIDA SOBRE MATRÍCULA
    // ==========================================

    if (usuario.etapa === "duvida_matricula") {
        usuario.solicitacao = message.body.trim();

        await message.reply(
            "✅ Dúvida registrada!\n\n" +
            "❓ *DÚVIDA SOBRE MATRÍCULA*\n\n" +
            "👤 *Aluno:* " + usuario.nome + "\n" +
            "🎓 *Turma:* " + usuario.turma + "\n" +
            "👨‍👩‍👦 *Responsável:* " + usuario.responsavel + "\n\n" +
            "📝 *Dúvida:*\n" +
            usuario.solicitacao + "\n\n" +
            "━━━━━━━━━━━━━━━━━━\n\n" +
            "Sua dúvida foi registrada no atendimento.\n\n" +
            "Digite *menu* para voltar ao menu principal."
        );

        usuario.etapa = "finalizado";

        return;
    }

    // ==========================================
    // ATENDIMENTO FINALIZADO
    // ==========================================

    if (usuario.etapa === "finalizado") {
        if (texto === "menu") {
            usuario.etapa = "menu";

            await message.reply(
                "📚 *MENU PRINCIPAL*\n\n" +
                "1️⃣ Matrículas\n" +
                "2️⃣ Reclamações\n" +
                "3️⃣ Notas\n" +
                "4️⃣ Faltas\n" +
                "5️⃣ Atestados\n" +
                "6️⃣ Transferências\n" +
                "7️⃣ Materiais\n" +
                "8️⃣ Relatório comportamental\n" +
                "9️⃣ Agendar atendimento\n" +
                "🔟 Sugestões\n\n" +
                "Digite o número da opção desejada."
            );

            return;
        }

        await message.reply(
            "Digite *menu* para voltar ao menu principal."
        );

        return;
    }

    // ==========================================
    // MENU PRINCIPAL
    // ==========================================

    if (usuario.etapa === "menu") {

        // ------------------------------------------
        // MATRÍCULAS
        // ------------------------------------------

        if (texto === "1") {
            usuario.etapa = "matriculas";

            await message.reply(
                "📚 *MATRÍCULAS*\n\n" +
                "Em que podemos ajudar?\n\n" +
                "1️⃣ Matrícula\n" +
                "2️⃣ Rematrícula\n" +
                "3️⃣ Dúvidas sobre matrícula\n\n" +
                "Digite o número da opção desejada."
            );

            return;
        }

        // ------------------------------------------
        // RECLAMAÇÕES
        // ------------------------------------------

        if (texto === "2") {
            await message.reply(
                "⚠️ *RECLAMAÇÕES*\n\n" +
                "Descreva brevemente o que aconteceu.\n\n" +
                "Sua solicitação será encaminhada para a equipe responsável."
            );

            return;
        }

        // ------------------------------------------
        // NOTAS
        // ------------------------------------------

        if (texto === "3") {
            await message.reply(
                "📊 *NOTAS*\n\n" +
                "Informe sobre qual disciplina ou situação você deseja atendimento."
            );

            return;
        }

        // ------------------------------------------
        // FALTAS
        // ------------------------------------------

        if (texto === "4") {
            await message.reply(
                "📅 *FALTAS*\n\n" +
                "Informe a situação relacionada às faltas do aluno."
            );

            return;
        }

        // ------------------------------------------
        // ATESTADOS
        // ------------------------------------------

        if (texto === "5") {
            await message.reply(
                "📄 *ATESTADOS*\n\n" +
                "Informe o que você precisa sobre o atestado."
            );

            return;
        }

        // ------------------------------------------
        // TRANSFERÊNCIAS
        // ------------------------------------------

        if (texto === "6") {
            await message.reply(
                "🔄 *TRANSFERÊNCIAS*\n\n" +
                "Informe sua dúvida ou solicitação sobre transferência."
            );

            return;
        }

        // ------------------------------------------
        // MATERIAIS
        // ------------------------------------------

        if (texto === "7") {
            await message.reply(
                "📚 *MATERIAIS*\n\n" +
                "Informe qual material você deseja consultar.\n\n" +
                "Exemplos:\n" +
                "• Material fornecido pelo Governo\n" +
                "• Material perdido\n" +
                "• Outro item"
            );

            return;
        }

        // ------------------------------------------
        // RELATÓRIO COMPORTAMENTAL
        // ------------------------------------------

        if (texto === "8") {
            await message.reply(
                "📋 *RELATÓRIO COMPORTAMENTAL*\n\n" +
                "Informe brevemente o motivo da solicitação."
            );

            return;
        }

        // ------------------------------------------
        // AGENDAR ATENDIMENTO
        // ------------------------------------------

        if (texto === "9") {
            await message.reply(
                "📅 *AGENDAR ATENDIMENTO*\n\n" +
                "Com quem você deseja falar?\n\n" +
                "1 - Pedagogo(a)\n" +
                "2 - Diretor(a)\n\n" +
                "Digite o número."
            );

            return;
        }

        // ------------------------------------------
        // SUGESTÕES
        // ------------------------------------------

        if (texto === "10") {
            await message.reply(
                "💡 *SUGESTÕES*\n\n" +
                "Escreva sua sugestão abaixo.\n\n" +
                "Ela será encaminhada para a equipe responsável."
            );

            return;
        }

        // ------------------------------------------
        // OPÇÃO INVÁLIDA
        // ------------------------------------------

        await message.reply(
            "🤔 Não reconheci essa opção.\n\n" +
            "Digite um número de *1 a 10* ou envie *Oi* para reiniciar."
        );

        return;
    }
});

client.initialize();