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
          setProdutos(data);
          
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
            <div key={filtro[0]} className='divProduto'>   
                    <h1>{filtro[3]}</h1>
                    <h3>Pagante:{filtro[2]}</h3>
                    <p>Usuário:{filtro[1]}</p>
                    <p>Valor: {filtro[4]}</p>
                    <p>Telefone: {filtro[6]}</p>
                    <p>Endereço: {filtro[7]}</p>
                    <p>Status: {filtro[5]}</p>
                    <form method="post">
                        Alterar status pedido:
                        <select name="status" id="">
                            <option value="Preparando pedido">Preperando pedido</option>
                            <option value="Enviado">Enviado</option>
                            <option value="Entregue">Entregue</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
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
              <input type='text' name="cor" placeholder='Digite aqui a cor' />
              <br />
              <label>Numeração:</label>
              <br />
              <input type='number' step="0.01" name="numeracao" placeholder='Digite aqui o preço' />
              <br />
              <br></br>
              <select name="genero">
                <option value="" disabled>Selecione o gênero</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="unissex">Unissex</option>
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
                  <label>Filial:</label>
                  <br />           
                  <label>Produto:</label>
                  <br />
                  <select name="produto" id="">
                  <option value="">Selecione o produto</option>
                  {Array.isArray(produtos) && produtos.map(produto => (
                      <option key={produto[0]} value={produto[1]}>{produto[1]}</option>
                  ))}
                  </select>
                  <button type='submit'>atualizar</button>
              </form>
          </div>
          <div> 
              <form onSubmit={deletarProduto} method="post">
                  <h3>Deletar produto</h3>           
                  <label>Produto:</label>
                  <br />
                  <select name="produto" id="">
                  <option value="">Selecione o produto</option>
                  {
                  Array.isArray(produtos) && produtos.map(produto => (
                      <option key={produto[0]} value={produto[1]}>{produto[1]}</option>
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