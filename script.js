function updateClock() {
    const now = new Date();
    const locale = localStorage.getItem("personal-os-language") === "en"
        ? "en-US" : "pt-BR";

    document.getElementById("clock").textContent =
        now.toLocaleTimeString(locale);
    document.getElementById("date").textContent =
        now.toLocaleDateString(locale);
}
updateClock();
setInterval(updateClock, 1000);

// OPEN WINDOWS
let highestZ = 10;

function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    win.classList.remove("minimized", "closing");
    win.classList.add("active");
    win.style.zIndex = ++highestZ;

    if (id === "terminal") {
        setTimeout(() => {
            document.getElementById("terminal-input").focus();
        }, 50);
    }
}

document.querySelectorAll("[data-window]").forEach(button => {
    button.addEventListener("click", () => {
        openWindow(button.dataset.window);
    });
});

// CLOSE WINDOWS
document.querySelectorAll(".close-window").forEach(button => {
    button.addEventListener("click", () => {
        const win = button.closest(".window");
        if (!win || !win.classList.contains("active")) return;

        win.classList.add("closing");
        setTimeout(() => {
            win.classList.remove("active", "closing");
        }, 190);
    });
});

// DRAG WINDOWS
document.querySelectorAll(".window").forEach(win => {
    const header = win.querySelector(".window-header");
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener("pointerdown", event => {
        if (event.target.closest("button")) return;

        dragging = true;
        const rect = win.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        win.style.transform = "none";
        win.style.left = rect.left + "px";
        win.style.top = rect.top + "px";
        win.style.zIndex = ++highestZ;
        header.setPointerCapture(event.pointerId);
    });

    header.addEventListener("pointermove", event => {
        if (!dragging) return;
        win.style.left = event.clientX - offsetX + "px";
        win.style.top = event.clientY - offsetY + "px";
    });

    header.addEventListener("pointerup", () => {
        dragging = false;
    });
});


// TERMINAL COMMANDS + MULTILANGUAGE

const input = document.getElementById("terminal-input");
const output = document.getElementById("terminal-output");
const languageButtons = document.querySelectorAll(".language-button");

let currentLanguage = localStorage.getItem("personal-os-language") || "pt";

let terminalTypingQueue = Promise.resolve();
let terminalGeneration = 0;

function printLine(text) {
    const generation = terminalGeneration;

    terminalTypingQueue = terminalTypingQueue.then(async () => {
        if (generation !== terminalGeneration) return;

        const p = document.createElement("p");
        output.appendChild(p);

        const tokens = String(text).match(/\\s+|[^\\s]+/g) || [""];

        for (const token of tokens) {
            if (generation !== terminalGeneration) return;

            if (/^\\s+$/.test(token)) {
                p.appendChild(document.createTextNode(token));
                continue;
            }

            const word = document.createElement("span");
            word.className = "terminal-word";
            word.textContent = token;
            p.appendChild(word);

            requestAnimationFrame(() => word.classList.add("visible"));

            await new Promise(resolve => setTimeout(resolve, 55));

            const body = document.querySelector(".terminal-body");
            if (body) body.scrollTop = body.scrollHeight;
        }
    });
}


