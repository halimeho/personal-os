
const form = document.getElementById("terminal-form");
const input = document.getElementById("terminal-input");
const output = document.getElementById("terminal-output");

const commands = {
    help: `
Available commands:

help       - Show available commands
whoami     - About me
projects   - View my projects
skills     - My technologies
date       - Current date
clear      - Clear terminal
`,

    whoami: "A curious mind exploring technology, Linux and programming.",

    projects: "Projects directory is currently being prepared...",

    skills: "HTML | CSS | JavaScript | Python | Linux",

    date: new Date().toLocaleString()
};

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const command = input.value.trim().toLowerCase();

    if (!command) return;

    const commandLine = document.createElement("p");
    commandLine.innerHTML =
        `<span class="cyan">visitor@personal-os:~$</span> ${command}`;

    output.appendChild(commandLine);

    if (command === "clear") {
        output.innerHTML = "";
    } else {
        const response = document.createElement("p");

        response.textContent =
            commands[command] || `Command not found: ${command}`;

        output.appendChild(response);
    }

    input.value = "";
    output.scrollTop = output.scrollHeight;
});
