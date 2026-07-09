// ===============================
// FUNÇÕES DO DIÁRIO DE CLASSE
// ===============================

function calcularMedia(n1, n2) {
    n1 = Number(n1) || 0;
    n2 = Number(n2) || 0;

    return ((n1 + n2) / 2).toFixed(1);
}

function gerarSituacao(n1, n2) {
    const media = (Number(n1) + Number(n2)) / 2;

    if (media >= 7) {
        return '<span class="badge status-aprovado">Aprovado</span>';
    }

    if (media >= 5) {
        return '<span class="badge status-recuperacao">Recuperação</span>';
    }

    return '<span class="badge status-reprovado">Reprovado</span>';
}

async function carregarAlunos() {
    const tbody = document.getElementById('lista-alunos');

    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="8">Carregando alunos...</td>
        </tr>
    `;

    try {
        const { data, error } = await supabaseClient
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
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${aluno.matricula || '-'}</td>

                <td class="student-name">
                    ${aluno.nome || '-'}
                </td>

                <td>
                    <input
                        type="number"
                        class="input-nota"
                        value="${aluno.nota1 || 0}"
                        min="0"
                        max="10"
                        step="0.1"
                    >
                </td>

                <td>
                    <input
                        type="number"
                        class="input-nota"
                        value="${aluno.nota2 || 0}"
                        min="0"
                        max="10"
                        step="0.1"
                    >
                </td>

                <td class="text-center font-bold">
                    ${calcularMedia(aluno.nota1, aluno.nota2)}
                </td>

                <td>
                    <input
                        type="number"
                        class="input-frequencia"
                        value="${aluno.presencas || 0}"
                    >
                </td>

                <td>
                    <input
                        type="number"
                        class="input-frequencia"
                        value="${aluno.faltas || 0}"
                    >
                </td>

                <td class="text-center">
                    ${gerarSituacao(aluno.nota1, aluno.nota2)}
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error('Erro ao carregar alunos:', err);

        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    Erro ao carregar alunos.
                </td>
            </tr>
        `;
    }
}

// ===============================
// BUSCA PELO NOME
// ===============================
document.addEventListener('input', (e) => {
    if (e.target.id !== 'search-student') return;

    const termo = e.target.value.toLowerCase();

    document.querySelectorAll('#lista-alunos tr')
        .forEach(linha => {
            const nome = linha.querySelector('.student-name');

            if (!nome) return;

            linha.style.display =
                nome.textContent
                    .toLowerCase()
                    .includes(termo)
                    ? ''
                    : 'none';
        });
});

// ===============================
// CARREGA O DIÁRIO AUTOMATICAMENTE
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('lista-alunos')) {
        carregarAlunos();
    }
});
