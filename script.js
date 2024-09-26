// class Jogador {
//   constructor(simbolo){
//     this.simbolo = simbolo;
//   }
// }

class JogadorHumano {
  constructor(simbolo){
    this.simbolo = simbolo
    this.humano = true
  }
}

class JogadorAleatorio{
  constructor(simbolo){
    this.simbolo = simbolo;
    this.humano = false
  }

  jogar(tabuleiro){
    let linha = this.#aleatorio(1, tabuleiro.length);
    let coluna = this.#aleatorio(1, tabuleiro.length);
    return new Jogada(linha, coluna)
  }

  #aleatorio(min, max){
    let valor = Math.random() * (max - min) + min
    return Math.round(valor)
  }

}

class Jogada {
  constructor(linha, coluna){
    this.linha = linha
    this.coluna = coluna
  }
  get valida(){
    return this.linha > 0 && this.coluna > 0
  }
  get invalida(){
    return !this.valida
  }
}

class JogoDaVelha {
  constructor(
    // jogador1 = new Jogador('X'), 
    // jogador2 = new Jogador('O'),
    jogador1 = new JogadorHumano('X'),
    jogador2 = new JogadorHumano('O'),
    tamanho = 3
  ){
    this.jogador1 = jogador1;
    this.jogador2 = jogador2;
    this.tamanho = tamanho;
    this.zerar()
    // this.jogadorAtual = jogador1;
    // this.tamanho = 3;
    // this.tabuleiro = this.#iniciarTabuleiro();
    // this.vencedor = null
  }

  #iniciarTabuleiro(){
    return Array(this.tamanho).fill(0)
      .map(() => Array(this.tamanho).fill(null))
  }

  jogar(jogada){
    // console.log(`${this.jogadorAtual.simbolo} jogou em ${jogada.linha}, ${jogada.coluna}`)
    // if(this.finalizouComEmpate()){
    //   console.log('Fim de jogo')
    // }
    // this.#processarJogada(jogada)
    if(this.jogadorAtual.humano) {
      this.#processarJogada(jogada)
    }

    while(!this.vencedor && !this.jogadorAtual.humano){
      let jogada2 = this.jogadorAtual.jogar(this.tabuleiro)
      this.#processarJogada(jogada2)
    }
  }

  #processarJogada(jogada){
    if(!this.#jogadaValida(jogada)) return

      this.#adicionar(jogada)
      if(this.#conquistouVitoriaComJogada(jogada)){
       this.vencedor = this.jogadorAtual.simbolo
       return
      } else if (this.#finalizouComEmpate()){
        this.vencedor = '-'
        return
      }
      this.#trocarJogador() 
  }

  #jogadaValida(jogada){
    if(jogada.invalida){
      return false
    }
    let {linha,coluna} = jogada
    if(linha > this.tamanho || coluna > this.tamanho){
      return false
    }
    if(this.#ocupado(jogada)){
      return false
    }
    if(this.vencedor){
      return false
    }
    return true
  }

  #ocupado(jogada){
    let {linha, coluna} = jogada
    return this.#campo(linha, coluna) !== null
  }

  #campo(linha,coluna){
    return this.tabuleiro[linha - 1][coluna - 1]
  }

  #trocarJogador(){
    this.jogadorAtual = this.jogadorAtual.simbolo === this.jogador1.simbolo ? this.jogador2 : this.jogador1
  }

  #adicionar(jogada){
    let {linha, coluna} = jogada
    this.tabuleiro[linha - 1][coluna - 1] = this.jogadorAtual.simbolo
  }

  #finalizouComEmpate(){
    let espacosVazios = this.tabuleiro.flat().filter(campo => campo === null)
    return espacosVazios.length === 0
    // console.log(espacosVazios.length)
  }

  #conquistouVitoriaComJogada(jogada){
    let { linha, coluna } = jogada;
    let {tabuleiro, jogadorAtual} = this;
    let tamanho = tabuleiro.length;
    let indices = Array(tamanho).fill(0).map((_,i) => i + 1) 

    let ganhouEmLinha = indices.every(
      (i) => this.#campo(linha, i) === jogadorAtual.simbolo
    )

    let ganhouEmColuna = indices.every(
      (i) => this.#campo(i, coluna) === jogadorAtual.simbolo
    )

    let ganhouEmDiag1 = indices.every(
      (i) => this.#campo(i,i) === jogadorAtual.simbolo
    )

    let ganhouEmDiag2 = indices.every(
      (i) => this.#campo(tamanho-i+1, i) === jogadorAtual.simbolo
    )

    return ganhouEmLinha || ganhouEmColuna || ganhouEmDiag1 || ganhouEmDiag2
  }

  zerar(){
    this.tabuleiro = this.#iniciarTabuleiro();
    this.jogadorAtual = this.jogador1;
    this.vencedor = null
  }

  toString() {
    let matriz = this.tabuleiro.map(linha => linha
      .map(posicao => posicao ?? "-").join(" ")).join("\n")
    let quemVenceu = this.vencedor ? `Vencedor: ${this.vencedor}` : ''
    return `${matriz} \n${quemVenceu}`
  }

  status(){
    if(this.vencedor === '-'){
      return 'Empate!!!'
    } else if(this.vencedor){
      return `${this.vencedor} venceu!!`
    } else {
      return `É a vez de ${this.jogadorAtual.simbolo}`
    }
  }
}