const interfaceTranslations = {
    pt: {
        status: "online",
        system: "sistema humano baseado em Arch",
        description: "só mais uma pessoa explorando o universo digital.",
        identity: "mente curiosa · alma criativa · desenvolvedora em formação",
        directories: "DIRETÓRIOS",
        aboutDescription: "quem sou eu?",
        musicDescription: "meu universo musical",
        musicTitle: "Meu mundo musical",
        musicIntro: "Um pouco do que vive nos meus fones.",
        musicPlaylistTitle: "todos os caminhos levam ao rock alternativo melancólico",
        musicPlaylistMeta: "Playlist do Spotify · Halime",
        musicGenresTitle: "GÊNEROS FAVORITOS",
        musicQuote: "mais do que apenas música de fundo.",
        projectsDescription: "coisas que eu criei",
        contactDescription: "diga olá",
        terminalDescription: "executar comandos",
        footer: "feito com curiosidade",
        aboutTitle: "Sobre mim",
        aboutText: "Oi! Eu sou a Halime, tenho 18 anos, sou neurodivergente e estudante de Ciência da Computação.",
        aboutHobbies: "Fora da programação, gosto de pintar, jogar e ler. São formas de expressar minha criatividade, descobrir novas perspectivas e encontrar inspiração.",
        aboutCurrent: "Atualmente, estou explorando o desenvolvimento web, a programação e o desenvolvimento de jogos, transformando minhas ideias em projetos reais.",
        aboutExtra: "Ainda tenho muito a aprender, mas acredito que essa é a parte mais interessante: estar sempre descobrindo, criando e evoluindo.",
        aboutSignature: "just a human being with too many ideas and a terminal open.",
        projectsTitle: "Meus projetos",
        projectOne: "01. Personal OS — este site.",
        projectTwo: "02. Little Oddities — um jogo aconchegante no Roblox.",
        projectsExtra: "Mais projetos em breve...",
        contactTitle: "Entre em contato",
        contactText: "Quer conversar sobre algum projeto?",
        contactExtra: "Você pode me encontrar por aqui:",
        contactInstagram: "Instagram",
        contactDiscord: "Discord",
        contactEmail: "E-mail",
        copyLabel: "copiar",
        terminalWelcome: "Personal OS [Versão 1.0]"
    },
    en: {
        status: "running",
        system: "arch-based human system",
        description: "just another human exploring the digital universe.",
        identity: "curious mind · creative soul · aspiring developer",
        directories: "DIRECTORIES",
        aboutDescription: "who am i?",
        musicDescription: "my musical world",
        musicTitle: "My musical world",
        musicIntro: "A little bit of what lives in my headphones.",
        musicPlaylistTitle: "todos os caminhos levam ao rock alternativo melancólico",
        musicPlaylistMeta: "Spotify playlist · Halime",
        musicGenresTitle: "FAVORITE GENRES",
        musicQuote: "more than background noise.",
        projectsDescription: "things i've made",
        contactDescription: "say hello",
        terminalDescription: "execute commands",
        footer: "made with curiosity",
        aboutTitle: "About me",
        aboutText: "Hi! I'm Halime, 18 years old, neurodivergent and a Computer Science student.",
        aboutHobbies: "Outside programming, I enjoy painting, gaming and reading. They are ways to express my creativity, discover new perspectives and find inspiration.",
        aboutCurrent: "Right now, I'm exploring web development, programming and game development, turning my ideas into real projects.",
        aboutExtra: "I still have a lot to learn, but I believe that's the most interesting part: constantly discovering, creating and evolving.",
        aboutSignature: "just a human being with too many ideas and a terminal open.",
        projectsTitle: "My projects",
        projectOne: "01. Personal OS — this website.",
        projectTwo: "02. Little Oddities — a cozy Roblox game.",
        projectsExtra: "More projects coming soon...",
        contactTitle: "Get in touch",
        contactText: "Want to talk about a project?",
        contactExtra: "You can find me here:",
        contactInstagram: "Instagram",
        contactDiscord: "Discord",
        contactEmail: "Email",
        copyLabel: "copy",
        terminalWelcome: "Personal OS [Version 1.0]"
    }
};

function setLanguage(language) {
    currentLanguage = language;
    localStorage.setItem("personal-os-language", language);

    languageButtons.forEach(button => {
        button.classList.toggle("active", button.dataset.lang === language);
    });

    document.documentElement.lang = language === "pt" ? "pt-BR" : "en";

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;
        const translation = interfaceTranslations[language][key];

        if (translation !== undefined) {
            element.textContent = translation;
        }
    });

    updateClock();
}

languageButtons.forEach(button => {
    button.addEventListener("click", () => {
        setLanguage(button.dataset.lang);
        printLine(languageMessages[currentLanguage].changed);
    });
});

