document.addEventListener("DOMContentLoaded", () => {

  console.log("Arquivo index.js carregado!");

  const token = localStorage.getItem("token");
  const userLogadoRaw = localStorage.getItem("userLogado");

  console.log("Token salvo no localStorage:", token);
  console.log("Usuário salvo no localStorage:", userLogadoRaw);

  const logado = document.getElementById("logado");
  const produtosContainer = document.getElementById("produtos");

  function abrirCarrinho() {
    window.location.href = "assets/html/cart.html";
  }

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("userLogado");
    window.location.href = "assets/html/signin.html";
  }

  function atualizarContadorCarrinho() {
    const cartCount = document.getElementById("cart-count");
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

    if (cartCount) {
      cartCount.textContent = totalItens;
      cartCount.style.display = totalItens > 0 ? "inline-block" : "none";
    }
  }

  const produtos = [
    { nome: "Teclado Mecânico RGB", preco: 299.90, imagem: "assets/images/teclado.jpg" },
    { nome: "Mouse Gamer 16000 DPI", preco: 189.90, imagem: "assets/images/mouse.jpg" },
    { nome: "Fone de Ouvido", preco: 159.90, imagem: "assets/images/fone.jpg" },
    { nome: "Monitor 24\" Full HD", preco: 799.90, imagem: "assets/images/monitor.jpg" }
  ];

  function adicionarAoCarrinho(indexProduto) {
    const produto = produtos[indexProduto];
    if (!produto) return;

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    const produtoExistente = carrinho.find(item => item.nome === produto.nome);

    if (produtoExistente) {
      produtoExistente.quantidade += 1;
    } else {
      
      carrinho.push({ ...produto, quantidade: 1 });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarContadorCarrinho();
    alert(`${produto.nome} adicionado ao carrinho!`);
  }

  function mostrarProdutos() {
    produtosContainer.innerHTML = "";

    produtos.forEach((produto, index) => {
      const card = document.createElement("div");
      card.classList.add("produto-card");

      card.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}" class="produto-img" />
        <div class="produto-nome">${produto.nome}</div>
        <div class="produto-preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
        <button class="btn-add" data-index="${index}">Adicionar ao carrinho</button>
      `;

      produtosContainer.appendChild(card);
    });

    document.querySelectorAll(".btn-add").forEach(botao => {
      botao.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        adicionarAoCarrinho(index);
      });
    });
  }

  if (token && userLogadoRaw) {
    try {
      const userLogado = JSON.parse(userLogadoRaw);
      const nome = userLogado.nome || "";

      logado.textContent = `Olá, ${nome}`;
      logado.style.display = "block";

      // **Adiciona o event listener no botão sair que já existe no HTML**
      document.getElementById("btn-sair").addEventListener("click", sair);
      window.abrirCarrinho = abrirCarrinho;

      mostrarProdutos();
      atualizarContadorCarrinho();

    } catch (err) {
      console.error("Erro ao processar usuário logado:", err);
      alert("Erro ao carregar informações. Faça login novamente.");
      window.location.href = "assets/html/signin.html";
    }
  } else {
    alert("Você precisa estar logado para acessar essa página");
    window.location.href = "assets/html/signin.html";
  }
});