// const jogo = new JogoDaVelha(new JogadorHumano('X'), new JogadorAleatorio('O'))
// jogo.jogar(new Jogada(1, 1))
// jogo.jogar(new Jogada(1, 2))
// jogo.jogar(new Jogada(2, 3))
// jogo.jogar(new Jogada(2, 1))
// jogo.jogar(new Jogada(3, 3))
// jogo.jogar(new Jogada(1, 3))
// jogo.jogar(new Jogada(3, 1))
// jogo.jogar(new Jogada(3, 2))
// jogo.jogar(new Jogada(3, 3))
// jogo.jogar(new Jogada(3, 3))
// jogo.jogar(new Jogada(24, 43))
// jogo.finalizouComEmpate()
// console.log(jogo.toString())
// jogo.zerar()
// jogo.jogar(new Jogada(3, 1))
// jogo.jogar(new Jogada(3, 2))
// console.log(jogo.toString())

class JogoDaVelhaDOM{
  constructor(tabuleiro, informacoes){
    this.tabuleiro = tabuleiro
    this.informacoes = informacoes
  }

  inicializar(jogo){
    this.jogo = jogo
    this.#criarTabuleiro()
    this.#deixarTabuleiroJogavel()
  }

  #deixarTabuleiroJogavel(){
    const posicoes = this.tabuleiro.getElementsByClassName('posicao')
    for(let posicao of posicoes){
      posicao.addEventListener('click', (e)=> {
        if(this.jogo.vencedor) return
        let posicaoSelecionada = e.target.attributes
        let linha = +posicaoSelecionada.linha.value
        let coluna = +posicaoSelecionada.coluna.value
        // console.log(`Cliquei em ${linha} ${coluna}`)
        this.jogo.jogar(new Jogada(linha, coluna))
        this.informacoes.innerText = this.jogo.status()
        // console.log(this.jogo.toString())
        this.#imprimirSimbolos()
      })
    }
  }

  #imprimirSimbolos(){
    let {tabuleiro} = this.jogo
    let qtdLinhas = tabuleiro.length
    let qtdColunas = tabuleiro[0].length

    let posicoes = this.tabuleiro.getElementsByClassName('posicao')

    for(let linha = 0; linha < qtdLinhas; linha++){
      for(let coluna = 0; coluna < qtdColunas; coluna++){
        let indiceDaInterface = linha * qtdLinhas + coluna // -> Como temos um array de arrays e a DOM verifica apenas como um array unico, isso serve para converter o array de arrays em um indice do array unico. Exemplo: posicao 1 2 => 0 * 1 + 2 = 2(indice)
        posicoes[indiceDaInterface].innerText = tabuleiro[linha][coluna]
      }
    }
  }

  zerar(){
    this.jogo.zerar();
    let posicoes = document.getElementsByClassName('posicao');
    [...posicoes].forEach(posicao => posicao.innerText = "");
    this.informacoes.innerText = this.jogo.status()
  }

  #criarTabuleiro(){
    const tamanho = this.jogo.tamanho;
    const posicoes = []
    for(let linha = 1; linha <= tamanho; linha++){
      const colunas = this.#criarLinhaTabuleiro(linha, tamanho)
      posicoes.push(...colunas)
    }
    this.tabuleiro.innerHTML = [...posicoes].join("")
    this.tabuleiro.style.gridTemplateColumns = `repeat(${tamanho}, 1fr)`
  }

  #criarLinhaTabuleiro(linha, tamanho){
    let colunas = []
    for(let coluna = 1; coluna <= tamanho; coluna++){
      let classes = "posicao "
      if(linha === 1){
        classes += "posicao-cima "
      } else if (linha === tamanho) {
        classes += "posicao-baixo "
      }

      if(coluna === 1){
        classes += "posicao-esquerda"
      } else if( coluna === tamanho){
        classes += "posicao-direita "
      }

      const elemento = `<div class="${classes}" linha=${linha} coluna=${coluna}></div>`
      
      colunas.push(elemento)
    }
    return colunas
  }
}

(function(){
  const botaoIniciar = document.getElementById('botao')
  const informacoes = document.getElementById('informacoes')
  const tabuleiro = document.getElementById('tabuleiro')
  const inputTamanho = document.getElementById('tamanho')
  
  const novoJogo = (tamanho) => {
    const jogo = new JogoDaVelha(
      new JogadorHumano('X'), 
      new JogadorAleatorio('O'), tamanho
    )
    return jogo
  }
  // const jogo = new JogoDaVelha(new JogadorHumano('X'), new JogadorAleatorio('O'))
  const jogoDOM = new JogoDaVelhaDOM(tabuleiro, informacoes)
  jogoDOM.inicializar(novoJogo());
  
  inputTamanho.addEventListener('input', ()=> {
    let tamanho = +inputTamanho.value
    jogoDOM.inicializar(novoJogo(tamanho))
  })

  botaoIniciar.addEventListener('click', ()=>{jogoDOM.zerar()})
})()