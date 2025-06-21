import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';
import App from './App.js';
import Login from './login.js';
function Admin() {
    const [mostarPedidos, setMostrarPedidos] = useState(false);
    const [criar, setCriar] = useState(true);
    const [editar, setEditar] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [produtos, setProdutos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const token = localStorage.getItem('token');
    const API_URL = process.env.REACT_APP_API_URL;
    // const imagemURL = `${process.env.REACT_APP_API_URL}/uploads/`
  
  useEffect(() => {     
          if (location.pathname === '/admin') {
            setMostrarPedidos(true)
          } else{
            setCriar(false)
            setEditar(false)
            setMostrarPedidos(false)
          }
        }, [location.pathname]);
  
    useEffect(() => {
      fetch(`${API_URL}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Dados recebidos da API Flask:', data);
        })
        .catch(error => {
          console.error('Erro ao buscar dados da API Flask:', error);
        });
    }, []);
  
    const adicionarProduto = (event) => {
      event.preventDefault(); 
  
      const formData = new FormData(event.target);
  
      fetch(`${API_URL}/novo_produto`, {
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
          console.log('Resposta do logar:', data);
          if (data && data.message === "Produto adicionado com sucesso!") {
            alert(data.message)
            fetch(`${API_URL}/produtos`)
          } else if (data && data.message === "Não foi possível criar produto, tente novamente") {
            alert(data.message);
          }else {
            alert("Erro desconhecido ao adicionar.");
          }
        })
        .catch(error => {
          console.error('Erro ao adicionar tipo:', error);
          alert('Erro ao adicio tipo: ' + error.message);
        });
    };
    const adicionarEstoque = (event) => {
      event.preventDefault(); 
  
      const formData = new FormData(event.target);
  
      fetch(`${API_URL}/novo_estoque`, {
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
          console.log('Resposta do logar:', data);
          if (data && data.message === "Estoque criado com sucesso!") {
            alert(data.message)
            fetch(`${API_URL}/produtos`)
          } else if (data && data.message === "Não foi possível criar estoque, tente novamente") {
            alert(data.message);
          }else {
            alert("Erro desconhecido ao adicionar.");
          }
        })
        .catch(error => {
          console.error('Erro ao adicionar tipo:', error);
          alert('Erro ao adicio tipo: ' + error.message);
        });
    };
    const atualizarPreco = (event) => {
      event.preventDefault(); 
  
      const formData = new FormData(event.target);
  
      fetch(`${API_URL}/atualizar_preco`, {
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
          console.log('Resposta do logar:', data);
          if (data && data.message === "Valor atualizado com sucesso!") {
            alert(data.message)
          } else if (data && data.message === "Não foi possível atualizar o valor, tente novamente") {
            alert(data.message);
          }else {
            alert("Erro desconhecido ao atualizar.");
          }
        })
        .catch(error => {
          console.error('Erro ao atualizar tipo:', error);
          alert('Erro ao atualizar tipo: ' + error.message);
        });
    };
    const atualizarEstoque = (event) => {
      event.preventDefault(); 
  
      const formData = new FormData(event.target);
  
      fetch(`${API_URL}/atualizar_estoque`, {
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
          console.log('Resposta do logar:', data);
          if (data && data.message === "Estoque atualizado com sucesso!") {
            alert(data.message)
          } else if (data && data.message === "Não foi possível atualizar o estoque, tente novamente") {
            alert(data.message);
          }else {
            alert("Erro desconhecido ao atualizar.");
          }
        })
        .catch(error => {
          console.error('Erro ao atualizar tipo:', error);
          alert('Erro ao atualizar tipo: ' + error.message);
        });
    };
    useEffect(() => {
      fetch(`${API_URL}/produtos`, {
        method: 'GET',
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
    useEffect(() => {
        fetch(`${API_URL}/pedidos`) 
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            setPedidos(data.pedidos);
          })
          .catch(error => {
            console.error('Erro ao buscar produtos:', error);
          });
      }, []);
    const deletarProduto = (event) => {
      event.preventDefault(); 
  
      const formData = new FormData(event.target);
  
      fetch(`${API_URL}/deletar_produto`, {
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
          console.log('Resposta do logar:', data);
          if (data && data.message === "Produto deletado com sucesso") {
            alert(data.message)
            fetch(`${API_URL}/produtos`)
          } else if (data && data.message === "Não foi possível deletar o produto, tente novamente") {
            alert(data.message);
          }else {
            alert("Erro desconhecido ao atualizar.");
          }
        })
        .catch(error => {
          console.error('Erro ao atualizar tipo:', error);
          alert('Erro ao atualizar tipo: ' + error.message);
        });
    };
    const navegarParaLogin = () => {
      navigate('/login');
    };
  
    const irPedidos = () => {
      setMostrarPedidos(true)
      setCriar(false)
      setEditar(false)
      };
      const irCriar = () => {
        setMostrarPedidos(false)
        setCriar(true)
        setEditar(false)
        };
        const irEditar = () => {
          setMostrarPedidos(false)
          setCriar(false)
          setEditar(true)
          };
    return (
      <main>
        <div style={{display: mostarPedidos? 'flex' : 'none' }}>
        {pedidos.map(filtro => (
            <div key={filtro["id"]} className='divProduto'>   
                    <form method="post">
                    <h1>{filtro["produtos"]}</h1>
                    <input type='hidden' name="produtos" value={filtro["produtos"]}></input>
                    <br></br>
                    <h3>Pagante:{filtro["comprador"]}</h3>
                    <br></br>
                    <p>Usuário:{filtro["usuario"]}</p>
                    <input type='hidden' name="usuario" value={filtro["usuario"]}></input>
                    <br></br>
                    <p>Valor: {filtro["valor"]}</p>
                    <br></br>
                    <p>Telefone: {filtro["telefone"]}</p>
                    <br></br>
                    <p>Endereço: {filtro["endereco"]}</p>
                    <br></br>
                    <p>Status: {filtro["status"]}</p>
                        Alterar status pedido:
                        <select name="status" id="">
                            <option value="Preparando pedido">Preperando pedido</option>
                            <option value="Enviado">Enviado</option>
                            <option value="Entregue">Entregue</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                        <button type='submit'>Mudar status</button>
                    </form>
                </div>
        ))}  
        </div>
        <div style={{display: criar? 'flex' : 'none' }} className='divCriar'>
          <div>
          <form  onSubmit={adicionarProduto} method="post">
              <h3>Criar produto</h3>
              <br />
              <label>Produto:</label>
              <br />
              <input type='text' name="nome" placeholder='Digite aqui o produto que deseja criar' />
              <br />
              <label>Marca:</label>
              <br />
              <input type='text' name="marca" placeholder='Digite aqui a marca' />
              <br/>
              <label>Cor:</label>
              <br />
              <fieldset>
                <legend>Selecione as cores disponíveis:</legend>

                <div>
                  <input type="checkbox" id="off-white" name="off-white" />
                  <label for="off-white">off-white</label>
                </div>

                <div>
                  <input type="checkbox" id="preta" name="preta" />
                  <label for="preta">Preta</label>
                </div>
                <div>
                  <input type="checkbox" id="xadrez" name="xadrez" />
                  <label for="xadrez">Xadrez</label>
                </div>
                <div>
                  <input type="checkbox" id="listrada" name="listrada" />
                  <label for="listrada">Listrada</label>
                </div>
                <div>
                  <input type="checkbox" id="camel" name="camel" />
                  <label for="camel">Camel</label>
                </div>
                <div>
                  <input type="checkbox" id="estampa" name="estampa" />
                  <label for="estampa">Estampa</label>
                </div>
                <div>
                  <input type='text' name="outra1" placeholder='Digite aqui a cor' />
                </div>
                <div>
                  <input type='text' name="outra2" placeholder='Digite aqui a cor' />
                </div>
            </fieldset>
              <br />
              <label>Numeração:</label>
              <br />
              <fieldset>
                <legend>Selecione as numerações disponíveis:</legend>

                <div>
                  <input type="checkbox" id="36" name="36" />
                  <label for="36">36</label>
                </div>
                <div>
                  <input type="checkbox" id="38" name="38" />
                  <label for="38">38</label>
                </div>
                <div>
                  <input type="checkbox" id="40" name="40" />
                  <label for="40">40</label>
                </div>
                <div>
                  <input type="checkbox" id="42" name="42" />
                  <label for="42">42</label>
                </div>
            </fieldset>
              <br />
              <br></br>
              <select name="genero">
                <option value="" disabled>Selecione o gênero</option>
                <option value="bolsa">Bolsa</option>
                <option value="tenis">Tênis</option>
                <option value="acessorio">Acessório</option>
                <option value="outro">Outro</option>
              </select>
              <br />
              <label>Descrição:</label>
              <br />
              <input type='text' name="descricao" placeholder='Digite aqui a descrição do produto' />
              <br />
              <label>Preço:</label>
              <br />
              <input type='number' step="0.01" name="valor" placeholder='Digite aqui o preço' />
              <br />
              <label>Imagem:</label>
              <br />
              <input type='file' name="imagem" />
              <button type='submit' style={{color:"white"}}>Criar</button>
              <br />
            </form>
          </div>
        </div>
        <div style={{display: editar? 'flex' : 'none' }} className='divEditar'>
          <div> 
              <form onSubmit={atualizarPreco} method="post">
                  <h3>Atualizar o preço</h3>
                  <label>Novo preço:</label>
                  <br />
                  <input type='number' name="preco" placeholder='Digite aqui o novo preço' />
                  <br />          
                  <label>Produto:</label>
                  <br />
                  <select name="produto" id="">
                  <option value="">Selecione o produto</option>
                  {produtos.map(produto => (
                      <option key={produto["id"]} value={produto["nome"]}>{produto["nome"]}</option>
                  ))}
                  </select>
                  <button type='submit'>atualizar</button>
              </form>
          </div>
          <div> 
              <form onSubmit={atualizarEstoque} method="post">
                  <h3>Atualizar o estoque</h3>
                  <label>Nova quantidade:</label>
                  <br />
                  <input type='number' name="quantidade" placeholder='Digite aqui a quantidade a ser adicionada' />
                  <br />          
                  <label>Produto:</label>
                  <br />
                  <select name="produto" id="">
                  <option value="">Selecione o produto</option>
                  {produtos.map(produto => (
                      <option key={produto["id"]} value={produto["nome"]}>{produto["nome"]}</option>
                  ))}
                  </select>
                  <br />
                  <input type='number' name="tamanho" placeholder='Digite aqui a numeracao do produto' />
                  <br />
                  <br />
                  <input type='number' name="cor" placeholder='Digite aqui o valor a ser adicionado' />
                  <br />
                  <button type='submit'>Atualizar</button>
              </form>
          </div>
          <div> 
              <form onSubmit={deletarProduto} method="post">
                  <h3>Deletar produto</h3>           
                  <label>Produto:</label>
                  <br />
                  <select name="produto" id="">
                  <option value="">Selecione o produto</option>
                  {produtos.map(produto => (
                      <option key={produto["id"]} value={produto["nome"]}>{produto["nome"]}</option>
                  ))}
                  </select>
                  <button type='submit'>Deletar</button>
              </form>
          </div>
        </div>
        <div className='barraAdmin'>
          <button onClick={irCriar}><img src="/images/criar.png" alt='adicionar'></img></button>
          <button onClick={irEditar}><img src="/images/editar.png" alt='editar'></img></button>
          <button onClick={irPedidos}><img src="/images/pedidos.png" alt='pedido'></img></button>              
        </div>
      </main>
    );
  }
  
  
  export default Admin;