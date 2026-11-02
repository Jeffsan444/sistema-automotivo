
const API_VEICULOS = "/veiculos";
const API_MARCAS = "/marcas";

let veiculos = [];
let marcas = [];

// FUNÇÃO PARA CONSUMIR A API
async function requisicao(url, opcoes = {}) {
    const resposta = await fetch(url, {
        ...opcoes,
        headers: {
            "Content-Type": "application/json",
            ...opcoes.headers
        }
    });

    if (!resposta.ok) {
        const erro = await resposta.text();
        throw new Error(erro || `Erro HTTP ${resposta.status}`);
    }

    if (resposta.status === 204) {
        return null;
    }

    const texto = await resposta.text();
    return texto ? JSON.parse(texto) : null;
}

// PROTEÇÃO PARA EXIBIR TEXTO NA TELA
function escapar(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}

// NAVEGAÇÃO
function mostrarPagina(pagina, botao) {
    document.querySelectorAll(".pagina").forEach(elemento => {
        elemento.classList.remove("ativa");
    });

    document.getElementById(pagina).classList.add("ativa");

    document.querySelectorAll(".menu-item").forEach(elemento => {
        elemento.classList.remove("active");
    });

    if (botao) {
        botao.classList.add("active");
    }

    const titulos = {
        dashboard: "Dashboard",
        veiculos: "Gerenciamento de Veículos",
        marcas: "Gerenciamento de Marcas"
    };

    document.getElementById("tituloPagina").textContent =
        titulos[pagina];
}

function abrirPagina(pagina) {
    const botoes = document.querySelectorAll(".menu-item");
    const indice = {
        dashboard: 0,
        veiculos: 1,
        marcas: 2
    };

    mostrarPagina(pagina, botoes[indice[pagina]]);
}

// CARREGAR MARCAS
async function carregarMarcas() {
    try {
        marcas = await requisicao(API_MARCAS) || [];
        renderizarMarcas();
        preencherSelectMarcas();
        atualizarDashboard();
    } catch (erro) {
        console.error("Erro ao carregar marcas:", erro);
        alert("Não foi possível carregar as marcas. Verifique se o backend está rodando.");
    }
}

// CADASTRAR MARCA
document.getElementById("formMarca").addEventListener("submit", async function(evento) {
    evento.preventDefault();

    const nome = document.getElementById("nomeMarca").value.trim();

    if (!nome) {
        alert("Informe o nome da marca.");
        return;
    }

    try {
        await requisicao(API_MARCAS, {
            method: "POST",
            body: JSON.stringify({ nome })
        });

        alert("Marca cadastrada com sucesso!");

        this.reset();
        await carregarMarcas();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao cadastrar marca. Verifique se ela já existe.");
    }
});

