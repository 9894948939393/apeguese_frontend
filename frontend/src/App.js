import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Perfil from './Perfil.js';
import Login from './login.js';
import Admin from './Admin.js'

function App() {
const [mensagem, setMensagem] = useState('');
const [mostrarMain, setMostrarMain] = useState(true);
const [mostrarCabecalho, setMostrarCabecalho] = useState(true);
const navigate = useNavigate();
const location = useLocation();
const [produtos, setProdutos] = useState([]);  
const [mostrarFiltragem, setmostrarFiltragem] = useState(false);
const [mostrarFinalizar, setMostrarFinalizar] = useState(false);
const [mostrarAlterarEndereco, setMostrarAlterarEndereco] = useState(false);
const [mostrarProduto, setMostrarProduto] = useState(false)
const [botaoHome, setBotaoHome] = useState(false)
const [produtoFiltrado, setProdutosFiltrado] = useState([]); 
const [areaCarrinho, setMostrarCarrinho] = useState(false)
const [carrinho, setCarrinho] = useState([]);
const [total, setTotal] = useState([]);
const [frete, setFrete] = useState([]);
const [totalFrete, setTotalFrete] = useState([]);
const [ruaNumero, setRuaNumero ]= useState([]);
const [avisoEndereco, setAvisoEndereco ]= useState([]);
const [avisoCarrinho, setAvisoCarrinho ]= useState([]);
const [botaoSacola, setBotaoSacola] = useState(false)
const [areaPedidos, setAreaPedidos] = useState(false)
const [pedido, setPedido] = useState([]);
const [barraPedidosCarrinho, setBarraPedidosCarrinho] = useState(false)
const [botaoLogin, setBotaoLogin] = useState(false)
const token = localStorage.getItem('token');
const [produtoSelecionado, setProdutoSelecionado] = useState(null);
const API_URL = process.env.REACT_APP_API_URL;
const imagemBaseURL = `${API_URL}/uploads/`;

useEffect(() => {     
  if (location.pathname === '/' || location.pathname === '/app' || location.pathname === '/app_main') {
    setMostrarMain(true);
    setMostrarCabecalho(true)
    setMostrarProduto(false)
    setBotaoHome(false)
    setBarraPedidosCarrinho(false)
    setBotaoSacola(false)
    sessao()
  } else{
    setMostrarMain(false);
  }
}, [location.pathname]);
  const navegarParaPerfil = () => {
    navigate('/perfil');
    setMostrarMain(false);
    setMostrarCabecalho(false)
  };

  useEffect(() => {
    fetch(`${API_URL}/produtos`, {
      method: 'GET',
      credentials: 'include', 
      headers: {
        'Accept': 'application/json'
      }
    }) 
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data.produtos)
        setProdutos(data.produtos);

      })
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
      });
  }, []);
  useEffect(() => {
    console.log("Produtos atualizados:", produtos);
  }, [produtos]);
  const sessao = () => {
    fetch(`${API_URL}/token`, {
      method: 'GET',
      credentials: 'include', 
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }) 
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.message === "Sucesso"){
          setBotaoLogin(false)
          setBotaoHome(false)
          setBotaoSacola(true)
        }else{
          setBotaoLogin(true)
          setBotaoHome(false)
          setBotaoSacola(false)
      }
      })
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
      });
  };
  const navegarParaLogin = () => {
    setMostrarCabecalho(false)
    setMostrarMain(false)
    navigate('/login'); }
  const selecionarProduto = (event) => {
    event.preventDefault(); 

    const formData = new FormData(event.target);

    fetch(`${API_URL}/selecionar_produto`, {
      method: 'POST',
      body: formData,
      mode: 'cors',
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data || !Array.isArray(data.produto) || data.produto.length === 0) {
          alert("Nenhum produto encontrado para a categoria");
        } else {
          setProdutosFiltrado(data.produto);
          setAvisoCarrinho("")
          setmostrarFiltragem(false);
          setMostrarCarrinho(false)
          setMostrarMain(false);
          setMostrarCabecalho(true);
          setMostrarProduto(true);
          setBotaoHome(true)
        }
      })
      .catch(error => {
        console.error('Erro ao buscar categoria:', error);
        alert('Erro ao buscar categoria: ' + error.message);
      });
  };

  const adicionarCarrinho = (event) => {
    event.preventDefault(); 

    const formData = new FormData(event.target);

    fetch(`${API_URL}/adicionar_carrinho`, {
      method: 'POST',
      body: formData,
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if(data.message === "Produto adicionado ao carrinho com sucesso!"){
          setProdutosFiltrado([]);
          setMostrarMain(true);
          setMostrarCabecalho(true);
          setmostrarFiltragem(false);
          setMostrarProduto(false);
          setBotaoHome(false)
          setBotaoSacola(true)
        }else if(data.message === "Ah, esse produto na numeração e cor que você escolheu está em falta no estoque!"){
          setAvisoCarrinho(data.message)
        }else{
          alert("Erro ao adicionar ao carrinho");
        }
      })
      .catch(error => {
        console.error('Erro ao buscar categoria:', error);
        alert('Erro ao buscar categoria: ' + error.message);
      });
  };
  const adicionarFavoritos = (event) => {
    event.preventDefault(); 

    const formData = new FormData(event.target);

    fetch(`${API_URL}/adicionar_favoritos`, {
      method: 'POST',
      body: formData,
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if(data.message === "Produto adicionado aos favoritos com sucesso!"){
        }else{
          alert("Erro ao adicionar aos favoritos");
        }
      })
      .catch(error => {
        console.error('Erro ao adicionar aos favoritos', error);
        alert('Erro ao adicionar aos favoritos: ' + error.message);
      });
  };
  const mostrarCarrinho = (event) => {
    event.preventDefault(); 

    const formData = new FormData(event.target);

    fetch(`${API_URL}/mostrar_carrinho`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data || !Array.isArray(data.produto) || data.produto.length === 0) {
            setMostrarMain(false)
            setmostrarFiltragem(false);
            setMostrarProduto(false);
            setBotaoSacola(false);
            setAreaPedidos(false);
            setMostrarCabecalho(true);
            setMostrarCarrinho(true);
            setBotaoHome(true)
            setBarraPedidosCarrinho(true)
          setBotaoSacola(false)
        } else {
            setMostrarMain(false)
            setmostrarFiltragem(false);
            setMostrarProduto(false);
            setBotaoSacola(false)
            setMostrarCabecalho(true);
            setMostrarCarrinho(true);
            setAreaPedidos(false)
            setBotaoHome(true)
            setBarraPedidosCarrinho(true)
            setCarrinho(data.produto)
            setTotal(data.valor)
            setBotaoSacola(false)

        }
      })
      .catch(error => {
        console.error('Erro ao buscar categoria:', error);
        alert('Erro ao buscar categoria: ' + error.message);
      });
    };
    const mostrarPedido = (event) => {
        event.preventDefault(); 
    
    
        fetch(`${API_URL}/mostrar_pedidos`, {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if (data.message === "Sucesso") {
                setMostrarMain(false)
                setmostrarFiltragem(false);
                setMostrarProduto(false);
                setBotaoSacola(false)
                setMostrarCabecalho(true);
                setMostrarCarrinho(false);
                setBotaoHome(true)
                setBarraPedidosCarrinho(true)
                setBotaoSacola(false)
                setAreaPedidos(true)
                setPedido(data.pedidos)
                console.log("Pedido:"+pedido)

            } else {
                setMostrarMain(false)
                setmostrarFiltragem(false);
                setMostrarProduto(false);
                setBotaoSacola(false)
                setMostrarCabecalho(true);
                setMostrarCarrinho(false);
                setBotaoHome(true)
                setAreaPedidos(false)
                setBarraPedidosCarrinho(true)
                setBotaoSacola(false)
                alert("Nenhum pedido encontrado");

            }
          })
          .catch(error => {
            console.error('Erro ao buscar categoria:', error);
            alert('Erro ao buscar categoria: ' + error.message);
          });
        };
    const irHome = () => {
    setMostrarMain(true)
      setmostrarFiltragem(false);
      setMostrarProduto(false);
      setBotaoSacola(true)
      setMostrarCarrinho(false);
      setBotaoHome(false)
      setAreaPedidos(false)
      setBarraPedidosCarrinho(false)
      setMostrarFinalizar(false)
      };
      const deletarCarrinho = (event) => {
        event.preventDefault(); 
    
        const formData = new FormData(event.target);
    
        fetch(`${API_URL}/deletar_carrinho`, {
          method: 'POST',
          body: formData,
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if(data.message === "Produto excluído do carrinho com sucesso"){
              setCarrinho(data.produto)
              setTotal(data.valor)
            }else{
              alert("Erro ao excluir item do carrinho");
            }
          })
          .catch(error => {
            console.error('Erro ao buscar categoria:', error);
            alert('Erro ao buscar categoria: ' + error.message);
          });
      };
          const irFinalizar = (event) => {
            event.preventDefault(); 
        
            const formData = new FormData(event.target);
        
            fetch(`${API_URL}/ir_pedido`, {
              method: 'POST',
              body: formData,
              mode: 'cors',
              credentials: 'include',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
              })
              .then(data => {
                if(data.message === "Sucesso!"){
                    setFrete(data.frete)
                    setTotalFrete(data.total)
                    setRuaNumero(data.endereco)
                    setMostrarMain(false)
                    setmostrarFiltragem(false);
                    setMostrarProduto(false);
                    setBotaoSacola(false)
                    setMostrarCabecalho(true)
                    setMostrarCarrinho(false);
                    setBotaoHome(true)
                    setMostrarAlterarEndereco(false)
                    setMostrarFinalizar(true)
                }else if(data.message === "Endereço não encontrado"){
                    setAvisoEndereco("Endereço não encontrado, por favor, adicione um endereço para finalizar a compra.")
                    setMostrarMain(false)
                    setmostrarFiltragem(false);
                    setMostrarProduto(false);
                    setBotaoSacola(false)
                    setMostrarCabecalho(true)
                    setMostrarCarrinho(false);
                    setBotaoHome(true)
                    setMostrarAlterarEndereco(true)
                    setMostrarFinalizar(false)
                }else{
                    alert(data.message);
                }
              })
              .catch(error => {
                console.error('Erro ao adicionar aos favoritos', error);
                alert('Erro ao adicionar aos favoritos: ' + error.message);
              });
          };
          const finalizarCompra = (event) => {
            event.preventDefault(); 
        
        
            fetch(`${API_URL}/finalizar_pedido`, {
              method: 'POST',
              mode: 'cors',
              credentials: 'include',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
              })
              .then(data => {
                if(data.message === "Pedido realizado com sucesso!"){
                    setMostrarMain(true)
                    setmostrarFiltragem(false);
                    setMostrarProduto(false);
                    setBotaoSacola(false)
                    setMostrarCabecalho(true)
                    setMostrarCarrinho(false);
                    setBotaoHome(false)
                    setMostrarAlterarEndereco(false)
                    setMostrarFinalizar(false)
                }else if(data.message === "Endereço não encontrado"){
                    setAvisoEndereco("Endereço não encontrado, por favor, adicione um endereço para finalizar a compra.")
                    setMostrarMain(false)
                    setmostrarFiltragem(false);
                    setMostrarProduto(false);
                    setBotaoSacola(false)
                    setMostrarCabecalho(true)
                    setMostrarCarrinho(false);
                    setBotaoHome(true)
                    setMostrarAlterarEndereco(true)
                    setMostrarFinalizar(false)
                }else{
                    alert("Erro ao finalizar a compra, tente novamente mais tarde.");
                }
              })
              .catch(error => {
                console.error('Erro ao adicionar aos favoritos', error);
                alert('Erro ao adicionar aos favoritos: ' + error.message);
              });
          };
    const irAlterarEndereco = () => {
        setMostrarMain(false)
                    setmostrarFiltragem(false);
                    setMostrarProduto(false);
                    setBotaoSacola(false)
                    setMostrarCabecalho(true)
                    setMostrarCarrinho(false);
                    setBotaoHome(true)
                    setMostrarAlterarEndereco(true)
                    setMostrarFinalizar(false)
    }
    const alterarEndereco = (event) => {
        event.preventDefault(); 
    
        const formData = new FormData(event.target);
    
        fetch(`${API_URL}/alterar_endereco`, {
          method: 'POST',
          body: formData,
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if(data.message === "Sucesso!"){
                setRuaNumero(data.endereco)
                setMostrarMain(false)
                setmostrarFiltragem(false);
                setMostrarProduto(false);
                setBotaoSacola(false)
                setMostrarCabecalho(true)
                setMostrarCarrinho(true);
                setBotaoHome(true)
                setMostrarAlterarEndereco(false)
                setMostrarFinalizar(false)
            }
          })
          .catch(error => {
            console.error('Erro ao adicionar aos favoritos', error);
            alert('Erro ao adicionar aos favoritos: ' + error.message);
          });
      };
      function EstoqueForm({ produtos }) {
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const handleProdutoChange = (e) => {
    const nome = e.target.value;
    const produto = produtos.find(p => p.nome === nome);
    setProdutoSelecionado(produto || null);
  };};

  return (
    <main>
      <header style={{display: mostrarCabecalho? 'flex' : 'none',}}>
        <div className='headerContainer'>
          <img src="/images/logo.jpg" alt='Apegue-se'></img>
          <form>
            <input type="search" placeholder='Pesquisar produto'></input>
            <button type='submit'>
              <img src='/images/lupa.png' alt='lupa'></img>
            </button>
          </form>
          <div className='divBotoes'>
            <form onSubmit={mostrarCarrinho} style={{display: botaoSacola? 'flex' : 'none' }}>
              <button type="submit"><img alt='Carrinho' src='/images/carrinho.png'></img></button>
            </form>
              <button onClick={navegarParaLogin} className='botaoCarrinho' style={{display: botaoLogin? 'flex' : 'none' }}>Entrar</button>
              <button onClick={navegarParaPerfil}> <img  alt='Perfil' src='/images/perfil.png'></img></button>
              <button onClick={irHome} className='botaoCarrinho' style={{display: botaoHome? 'flex' : 'none' }}>
            <img src='/images/home.png' alt='carrinho'></img>
          </button>
          </div>
        </div>
      </header>
      <div style={{display: mostrarMain? 'flex' : 'none', flexDirection:"column" }}>
        <img alt='fundo tênis'src='/images/fundo.gif' style={{width:"100vw", height:"auto"}}></img>
        <div className=" produtos-container">
            {produtos.map(produto => (
                <form key={produto[0]} onSubmit={selecionarProduto}>                
                <button type='submit'>
                    {/* <img src={`${imagemURL}${produto[10]}`} alt={produto[1]} className='imagemProdutoContainer'></img>           */}
                    <p>{produto["nome"]}</p>
                    <p><b>R${produto["valor"]}</b></p>
                </button>
                <input type='hidden' name="escolha" value={produto["nome"]}></input>
                </form>
                ))}
        </div>
      </div>
      <div style={{display: mostrarProduto ? 'flex' : 'none'}}>
  {produtoFiltrado.map(filtro => {
    const cores = typeof filtro["cor"] === "string" ? JSON.parse(filtro["cor"]) : filtro["cor"];
    const tamanhos = typeof filtro["numeracao"] === "string" ? JSON.parse(filtro["numeracao"]) : filtro["numeracao"];

    return (
      <div key={filtro["codigo"]} className='divProduto'>
        {/* <img src={`/images/${filtro["imagem"]}`} alt={filtro["nome"]}></img> */}
        <div>
          <h1>{filtro["nome"]}</h1>
          <h3>R${filtro["valor"]}</h3>
          <h3 style={{color:"red"}}>{avisoCarrinho}</h3>
          <p>Tamanhos disponíveis: {tamanhos.join(", ")}</p>
          <p>Gênero: {filtro["genero"]}</p>
          <p>Marca: {filtro["marca"]}</p>
          <p>Cores disponíveis: {cores.join(", ")}</p>
          <p>Descrição: {filtro["descricao"]}</p>

          <form method='post' onSubmit={adicionarCarrinho}>
            <input type='hidden' name="produto" value={filtro["codigo"]} />
            <input type='hidden' name="produto_nome" value={filtro["nome"]} />
            <select name="cor" required>
              <option value="">Selecione a cor</option>
              {cores.map(cor => (
                <option key={cor} value={cor}>{cor}</option>
              ))}
            </select>

            <select name="tamanho" required>
              <option value="">Selecione o tamanho</option>
              {tamanhos.map(tam => (
                <option key={tam} value={tam}>{tam}</option>
              ))}
            </select>

            <button type='submit'>
              <img alt='carrinho' src='/images/carrinho.png' style={{ width: 'auto', height: '5vh' }} />
            </button>
          </form>
          <form method='post' id='formCurtir' onSubmit={adicionarFavoritos}>
            <input type='hidden' name='produto' value={filtro["codigo"]} />
            <button type='submit'>Curtir</button>
          </form>
        </div>
      </div>
    );
  })}
</div>


    <div style={{display: barraPedidosCarrinho? 'flex' : 'none',}} className='barraCarrinhoPedidos'>
        <form onSubmit={mostrarCarrinho}><button type='submit'>Carrinho</button></form>
        <form onSubmit={mostrarPedido}><button type='submit'>Pedido</button></form>
    </div>
    <div style={{display: areaCarrinho? 'flex' : 'none', flexDirection:"column" }}>
      {carrinho.map(filtro => (
        <div key={filtro["id"]} className='divProdutoCarrinho'>   
              <form className="formProdutoCarrinho"method='post' key={filtro["id"]} onSubmit={selecionarProduto}>                
                <button type='submit'>
                  {/* <img src={`/images/${filtro[10]}`} alt={filtro[1]}></img>           */}
                  <p>{filtro["nome"]}</p>
                  <h3>R${filtro["valor"]}</h3>
                </button>
              <input type='hidden' name="escolha" value={filtro["nome"]}></input>
              </form>
              <form method='post' className='formLixeira' onSubmit={deletarCarrinho}>
                <input type='hidden' name="produto" value={filtro["codigo"]}></input>
                <button type='submit'><img alt='carrinho' src='/images/lixeira.png'></img></button>
              </form>
        </div>
              ))}
              <div className='fecharCarrinho'>
                <h2>{total}</h2>
                  <button className='botaoFinalizar'>Limpar carrinho</button>
                <form method='post' onSubmit={irFinalizar}>
                  <button type='submit' className='botaoFinalizar'>Finalizar compra</button>
                </form>
              </div>
      </div>
      <div style={{display: mostrarFinalizar? 'flex' : 'none'}}>
        <div>
        {carrinho.map(filtro => (
        <div key={filtro[0]} className='divProdutoCarrinho'>   
              <form className="formProdutoCarrinho"method='post' key={filtro["id"]} onSubmit={selecionarProduto}>                
                <button type='submit'>
                  {/* <img src={`/images/${filtro[10]}`} alt={filtro[1]}></img>           */}
                  <p>{filtro["nome"]}</p>
                  <h3>R${filtro["valor"]}</h3>
                </button>
              <input type='hidden' name="escolha" value={filtro["nome"]}></input>
              </form>
        </div>
              ))}
        </div>
        <div>
            <form onSubmit={finalizarCompra} method='post'>
              <img alt="150.875.206-00"></img>
              <div>
                <div>
                    <p>Endereço:{ruaNumero}</p>
                </div>
                <label>Nome da conta que está enviando o pix</label>
                <br></br>
                <input type='text' name="comprador"placeholder='Insira o nome do titular'></input>
                <br></br>
                <button onClick={irAlterarEndereco}> Alterar endereço </button>
                <p>
                    Valor produtos:{total}<br></br>
                    Frete:{frete}<br></br>
                    Total:{totalFrete}
                </p>
                <button type='submit'>Finalizar compra no total de {totalFrete}</button>
              </div>
            </form>
        </div>
      </div>
      <div style={{display: mostrarAlterarEndereco? 'flex' : 'none'}}>
        <form onSubmit={alterarEndereco} method='post'>
            <p style={{color:"red"}}>{avisoEndereco}</p>
            <h2>Alterar o endereço</h2>
            <label>CEP</label>
            <input type='number' placeholder='Insira o CEP' name='cep'></input>
            <br></br>
            <label>Rua</label> 
            <input type='text' placeholder='Insira a rua' name='rua'></input>
            <br></br>
            <label>Número</label>
            <input type='number' placeholder='Insira o número' name='numero'></input>
            <br></br>
            <label>Bairro</label>
            <input type='text' placeholder='Insira o bairro' name='bairro'></input>
            <br></br>
            <label>Cidade</label>
            <input type='text' placeholder='Insira a cidade' name='cidade'></input>
            <br></br>
            <label>Estado</label>
            <input type='text' placeholder='Insira o estado' name='estado'></input>
            <br></br>
            <label>Complemento</label>
            <input type='text' placeholder='Insira o complemento' name='complemento'></input>
            <br></br>
            <button type='submit'>ALterar endereço</button>
        </form>
      </div>
      <div style={{display: areaPedidos? 'flex' : 'none', flexDirection:"column" }}>
      {pedido.map(filtro => (
        <div key={filtro["id"]} className='divProdutoCarrinho'>   
              <form className="formProdutoCarrinho"method='post' key={filtro["id"]} onSubmit={selecionarProduto}>                
                <button type='submit'>
                  {/* <img src={`/images/${filtro[10]}`} alt={filtro[1]}></img>           */}
                  <p>{filtro["nome"]}</p>
                  <h3>R${filtro["valor"]}</h3>
                </button>
              <input type='hidden' name="escolha" value={filtro["nome"]}></input>
              </form>
              <p>{filtro["status"]}</p>
        </div>
              ))}
      </div>
      <footer style={{display: mostrarCabecalho? 'flex' : 'none', flexDirection:"row" }}>
        <div style={{display:'flex', flexDirection:"column", alignItems:"center"}}>
            <h3>Redes sociais e meios de contato :</h3>
            <button onClick={() => window.open('https://www.instagram.com/clubraro.co?igsh=eHlwYzk5M3AxcXNs&utm_source=qr')}>
                Instagram:
                <br></br>
                @clubraro.co
            </button>
            <button onClick={() => window.open('https://www.tiktok.com/@clubraro.co?is_from_webapp=1&sender_device=pc')}>
                Tiktok:
                <br></br>
                @clubraro.co
            </button>
            <p>
                Email:
                <br></br>
                clubraro65@gmail.com
            </p>
        </div>
        <div style={{display:'flex', flexDirection:"column", alignItems:"center"}}>
            <h3>Outras informações:</h3>
            {/* <button>Ajuda</button>
            <button>Perguntas frequentes</button> */}
            <button>Termos de uso</button>
            <button>Política de privacidade</button>

        </div>
      </footer>
      <Routes>
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </main>
  );
}
function AppWrapper() {
  return (
      <App />
  );
}

export default AppWrapper