const languageMessages = {
    pt: {
        changed: "Idioma alterado para português.",
        help: "Comandos disponíveis:",
        commands: "ajuda/help | quem-sou-eu/whoami | sobre/about | projetos/projects | contato/contact | jogos/games | computador/pc | perifericos/peripherals | redes/social | sistema/neofetch | data/date | limpar/clear | sair/exit",
        identity: "mente curiosa · alma criativa · desenvolvedora em formação",
        about: "Abrindo about.txt...",
        projects: "Abrindo projects/...",
        contact: "Abrindo contact.sh...",
        games: "~/games — JOGOS FAVORITOS",
        gamesCount: "9 jogos na minha lista de favoritos.",
        pc: "~/system — INFORMAÇÕES DO SISTEMA",
        peripherals: "~/hardware — MEUS PERIFÉRICOS",
        social: "~/social — MINHAS REDES",
        unknown: "comando não encontrado: ",
        hint: "Digite 'ajuda' para ver os comandos disponíveis.",
        monitor: "Ainda não informado",
        date: "Data e hora:"
    },
    en: {
        changed: "Language changed to English.",
        help: "Available commands:",
        commands: "help/ajuda | whoami/quem-sou-eu | about/sobre | projects/projetos | contact/contato | games/jogos | pc/computador | peripherals/perifericos | social/redes | neofetch/sistema | date/data | clear/limpar | exit/sair",
        identity: "curious mind · creative soul · aspiring developer",
        about: "Opening about.txt...",
        projects: "Opening projects/...",
        contact: "Opening contact.sh...",
        games: "~/games — FAVORITE GAMES",
        gamesCount: "9 games in my favorites list.",
        pc: "~/system — SYSTEM INFORMATION",
        peripherals: "~/hardware — MY PERIPHERALS",
        social: "~/social — MY SOCIAL LINKS",
        unknown: "command not found: ",
        hint: "Type 'help' to see the available commands.",
        monitor: "Not informed yet",
        date: "Date and time:"
    }
};

const aliases = {
    "help": "help", "ajuda": "help",
    "whoami": "whoami", "quem-sou-eu": "whoami",
    "about": "about", "sobre": "about",
    "projects": "projects", "projetos": "projects",
    "contact": "contact", "contato": "contact",
    "games": "games", "jogos": "games",
    "pc": "pc", "computador": "pc",
    "peripherals": "peripherals", "perifericos": "peripherals",
    "social": "social", "redes": "social",
    "neofetch": "neofetch", "fastfetch": "neofetch", "sistema": "neofetch",
    "date": "date", "data": "date",
    "clear": "clear", "limpar": "clear",
    "exit": "exit", "sair": "exit"
};

function normalizeCommand(value) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

setLanguage(currentLanguage);

