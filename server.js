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

client.on("ready", () => {
    console.log("✅ CEEP Conecta conectado ao WhatsApp!");
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
            responsavel: ""
        };
    }

    const usuario = usuarios[numero];

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
        usuarios[numero] = {
            etapa: "nome",
            nome: "",
            turma: "",
            responsavel: ""
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
    // MENU PRINCIPAL
    // ==========================================

    if (usuario.etapa === "menu") {

        if (texto === "1") {
            await message.reply(
                "📚 *MATRÍCULAS*\n\n" +
                "Em que podemos ajudar?\n\n" +
                "1 - Matrícula\n" +
                "2 - Rematrícula\n" +
                "3 - Dúvidas sobre matrícula\n\n" +
                "Digite o número da opção."
            );
            return;
        }

        if (texto === "2") {
            await message.reply(
                "⚠️ *RECLAMAÇÕES*\n\n" +
                "Descreva brevemente o que aconteceu.\n\n" +
                "Sua solicitação será encaminhada para a equipe responsável."
            );
            return;
        }

        if (texto === "3") {
            await message.reply(
                "📊 *NOTAS*\n\n" +
                "Informe sobre qual disciplina ou situação você deseja atendimento."
            );
            return;
        }

        if (texto === "4") {
            await message.reply(
                "📅 *FALTAS*\n\n" +
                "Informe a situação relacionada às faltas do aluno."
            );
            return;
        }

        if (texto === "5") {
            await message.reply(
                "📄 *ATESTADOS*\n\n" +
                "Informe o que você precisa sobre o atestado."
            );
            return;
        }

        if (texto === "6") {
            await message.reply(
                "🔄 *TRANSFERÊNCIAS*\n\n" +
                "Informe sua dúvida ou solicitação sobre transferência."
            );
            return;
        }

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

        if (texto === "8") {
            await message.reply(
                "📋 *RELATÓRIO COMPORTAMENTAL*\n\n" +
                "Informe brevemente o motivo da solicitação."
            );
            return;
        }

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

        if (texto === "10") {
            await message.reply(
                "💡 *SUGESTÕES*\n\n" +
                "Escreva sua sugestão abaixo.\n\n" +
                "Ela será encaminhada para a equipe responsável."
            );
            return;
        }

        await message.reply(
            "🤔 Não reconheci essa opção.\n\n" +
            "Digite um número de *1 a 10* ou envie *Oi* para reiniciar."
        );

        return;
    }
});

client.initialize();