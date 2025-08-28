// Função para formatar preço (R$ 0,00)
function formatarPreco(valor) {
  return valor.toFixed(2).replace('.', ',');
}

// Pega os elementos
const tabelaCarrinhoBody = document.querySelector("#tabela-carrinho tbody");
const totalEl = document.getElementById("total");
const btnLimpar = document.getElementById("btn-limpar");

// Carrega o carrinho do localStorage ou vazio
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// Função para mostrar os produtos no carrinho
function mostrarCarrinho() {
  tabelaCarrinhoBody.innerHTML = "";

  if (carrinho.length === 0) {
    tabelaCarrinhoBody.innerHTML = `<tr><td colspan="6">Carrinho vazio.</td></tr>`;
    totalEl.textContent = "Total: R$ 0,00";
    return;
  }

  let total = 0;

  carrinho.forEach((produto, index) => {
    const subtotal = produto.preco * produto.quantidade;
    total += subtotal;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${produto.nome}</td>
      <td><images src="${produto.imagem}" alt="${produto.nome}"></td>
      <td>R$ ${formatarPreco(produto.preco)}</td>
      <td>
        <input type="number" min="1" value="${produto.quantidade}" data-index="${index}" class="input-quantidade" />
      </td>
      <td>R$ ${formatarPreco(subtotal)}</td>
      <td><button class="btn-remove" data-index="${index}">X</button></td>
    `;

    tabelaCarrinhoBody.appendChild(tr);
  });

  totalEl.textContent = `Total: R$ ${formatarPreco(total)}`;

  // Adiciona event listeners nos inputs e botões
  ativarEventos();
}

// Atualiza quantidade do produto no carrinho
function atualizarQuantidade(index, novaQuantidade) {
  if (novaQuantidade < 1) return;

  carrinho[index].quantidade = novaQuantidade;
  salvarCarrinho();
  mostrarCarrinho();
}

// Remove um produto do carrinho pelo índice
function removerProduto(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  mostrarCarrinho();
}

// Limpa todo o carrinho
function limparCarrinho() {
  if (confirm("Tem certeza que quer limpar todo o carrinho?")) {
    carrinho = [];
    salvarCarrinho();
    mostrarCarrinho();
  }
}

// Salva o carrinho no localStorage
function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Ativa os eventos dos inputs e botões da tabela
function ativarEventos() {
  const inputsQuantidade = document.querySelectorAll(".input-quantidade");
  inputsQuantidade.forEach(input => {
    input.addEventListener("change", (e) => {
      const index = e.target.getAttribute("data-index");
      const novaQtd = parseInt(e.target.value);
      if (isNaN(novaQtd) || novaQtd < 1) {
        e.target.value = carrinho[index].quantidade;
        return;
      }
      atualizarQuantidade(index, novaQtd);
    });
  });

  const botoesRemover = document.querySelectorAll(".btn-remove");
  botoesRemover.forEach(botao => {
    botao.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      removerProduto(index);
    });
  });
}

// Inicializa a página
mostrarCarrinho();
btnLimpar.addEventListener("click", limparCarrinho);