input.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;

    const typedCommand = input.value.trim().toLowerCase();
    const command = normalizeCommand(typedCommand);

    printLine("halime@personal-os:~$ " + typedCommand);
    input.value = "";

    const cmd = aliases[command] || command;
    const t = languageMessages[currentLanguage];
    const english = currentLanguage === "en";

    switch (cmd) {
        case "help":
            printLine(t.help);
            printLine(t.commands);
            break;

        case "whoami":
            printLine(t.identity);
            break;

        case "about":
            openWindow("about");
            printLine(t.about);
            break;

        case "projects":
            openWindow("projects");
            printLine(t.projects);
            break;

        case "contact":
            openWindow("contact");
            printLine(t.contact);
            break;

        case "games": {
            const games = english ? [
                "FAVORITE GAMES",
                "[01] Resident Evil 4",
                "[02] A Hat in Time",
                "[03] Resident Evil Village",
                "[04] Portal 2",
                "[05] Minecraft",
                "[06] No, I'm not a Human",
                "[07] Little Nightmares",
                "[08] Overcooked! 2",
                "[09] Detroit: Become Human"
            ] : [
                "JOGOS FAVORITOS",
                "[01] Resident Evil 4",
                "[02] A Hat in Time",
                "[03] Resident Evil Village",
                "[04] Portal 2",
                "[05] Minecraft",
                "[06] No, I'm not a Human",
                "[07] Little Nightmares",
                "[08] Overcooked! 2",
                "[09] Detroit: Become Human"
            ];

            printLine("");
            printLine(t.games);
            printLine("--------------------------------");
            games.slice(1).forEach(printLine);
            printLine("--------------------------------");
            printLine(t.gamesCount);
            break;
        }

        case "pc": {
            printLine("");
            printLine(t.pc);
            printLine("--------------------------------");

            const pcInfo = english ? [
                "Operating System    : Arch Linux",
                "Processor           : AMD Ryzen 7 5700X",
                "Graphics Card       : AMD Radeon RX 7600",
                "Memory              : 16 GB",
                "SSD                 : 1 TB",
                "HDD                 : 1 TB",
                "Monitor             : " + t.monitor,
                "Desktop Environment : KDE Plasma",
                "Shell               : zsh"
            ] : [
                "Sistema operacional : Arch Linux",
                "Processador         : AMD Ryzen 7 5700X",
                "Placa de vídeo      : AMD Radeon RX 7600",
                "Memória RAM         : 16 GB",
                "SSD                 : 1 TB",
                "HD                  : 1 TB",
                "Monitor             : " + t.monitor,
                "Ambiente gráfico    : KDE Plasma",
                "Shell               : zsh"
            ];

            pcInfo.forEach(printLine);
            printLine("--------------------------------");
            break;
        }

        case "peripherals": {
            printLine("");
            printLine(t.peripherals);
            printLine("--------------------------------");

            const peripherals = english ? [
                "Keyboard     : AULA F75",
                "Headset      : FIFINE H9",
                "Mouse        : FuryCube R7",
                "Microphone   : Maono DGM20",
                "Mousepad     : Apex Control Titorion",
                "Speakers     : Creative Pebble SE 2.0"
            ] : [
                "Teclado      : AULA F75",
                "Headset      : FIFINE H9",
                "Mouse        : FuryCube R7",
                "Microfone    : Maono DGM20",
                "Mousepad     : Apex Control Titorion",
                "Caixa de som : Creative Pebble SE 2.0"
            ];

            peripherals.forEach(printLine);
            printLine("--------------------------------");
            break;
        }

        case "social": {
            printLine("");
            printLine(t.social);
            printLine("--------------------------------");

            const social = english ? [
                "Instagram : @halime.hossen",
                "           instagram.com/halime.hossen",
                "",
                "Steam     : halimehossen",
                "           steamcommunity.com/id/halimehossen/",
                "",
                "Twitter/X : @amebaa_hd",
                "           x.com/amebaa_hd",
                "",
                "Discord   : hhossen_"
            ] : [
                "Instagram : @halime.hossen",
                "           instagram.com/halime.hossen",
                "",
                "Steam     : halimehossen",
                "           steamcommunity.com/id/halimehossen/",
                "",
                "Twitter/X : @amebaa_hd",
                "           x.com/amebaa_hd",
                "",
                "Discord   : hhossen_"
            ];

            social.forEach(printLine);
            printLine("--------------------------------");
            break;
        }

        case "neofetch": {
            printLine("");
            printLine("       /\\       halime@personal-os");
            printLine("      /  \\      -------------------");
            printLine("     / /\\ \\     " + (english ? "OS: Arch Linux" : "SO: Arch Linux"));
            printLine("    / ____ \\    " + (english ? "Host: Personal OS" : "Host: Personal OS"));
            printLine("   /_/    \\_\\   " + (english ? "CPU: Ryzen 7 5700X" : "CPU: Ryzen 7 5700X"));
            printLine("                " + (english ? "GPU: Radeon RX 7600" : "GPU: Radeon RX 7600"));
            printLine("                " + (english ? "RAM: 16 GB" : "RAM: 16 GB"));
            printLine("                " + (english ? "Desktop Environment: KDE Plasma" : "Ambiente gráfico: KDE Plasma"));
            printLine("                " + (english ? "Shell: zsh" : "Shell: zsh"));
            printLine("                " + (english ? "Theme: Black / Cyan" : "Tema: Preto / Ciano"));
            printLine("");
            break;
        }

        case "date":
            printLine(t.date + " " + new Date().toLocaleString(english ? "en-US" : "pt-BR"));
            break;

        case "clear":
            terminalGeneration++;
            terminalTypingQueue = Promise.resolve();
            output.innerHTML = "";
            break;

        case "exit":
            document.getElementById("terminal").classList.remove("active");
            break;

        case "":
            break;

        default:
            printLine(t.unknown + typedCommand);
            printLine(t.hint);
    }

    const body = document.querySelector(".terminal-body");
    body.scrollTop = body.scrollHeight;
});


// COPY DISCORD USERNAME
document.querySelectorAll("[data-copy]").forEach(button => {
    button.addEventListener("click", async () => {
        const label = button.querySelector("[data-copy-label]");
        const original = currentLanguage === "en" ? "copy" : "copiar";

        try {
            await navigator.clipboard.writeText(button.dataset.copy);
            label.textContent = currentLanguage === "en" ? "copied!" : "copiado!";
            setTimeout(() => {
                label.textContent = original;
            }, 1600);
        } catch {
            label.textContent = currentLanguage === "en" ? "copy failed" : "erro ao copiar";
        }
    });
});