// MOSTRAR MARCAS NA TABELA
function renderizarMarcas() {
    const tabela = document.getElementById("listaMarcas");

    if (marcas.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="3" class="mensagem-vazia">
                    Nenhuma marca cadastrada.
                </td>
            </tr>`;
        return;
    }

    tabela.innerHTML = marcas.map(marca => `
        <tr>
            <td>${escapar(marca.id)}</td>
            <td>${escapar(marca.nome)}</td>
            <td>
                <button class="btn-excluir"
                    onclick="excluirMarca(${Number(marca.id)})">
                    Excluir
                </button>
            </td>
        </tr>
    `).join("");
}

// PREENCHER SELECT DE MARCAS
function preencherSelectMarcas() {
    const select = document.getElementById("marcaVeiculo");

    select.innerHTML = `
        <option value="">Selecione uma marca</option>
    `;

    marcas.forEach(marca => {
        select.innerHTML += `
            <option value="${Number(marca.id)}">
                ${escapar(marca.nome)}
            </option>
        `;
    });
}

// EXCLUIR MARCA
async function excluirMarca(id) {
    if (!confirm("Deseja realmente excluir esta marca?")) {
        return;
    }

    try {
        await requisicao(`${API_MARCAS}/${id}`, {
            method: "DELETE"
        });

        alert("Marca excluída com sucesso!");
        await carregarMarcas();

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível excluir. Verifique se existem veículos vinculados a esta marca.");
    }
}

// CARREGAR VEÍCULOS
async function carregarVeiculos() {
    try {
        veiculos = await requisicao(API_VEICULOS) || [];
        renderizarVeiculos();
        atualizarDashboard();
    } catch (erro) {
        console.error("Erro ao carregar veículos:", erro);
        alert("Não foi possível carregar os veículos.");
    }
}

// CADASTRAR VEÍCULO
document.getElementById("formVeiculo").addEventListener("submit", async function(evento) {
    evento.preventDefault();

    const marcaId = Number(document.getElementById("marcaVeiculo").value);

    if (!marcaId) {
        alert("Selecione uma marca.");
        return;
    }

    const veiculo = {
        modelo: document.getElementById("modelo").value.trim(),
        placa: document.getElementById("placa").value.trim().toUpperCase(),
        cor: document.getElementById("cor").value.trim(),
        ano: Number(document.getElementById("ano").value),
        preco: Number(document.getElementById("preco").value),
        marca: {
            id: marcaId
        },
        status: document.getElementById("status").value
    };

    try {
        await requisicao(API_VEICULOS, {
            method: "POST",
            body: JSON.stringify(veiculo)
        });

        alert("Veículo cadastrado com sucesso!");

        this.reset();

        await carregarVeiculos();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao cadastrar veículo. Confira os dados e a associação com a marca.");
    }
});

// MOSTRAR VEÍCULOS NA TABELA
function renderizarVeiculos(lista = veiculos) {
    const tabela = document.getElementById("listaVeiculos");

    if (lista.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="8" class="mensagem-vazia">
                    Nenhum veículo cadastrado.
                </td>
            </tr>`;
        return;
    }

    tabela.innerHTML = lista.map(veiculo => {
        const marcaNome = veiculo.marca
            ? veiculo.marca.nome
            : "Sem marca";

        const preco = Number(veiculo.preco || 0).toLocaleString(
            "pt-BR",
            { style: "currency", currency: "BRL" }
        );

        return `
            <tr>
                <td>${escapar(veiculo.id)}</td>
                <td>${escapar(veiculo.modelo)}</td>
                <td>${escapar(veiculo.placa)}</td>
                <td>${escapar(marcaNome)}</td>
                <td>${escapar(veiculo.ano)}</td>
                <td>${preco}</td>
                <td>${escapar(veiculo.status)}</td>
                <td>
                    <button class="btn-excluir"
                        onclick="excluirVeiculo(${Number(veiculo.id)})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

// PESQUISAR VEÍCULOS
function filtrarVeiculos() {
    const pesquisa = document.getElementById("pesquisaVeiculo")
        .value.toLowerCase();

    const filtrados = veiculos.filter(veiculo =>
        String(veiculo.modelo || "").toLowerCase().includes(pesquisa) ||
        String(veiculo.placa || "").toLowerCase().includes(pesquisa)
    );

    renderizarVeiculos(filtrados);
}

// EXCLUIR VEÍCULO
async function excluirVeiculo(id) {
    if (!confirm("Deseja realmente excluir este veículo?")) {
        return;
    }

    try {
        await requisicao(`${API_VEICULOS}/${id}`, {
            method: "DELETE"
        });

        alert("Veículo excluído com sucesso!");
        await carregarVeiculos();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao excluir veículo.");
    }
}

// ATUALIZAR DASHBOARD
function atualizarDashboard() {
    document.getElementById("totalVeiculos").textContent =
        veiculos.length;

    document.getElementById("totalMarcas").textContent =
        marcas.length;
}

// INICIALIZAR SISTEMA
async function iniciarSistema() {
    await carregarMarcas();
    await carregarVeiculos();
}

document.addEventListener("DOMContentLoaded", iniciarSistema);

