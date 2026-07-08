// CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = "https://slfcjvwsoyucjbymnuaw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZmNqdndzb3l1Y2pieW1udWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NTU4NTIsImV4cCI6MjA5OTAzMTg1Mn0.rq8pFIiYozatMtKKork4gsoGyMTsi2og470stWeW05c";

// Inicializa o cliente do Supabase utilizando uma constante única para evitar conflitos
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. LÓGICA DE CADASTRO ===
    const formCadastro = document.querySelector('.formulario-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede o navegador de recarregar a página (Evita Erro 405)

            const formData = new FormData(formCadastro);
            const dadosAluno = Object.fromEntries(formData.entries());

            try {
                const { data, error } = await supabaseClient
                    .from('alunos')
                    .insert([dadosAluno]);

                if (error) throw error;

                alert('Aluno cadastrado com sucesso!');
                formCadastro.reset(); // Limpa o formulário após o sucesso
            } catch (err) {
                alert('Erro ao salvar no Supabase: ' + err.message);
                console.error('Detalhes do erro:', err);
            }
        });
    }

    // === 2. LÓGICA DE CONSULTA ===
    const formBusca = document.getElementById('searchForm');
    if (formBusca) {
        formBusca.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede o recarregamento da página durante a busca
            
            const matricula = document.getElementById('matriculaInput').value.trim();
            const resultado = document.getElementById('resultadoBusca');
            const erro = document.getElementById('erroBusca');

            try {
                const { data, error } = await supabaseClient
                    .from('alunos')
                    .select('*')
                    .eq('matricula', matricula)
                    .maybeSingle(); // Retorna o objeto do aluno ou nulo se não encontrar

                if (error) throw error;

                if (data) {
                    // Preenche as informações textuais correspondentes no HTML
                    document.getElementById('alunoNome').textContent = data.nome;
                    document.getElementById('alunoMatricula').textContent = data.matricula;
                    document.getElementById('alunoCurso').textContent = data.turma;
                    
                    // Vincula o nome do responsável ao campo correspondente na interface
                    document.getElementById('alunoEmail').textContent = data.responsavel || '-';
                    
                    // Garante a exibição do status padrão caso não exista na coluna
                    const statusBadge = document.getElementById('alunoStatus');
                    if (statusBadge) {
                        statusBadge.textContent = data.status || 'Ativo';
                    }

                    // Formata a data de nascimento de (AAAA-MM-DD) para (DD/MM/AAAA)
                    if (data.data_nascimento) {
                        const dataFormatada = data.data_nascimento.split('-').reverse().join('/');
                        document.getElementById('alunoDataNasc').textContent = dataFormatada;
                    } else {
                        document.getElementById('alunoDataNasc').textContent = '-';
                    }
                    
                    document.getElementById('alunoTelefone').textContent = data.telefone_1;
                    
                    // Exibe o painel de resultados e oculta a mensagem de erro
                    resultado.classList.remove('hidden');
                    erro.classList.add('hidden');
                } else {
                    // Se o aluno não for localizado, oculta o resultado e exibe o alerta
                    resultado.classList.add('hidden');
                    erro.classList.remove('hidden');
                }
            } catch (err) {
                alert('Erro na busca: ' + err.message);
                console.error(err);
            }
        });
    }
});

// === 3. FUNÇÃO DE LOGIN ===
// Fica fora do DOMContentLoaded para que o "onsubmit" do HTML consiga enxergar a função globalmente
function handleLogin(event) {
    event.preventDefault(); // Evita que a página recarregue ao clicar em enviar

    const emailInput = document.getElementById('email').value.trim();
    const passwordInput = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Credenciais que você definiu para o grupo
    const adminEmail = "dinamicanatan0@gmail.com";
    const adminPassword = "cursotecnico";

    if (emailInput === adminEmail && passwordInput === adminPassword) {
        if (errorMessage) errorMessage.classList.add('hidden');
        
        alert('Login efetuado com sucesso!');
        // Redireciona o administrador para a página do diário de classe do grupo
        window.location.href = "diario.html"; 
    } else {
        if (errorMessage) errorMessage.classList.remove('hidden');
    }
}
