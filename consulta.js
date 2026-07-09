// CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = "https://slfcjvwsoyucjbymnuaw.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZmNqdndzb3l1Y2pieW1udWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NTU4NTIsImV4cCI6MjA5OTAzMTg1Mn0.rq8pFIiYozatMtKKork4gsoGyMTsi2og470stWeW05c";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const lista = document.getElementById("listaAlunos");
const total = document.getElementById("totalMatriculas");

// CARREGAR TODOS OS ALUNOS
async function carregarAlunos() {
  lista.innerHTML = "<p>Carregando alunos...</p>";

  const { data, error } = await supabaseClient
    .from("alunos")
    .select("*")
    .order("nome", { ascending: true });

  if (error) {
    console.error("Erro Supabase:", error);
    lista.innerHTML = "<p>Erro ao carregar alunos.</p>";
    return;
  }

  lista.innerHTML = "";

  if (total) {
    total.textContent = data.length;
  }

  if (data.length === 0) {
    lista.innerHTML = "<p>Nenhum aluno cadastrado.</p>";
    return;
  }

  data.forEach((aluno) => {
    lista.innerHTML += `
      <div class="aluno">
        <h3>${aluno.nome || ""}</h3>
        <p><strong>Matrícula:</strong> ${aluno.matricula || "-"}</p>
        <p><strong>Série:</strong> ${aluno.serie || "-"}</p>
        <p><strong>Turma:</strong> ${aluno.turma || "-"}</p>
        <p><strong>Responsável:</strong> ${aluno.responsavel || "-"}</p>
      </div>
    `;
  });
}

// BUSCAR POR MATRÍCULA
async function buscarAluno() {
  const matricula =
    document.getElementById("matricula").value.trim();

  if (!matricula) {
    carregarAlunos();
    return;
  }

  lista.innerHTML = "<p>Buscando...</p>";

  const { data, error } = await supabaseClient
    .from("alunos")
    .select("*")
    .eq("matricula", matricula);

  if (error) {
    console.error("Erro na busca:", error);
    lista.innerHTML = "<p>Erro na busca.</p>";
    return;
  }

  lista.innerHTML = "";

  if (data.length === 0) {
    lista.innerHTML = "<p>Nenhum aluno encontrado.</p>";
    return;
  }

  data.forEach((aluno) => {
    lista.innerHTML += `
      <div class="aluno">
        <h3>${aluno.nome || ""}</h3>
        <p><strong>Matrícula:</strong> ${aluno.matricula || "-"}</p>
        <p><strong>Série:</strong> ${aluno.serie || "-"}</p>
        <p><strong>Turma:</strong> ${aluno.turma || "-"}</p>
        <p><strong>Responsável:</strong> ${aluno.responsavel || "-"}</p>
      </div>
    `;
  });
}

function voltar() {
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  carregarAlunos();
});
