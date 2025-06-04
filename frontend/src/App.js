import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Perfil from './Perfil.js';
import Login from './login.js';

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
const [botaoSacola, setBotaoSacola] = useState(false)
const [areaPedidos, setAreaPedidos] = useState(false)
const [pedido, setPedido] = useState([]);
const [barraPedidosCarrinho, setBarraPedidosCarrinho] = useState(false)
const [botaoLogin, setBotaoLogin] = useState(false)
const API_URL = process.env.REACT_APP_API_URL;
useEffect(() => {     
  if (location.pathname === '/' || location.pathname === '/app' || location.pathname === '/app_main') {
    setMostrarMain(true);
    setMostrarCabecalho(true)
    setMostrarProduto(false)
    setBotaoHome(false)
    setBarraPedidosCarrinho(false)
    setBotaoSacola(false)
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
    fetch(`${API_URL}/produtos`) 
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setProdutos(data.produtos || []);
      })
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
      });
  }, []);
  useEffect(() => {
    fetch(`${API_URL}/session`) 
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.sessao){
          setBotaoLogin(true)
          setBotaoHome(false)
          setBotaoSacola(false)
        }else{
        setBotaoLogin(false)
        setBotaoHome(true)
        setBotaoSacola(true)
      }
      })
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
      });
  }, []);
  const navegarParaLogin = () => {
    navigate('/login');
  };
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
      credentials: 'include'
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
      credentials: 'include'
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
    
        const formData = new FormData(event.target);
    
        fetch(`${API_URL}/mostrar_pedidos`, {
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
                alert("Nenhum pedido encontrado");
                setMostrarMain(false)
                setmostrarFiltragem(false);
                setMostrarProduto(false);
                setBotaoSacola(false)
                setMostrarCabecalho(true);
                setMostrarCarrinho(false);
                setBotaoHome(true)
                setBarraPedidosCarrinho(true)
                setBotaoSacola(false)

            } else {
                setMostrarMain(false)
                setmostrarFiltragem(false);
                setMostrarProduto(false);
                setBotaoSacola(false)
                setMostrarCabecalho(true);
                setMostrarCarrinho(false);
                setBotaoHome(true)
                setAreaPedidos(true)
                setBarraPedidosCarrinho(true)
                setPedido(data.produto)
                setBotaoSacola(false)

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
          credentials: 'include'
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if(data.message === "Produto excluido do carrinho com sucesso"){
              setCarrinho(data.produto)
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
              credentials: 'include'
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
        
            const formData = new FormData(event.target);
        
            fetch(`${API_URL}/finalizar_pedido`, {
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
          credentials: 'include'
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
                setMostrarCarrinho(false);
                setBotaoHome(true)
                setMostrarAlterarEndereco(false)
                setMostrarFinalizar(true)
            }
          })
          .catch(error => {
            console.error('Erro ao adicionar aos favoritos', error);
            alert('Erro ao adicionar aos favoritos: ' + error.message);
          });
      };
  return (
    <main>
      <header style={{display: mostrarCabecalho? 'flex' : 'none',}}>
        <div className='headerContainer'>
          <img src="/images/logo_dark.png" alt='club raro'></img>
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
        <img alt='fundo tênis'src='/images/fundo_tenis.gif' style={{width:"100vw", height:"auto"}}></img>
        <div className=" produtos-container">
            {produtos.map(produto => (
                <form key={produto[0]} onSubmit={selecionarProduto}>                
                <button type='submit'>
                    <img src={`/images/${produto[10]}`} alt={produto[1]} className='imagemProdutoContainer'></img>          
                    <p>{produto[1]}</p>
                    <p><b>R${produto[3]}</b></p>
                </button>
                <input type='hidden' name="escolha" value={produto[1]}></input>
                </form>
                ))}
        </div>
      </div>
      <div style={{display: mostrarProduto? 'flex' : 'none' }}>
        {produtoFiltrado.map(filtro => (
            <div key={filtro[0]} className='divProduto'>   
                <img src={`/images/${filtro[10]}`} alt={filtro[1]}></img>                  
                <div>
                    <h1>{filtro[1]}</h1>
                    <h3>R${filtro[3]}</h3>
                    <p>Tamanho:{filtro[9]}</p>
                    <p>Gênero {filtro[2]}</p>
                    <p>Marca: {filtro[2]}</p>
                    <p>Cor: {filtro[7]}</p>
                    <p>Descrição: {filtro[6]}</p>
                    <form method='post' onSubmit={adicionarCarrinho}>
                        <input type='hidden' name="produto" value={filtro[5]}></input>
                        <button type='submit'><img alt='carrinho' src='/images/carrinho.png' style={{ width:'auto', height:'5vh'}}></img></button>
                    </form>
                    <form method='post' id='formCurtir' onSubmit={adicionarFavoritos}>
                        <input type='hidden' name='produto' value={filtro[5]}></input>
                    </form>
                </div>
            </div>
              ))}
        </div>
    <div style={{display: barraPedidosCarrinho? 'flex' : 'none',}} className='barraCarrinhoPedidos'>
        <form onSubmit={mostrarCarrinho}><button type='submit'>Carrinho</button></form>
        <form onSubmit={mostrarPedido}><button type='submit'>Pedido</button></form>
    </div>
    <div style={{display: areaCarrinho? 'flex' : 'none', flexDirection:"column" }}>
      {carrinho.map(filtro => (
        <div key={filtro[0]} className='divProdutoCarrinho'>   
              <form className="formProdutoCarrinho"method='post' key={filtro[0]} onSubmit={selecionarProduto}>                
                <button type='submit'>
                  <img src={`/images/${filtro[10]}`} alt={filtro[1]}></img>          
                  <p>{filtro[1]}</p>
                  <h3>R${filtro[3]}</h3>
                </button>
              <input type='hidden' name="escolha" value={filtro[5]}></input>
              </form>
              <form method='post' className='formLixeira' onSubmit={deletarCarrinho}>
                <input type='hidden' name="produto" value={filtro[5]}></input>
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
              <form className="formProdutoCarrinho"method='post' key={filtro[0]} onSubmit={selecionarProduto}>                
                <button type='submit'>
                  <img src={`/images/${filtro[10]}`} alt={filtro[1]}></img>          
                  <p>{filtro[1]}</p>
                  <h3>R${filtro[3]}</h3>
                </button>
              <input type='hidden' name="escolha" value={filtro[5]}></input>
              </form>
              <form method='post' className='formLixeira' onSubmit={deletarCarrinho}>
                <input type='hidden' name="produto" value={filtro[5]}></input>
                <button type='submit'><img alt='carrinho' src='/images/lixeira.png'></img></button>
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
        <div key={filtro[0]} className='divProdutoCarrinho'>   
              <form className="formProdutoCarrinho"method='post' key={filtro[0]} onSubmit={selecionarProduto}>                
                <button type='submit'>
                  <img src={`/images/${filtro[10]}`} alt={filtro[1]}></img>          
                  <p>{filtro[1]}</p>
                  <h3>R${filtro[3]}</h3>
                </button>
              <input type='hidden' name="escolha" value={filtro[5]}></input>
              </form>
              <form method='post' className='formLixeira' onSubmit={deletarCarrinho}>
                <input type='hidden' name="produto" value={filtro[5]}></input>
                <button type='submit'><img alt='carrinho' src='/images/lixeira.png'></img></button>
              </form>
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