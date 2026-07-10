// ==========================================
// CONFIGURAÇÃO DO SUPABASE
// ==========================================
const SUPABASE_URL = "https://slfcjvwsoyucjbymnuaw.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZmNqdndzb3l1Y2pieW1udWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NTU4NTIsImV4cCI6MjA5OTAzMTg1Mn0.rq8pFIiYozatMtKKork4gsoGyMTsi2og470stWeW05c";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// ==========================================
// QUANDO A PÁGINA CARREGAR
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    inicializarCadastro();
    inicializarConsulta();

    // Página Diário de Classe
    if (document.getElementById('lista-alunos')) {
        carregarAlunos();
    }

    // Página Relatórios
    if (document.getElementById('tabelaAlunosCorpo')) {
        carregarRelatorio();
    }
});

// ==========================================
// CADASTRO DE ALUNOS
// ==========================================
function gerarMatricula() {
    const ano = new Date().getFullYear();
    const numero = Date.now().toString().slice(-6);

    return `${ano}${numero}`;
}
function inicializarCadastro() {
    const formCadastro =
        document.querySelector('.formulario-cadastro');

    if (!formCadastro) return;

    formCadastro.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData =
            new FormData(formCadastro);

        const dadosAluno =
            Object.fromEntries(formData.entries());

        // GERA MATRÍCULA AUTOMÁTICA
        dadosAluno.matricula = gerarMatricula();

        try {
            const { error } = await supabaseClient
                .from('alunos')
                .insert([dadosAluno]);

            if (error) throw error;

            alert(
                `Aluno cadastrado com sucesso!\nMatrícula: ${dadosAluno.matricula}`
            );

            formCadastro.reset();

        } catch (err) {
            console.error(err);
            alert('Erro ao salvar: ' + err.message);
        }
    });
}

// ==========================================
// CONSULTA DE ALUNOS
// ==========================================
function inicializarConsulta() {
    const formBusca =
        document.getElementById('searchForm');

    if (!formBusca) return;

    formBusca.addEventListener('submit', async (e) => {
        e.preventDefault();

        const matricula =
            document.getElementById('matriculaInput')
                .value
                .trim();

        const resultado =
            document.getElementById('resultadoBusca');

        const erro =
            document.getElementById('erroBusca');

        try {
            const { data, error: consultaError }
                = await supabaseClient
                    .from('alunos')
                    .select('*')
                    .eq('matricula', matricula)
                    .maybeSingle();

            if (consultaError) throw consultaError;

            if (!data) {
                resultado.classList.add('hidden');
                erro.classList.remove('hidden');
                return;
            }

            document.getElementById('alunoNome')
                .textContent = data.nome || '-';

            document.getElementById('alunoMatricula')
                .textContent = data.matricula || '-';

            document.getElementById('alunoCurso')
                .textContent = data.turma || '-';

            document.getElementById('alunoEmail')
                .textContent =
                    data.responsavel || '-';

            document.getElementById('alunoTelefone')
                .textContent =
                    data.telefone_1 || '-';

            if (data.data_nascimento) {
                document.getElementById('alunoDataNasc')
                    .textContent =
                        data.data_nascimento
                            .split('-')
                            .reverse()
                            .join('/');
            }

            const status =
                document.getElementById('alunoStatus');

            if (status) {
                status.textContent =
                    data.status || 'Ativo';
            }

            resultado.classList.remove('hidden');
            erro.classList.add('hidden');

        } catch (err) {
            console.error(err);
            alert('Erro na busca: ' + err.message);
        }
    });
}

// ==========================================
// LOGIN
// ==========================================
function handleLogin(event) {
    event.preventDefault();

    const email =
        document.getElementById('email').value.trim();

    const senha =
        document.getElementById('password').value;

    const erro =
        document.getElementById('error-message');

    const adminEmail =
        'dinamicanatan0@gmail.com';

    const adminSenha =
        'cursotecnico';

    if (
        email === adminEmail &&
        senha === adminSenha
    ) {
        if (erro) {
            erro.classList.add('hidden');
        }

        alert('Login efetuado com sucesso!');
        window.location.href = 'diario.html';

    } else {
        if (erro) {
            erro.classList.remove('hidden');
        }
    }
}

