class Tarefa {
  constructor(titulo, inicio, fim, responsavel, prioridade, observacao, disciplina = "", tipoAvaliacao = "", feita = false, id = null) {
    this.id = id || Date.now();
    this.titulo = titulo;
    this.inicio = inicio;
    this.fim = fim;
    this.responsavel = responsavel;
    this.prioridade = prioridade;
    this.observacao = observacao;
    this.disciplina = disciplina;
    this.tipoAvaliacao = tipoAvaliacao;
    this.feita = feita;
  }
}

let tarefas = [];

const form = document.getElementById("formTarefa");
const titulo = document.getElementById("titulo");
const inicio = document.getElementById("inicio");
const fim = document.getElementById("fim");
const responsavel = document.getElementById("responsavel");
const prioridade = document.getElementById("prioridade");
const disciplinaEl = document.getElementById("disciplina");
const tipoAvaliacaoEl = document.getElementById("tipoAvaliacao");
const observacao = document.getElementById("observacao");
const btnSalvar = document.getElementById("btnSalvar");
const btnRecuperar = document.getElementById("btnRecuperar");
const btnLimpar = document.getElementById("btnLimpar");
const listaPendentes = document.getElementById("listaPendentes");
const listaFeitas = document.getElementById("listaFeitas");

let dateError = document.getElementById("dateError");
if (!dateError && fim) {
  dateError = document.createElement("div");
  dateError.id = "dateError";
  dateError.setAttribute("role", "alert");
  dateError.setAttribute("aria-live", "assertive");
  dateError.className = "text-danger d-none mt-1";
  fim.insertAdjacentElement("afterend", dateError);
}

let appMessage = document.getElementById("appMessage");
if (!appMessage) {
  appMessage = document.createElement("div");
  appMessage.id = "appMessage";
  appMessage.setAttribute("aria-live", "polite");
  const container = document.querySelector(".container") || document.body;
  container.insertBefore(appMessage, container.firstChild);
}