// ==========================================
// DIÁRIO DE CLASSE
// ==========================================
function calcularMedia(n1, n2) {
    n1 = Number(n1) || 0;
    n2 = Number(n2) || 0;

    return ((n1 + n2) / 2).toFixed(1);
}

function gerarSituacao(n1, n2) {
    const media =
        (Number(n1) + Number(n2)) / 2;

    if (media >= 7) {
        return '<span class="badge status-aprovado">Aprovado</span>';
    }

    if (media >= 5) {
        return '<span class="badge status-recuperacao">Recuperação</span>';
    }

    return '<span class="badge status-reprovado">Reprovado</span>';
}

async function carregarAlunos() {
    const tbody =
        document.getElementById('lista-alunos');

    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="8">
                Carregando alunos...
            </td>
        </tr>
    `;

    try {
        const { data, error } =
            await supabaseClient
                .from('alunos')
                .select('*')
                .order('nome');

        if (error) throw error;

        tbody.innerHTML = '';

        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8">
                        Nenhum aluno cadastrado.
                    </td>
                </tr>
            `;
            return;
        }

        data.forEach(aluno => {
            const tr =
                document.createElement('tr');

            tr.innerHTML = `
                <td>${aluno.matricula || '-'}</td>

                <td class="student-name">
                    ${aluno.nome || '-'}
                </td>

                <td>
                    <input
                        type="number"
                        class="input-nota"
                        value="${aluno.nota1 || 0}">
                </td>

                <td>
                    <input
                        type="number"
                        class="input-nota"
                        value="${aluno.nota2 || 0}">
                </td>

                <td class="text-center font-bold">
                    ${calcularMedia(
                        aluno.nota1,
                        aluno.nota2
                    )}
                </td>

                <td>
                    <input
                        type="number"
                        class="input-frequencia"
                        value="${aluno.presencas || 0}">
                </td>

                <td>
                    <input
                        type="number"
                        class="input-frequencia"
                        value="${aluno.faltas || 0}">
                </td>

                <td class="text-center">
                    ${gerarSituacao(
                        aluno.nota1,
                        aluno.nota2
                    )}
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error(err);

        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    Erro ao carregar alunos.
                </td>
            </tr>
        `;
    }
}

// ==========================================
// BUSCA NO DIÁRIO
// ==========================================
document.addEventListener('input', (e) => {
    if (e.target.id !== 'search-student') {
        return;
    }

    const termo =
        e.target.value.toLowerCase();

    document
        .querySelectorAll('#lista-alunos tr')
        .forEach(linha => {
            const nome =
                linha.querySelector('.student-name');

            if (!nome) return;

            linha.style.display =
                nome.textContent
                    .toLowerCase()
                    .includes(termo)
                    ? ''
                    : 'none';
        });
});
// ==========================================
// RELATÓRIO GERAL
// ==========================================
async function carregarRelatorio() {
    const totalAlunos =
        document.getElementById("totalAlunos");

    const tabela =
        document.getElementById("tabelaAlunosCorpo");

    if (!totalAlunos || !tabela) return;

    try {
        const { data, error } =
            await supabaseClient
                .from("alunos")
                .select("*")
                .order("nome");

        if (error) throw error;

        // ==========================
        // CARDS
        // ==========================
        totalAlunos.textContent = data.length;

        const ativos = data.filter(
            a => (a.status || "Ativo") === "Ativo"
        ).length;

        document.getElementById(
            "alunosAtivos"
        ).textContent = ativos;

        const turmas = [
            ...new Set(
                data
                    .map(a => a.turma)
                    .filter(Boolean)
            )
        ];

        document.getElementById(
            "totalTurmas"
        ).textContent = turmas.length;

        const aprovados = data.filter(a => {
            const media =
                (
                    (Number(a.nota1) || 0) +
                    (Number(a.nota2) || 0)
                ) / 2;

            return media >= 7;
        }).length;

        document.getElementById(
            "aprovados"
        ).textContent = aprovados;

        // ==========================
        // MÉDIA GERAL
        // ==========================
        let soma = 0;

        data.forEach(a => {
            soma += (
                (Number(a.nota1) || 0) +
                (Number(a.nota2) || 0)
            ) / 2;
        });

        const mediaGeral =
            data.length > 0
                ? (soma / data.length).toFixed(1)
                : "0.0";

        document.getElementById(
            "mediaGeral"
        ).textContent = mediaGeral;

        // ==========================
        // TAXA DE APROVAÇÃO
        // ==========================
        const percentual =
            data.length > 0
                ? (aprovados / data.length) * 100
                : 0;

        document.getElementById(
            "barraAprovacao"
        ).style.width =
            percentual + "%";

        document.getElementById(
            "textoAprovacao"
        ).textContent =
            percentual.toFixed(1) +
            "% dos alunos aprovados";

        // ==========================
        // TABELA
        // ==========================
        tabela.innerHTML = "";

        data.forEach(aluno => {
            tabela.innerHTML += `
                <tr>
                    <td>${aluno.matricula || "-"}</td>
                    <td>${aluno.nome || "-"}</td>
                    <td>${aluno.turma || "-"}</td>
                    <td>${aluno.responsavel || "-"}</td>
                    <td>
                        <span class="badge-status status-ativo">
                            ${aluno.status || "Ativo"}
                        </span>
                    </td>
                </tr>
            `;
        });

        // ==========================
        // ÚLTIMOS CADASTROS
        // ==========================
        const lista =
            document.getElementById(
                "ultimosAlunos"
            );

        if (lista) {
            lista.innerHTML = "";

            data
                .slice(-5)
                .reverse()
                .forEach(aluno => {
                    lista.innerHTML += `
                        <li>
                            <strong>${aluno.nome}</strong>
                            <br>
                            ${aluno.turma || "-"}
                        </li>
                    `;
                });
        }

        // ==========================
        // ALUNOS POR TURMA
        // ==========================
        const alunosPorTurma = {};

        data.forEach(aluno => {
            const turma =
                aluno.turma || "Sem turma";

            alunosPorTurma[turma] =
                (alunosPorTurma[turma] || 0) + 1;
        });

        const canvasTurmas =
            document.getElementById(
                "graficoTurmas"
            );

        if (canvasTurmas) {
            new Chart(canvasTurmas, {
                type: "doughnut",
                data: {
                    labels:
                        Object.keys(
                            alunosPorTurma
                        ),
                    datasets: [{
                        data:
                            Object.values(
                                alunosPorTurma
                            )
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            });
        }

        // ==========================
        // MATRÍCULAS POR MÊS
        // ==========================
        const meses = [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dez"
        ];

        const matriculasMes =
            Array(12).fill(0);

        data.forEach(aluno => {
            if (!aluno.created_at)
                return;

            const mes =
                new Date(
                    aluno.created_at
                ).getMonth();

            matriculasMes[mes]++;
        });

        const canvasMatriculas =
            document.getElementById(
                "graficoMatriculas"
            );

        if (canvasMatriculas) {
            new Chart(
                canvasMatriculas,
                {
                    type: "bar",
                    data: {
                        labels: meses,
                        datasets: [{
                            label:
                                "Matrículas",
                            data:
                                matriculasMes
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero:
                                    true
                            }
                        }
                    }
                }
            );
        }

    } catch (err) {
        console.error(err);

        tabela.innerHTML = `
            <tr>
                <td colspan="5">
                    Erro ao carregar dados.
                </td>
            </tr>
        `;
    }
}