function mostrarMensagem(texto, tipo = "success", duracao = 3000) {
  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo} mt-2`;
  alerta.setAttribute("role", "status");
  alerta.textContent = texto;
  appMessage.appendChild(alerta);
  setTimeout(() => {
    alerta.classList.add("fade");
    alerta.style.transition = "opacity 300ms";
    alerta.style.opacity = "0";
    setTimeout(() => alerta.remove(), 300);
  }, duracao);
}

function parseDateISO(s) {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function validarDatas() {
  if (!dateError) return true;
  dateError.classList.add("d-none");
  dateError.textContent = "";
  inicio.classList.remove("is-invalid");
  fim.classList.remove("is-invalid");
  if (!inicio.value || !fim.value) return false;
  const s = parseDateISO(inicio.value);
  const e = parseDateISO(fim.value);
  if (e < s) {
    dateError.textContent = "Ops — a data de término não pode ser anterior à data de início.";
    dateError.classList.remove("d-none");
    fim.classList.add("is-invalid");
    return false;
  }
  return true;
}

if (inicio && fim) {
  inicio.addEventListener("change", () => {
    if (inicio.value) {
      fim.min = inicio.value;
      if (fim.value) {
        const s = parseDateISO(inicio.value);
        const e = parseDateISO(fim.value);
        if (e < s) fim.value = inicio.value;
      }
    } else {
      fim.removeAttribute("min");
    }
    validarDatas();
  });
  fim.addEventListener("change", validarDatas);
}

function salvarNoStorage() {
  try {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
    mostrarMensagem("Tudo salvo no navegador.", "success", 1800);
  } catch (err) {
    console.error(err);
    mostrarMensagem("Não foi possível salvar. Verifique o armazenamento do navegador.", "danger", 4000);
  }
}

function recuperarDoStorage() {
  try {
    const dados = localStorage.getItem("tarefas");
    if (dados) {
      const arr = JSON.parse(dados);
      tarefas = arr.map(obj => new Tarefa(
        obj.titulo || "",
        obj.inicio || "",
        obj.fim || "",
        obj.responsavel || "",
        obj.prioridade || "",
        obj.observacao || "",
        obj.disciplina || "",
        obj.tipoAvaliacao || "",
        obj.feita || false,
        obj.id || null
      ));
      mostrarMensagem("Tarefas carregadas com sucesso.", "info", 1800);
    } else {
      tarefas = [];
      mostrarMensagem("Nenhuma tarefa salva encontrada.", "warning", 1800);
    }
  } catch (err) {
    console.error(err);
    tarefas = [];
    mostrarMensagem("Erro ao recuperar dados.", "danger", 3000);
  }
}

function limparStorage() {
  try {
    localStorage.removeItem("tarefas");
    tarefas = [];
    renderizar();
    mostrarMensagem("Tudo apagado. Você pode começar de novo.", "info", 2200);
  } catch (err) {
    console.error(err);
    mostrarMensagem("Erro ao limpar os dados.", "danger", 3000);
  }
}

function limparValidacao() {
  [titulo, inicio, fim, responsavel, prioridade, disciplinaEl, tipoAvaliacaoEl, observacao].forEach(el => {
    if (!el) return;
    el.classList.remove("is-invalid");
  });
  if (dateError) {
    dateError.classList.add("d-none");
    dateError.textContent = "";
  }
}

function validarFormulario() {
  limparValidacao();
  let primeiroInvalido = null;
  if (!titulo || !titulo.value || !titulo.value.trim()) { titulo.classList.add("is-invalid"); primeiroInvalido = primeiroInvalido || titulo; }
  if (!inicio || !inicio.value) { inicio.classList.add("is-invalid"); primeiroInvalido = primeiroInvalido || inicio; }
  if (!fim || !fim.value) { fim.classList.add("is-invalid"); primeiroInvalido = primeiroInvalido || fim; }
  if (!responsavel || !responsavel.value || !responsavel.value.trim()) { responsavel.classList.add("is-invalid"); primeiroInvalido = primeiroInvalido || responsavel; }
  if (!prioridade || !prioridade.value) { prioridade.classList.add("is-invalid"); primeiroInvalido = primeiroInvalido || prioridade; }
  if (disciplinaEl && (!disciplinaEl.value || !disciplinaEl.value.trim())) { disciplinaEl.classList.add("is-invalid"); primeiroInvalido = primeiroInvalido || disciplinaEl; }
  if (tipoAvaliacaoEl && (!tipoAvaliacaoEl.value || !tipoAvaliacaoEl.value.trim())) { tipoAvaliacaoEl.classList.add("is-invalid"); primeiroInvalido = primeiroInvalido || tipoAvaliacaoEl; }
  if (!observacao || !observacao.value || !observacao.value.trim()) { observacao.classList.add("is-invalid"); primeiroInvalido = primeiroInvalido || observacao; }
  if (!validarDatas()) { primeiroInvalido = primeiroInvalido || fim; }
  if (primeiroInvalido) {
    primeiroInvalido.focus();
    mostrarMensagem("Por favor, preencha todos os campos corretamente.", "warning", 2500);
    return false;
  }
  return true;
}

[titulo, inicio, fim, responsavel, prioridade, disciplinaEl, tipoAvaliacaoEl, observacao].forEach(el => {
  if (!el) return;
  el.addEventListener("input", () => el.classList.remove("is-invalid"));
  el.addEventListener("change", () => el.classList.remove("is-invalid"));
});

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validarFormulario()) return;
    const tarefa = new Tarefa(
      titulo.value.trim(),
      inicio.value,
      fim.value,
      responsavel.value.trim(),
      prioridade.value,
      observacao.value.trim(),
      disciplinaEl ? disciplinaEl.value : "",
      tipoAvaliacaoEl ? tipoAvaliacaoEl.value : ""
    );
    tarefas.push(tarefa);
    form.reset();
    if (fim) fim.removeAttribute("min");
    salvarNoStorage();
    mostrarMensagem("Tarefa adicionada com sucesso!", "success", 1800);
    renderizar();
  });
}

function renderizar() {
  if (!listaPendentes || !listaFeitas) return;
  listaPendentes.innerHTML = "";
  listaFeitas.innerHTML = "";
  tarefas.forEach(tarefa => {
    const item = document.createElement("li");
    item.className = "list-group-item d-flex justify-content-between align-items-start";
    const left = document.createElement("div");
    left.className = "me-3 break-word";
    const title = document.createElement("strong");
    title.textContent = tarefa.titulo;
    left.appendChild(title);
    const metaText = document.createTextNode(" - " + (tarefa.prioridade || ""));
    left.appendChild(metaText);
    left.appendChild(document.createElement("br"));
    const small1 = document.createElement("small");
    small1.textContent = `${tarefa.inicio || ""} a ${tarefa.fim || ""} | ${tarefa.responsavel || ""}`;
    left.appendChild(small1);
    left.appendChild(document.createElement("br"));
    const smallDisc = document.createElement("small");
    smallDisc.textContent = `Disciplina: ${tarefa.disciplina || "-"} • Avaliação: ${tarefa.tipoAvaliacao || "-"}`;
    left.appendChild(smallDisc);
    left.appendChild(document.createElement("br"));
    const small2 = document.createElement("small");
    small2.textContent = tarefa.observacao || "";
    left.appendChild(small2);
    const right = document.createElement("div");
    right.className = "d-flex align-items-center";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!tarefa.feita;
    checkbox.setAttribute("aria-label", "Marcar tarefa como feita");
    right.appendChild(checkbox);
    const btnExcluir = document.createElement("button");
    btnExcluir.className = "btn btn-sm btn-danger ms-2";
    btnExcluir.textContent = "Excluir";
    right.appendChild(btnExcluir);
    item.appendChild(left);
    item.appendChild(right);
    checkbox.addEventListener("change", () => {
      tarefa.feita = checkbox.checked;
      salvarNoStorage();
      mostrarMensagem(tarefa.feita ? "Tarefa marcada como concluída." : "Tarefa marcada como pendente.", "info", 1400);
      renderizar();
    });
    btnExcluir.addEventListener("click", () => {
      tarefas = tarefas.filter(t => t.id !== tarefa.id);
      salvarNoStorage();
      mostrarMensagem("Tarefa removida.", "info", 1400);
      renderizar();
    });
    if (tarefa.feita) listaFeitas.appendChild(item); else listaPendentes.appendChild(item);
  });
}

(function init() {
  try {
    const dados = localStorage.getItem("tarefas");
    if (dados) {
      recuperarDoStorage();
    }
    renderizar();
  } catch (err) {
    console.error(err);
  }
})();

if (btnSalvar) btnSalvar.addEventListener("click", salvarNoStorage);
if (btnRecuperar) btnRecuperar.addEventListener("click", () => { recuperarDoStorage(); renderizar(); });
if (btnLimpar) btnLimpar.addEventListener("click", () => { limparStorage(); });