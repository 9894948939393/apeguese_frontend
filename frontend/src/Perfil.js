import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Perfil.css';
import App from './App.js';
function Perfil() {
const [mensagem, setMensagem] = useState('');
const [perfil, setPerfil] = useState('');
const [mostrarGeralPerfil, setMostrarGeralPerfil] = useState(true);
const [mostrarAlterarEndereco, setMostrarAlterarEndereco] = useState(false);
const token = localStorage.getItem('token');
const navigate = useNavigate();
const location = useLocation();
const API_URL = process.env.REACT_APP_API_URL;  
useEffect(() => {     
    if (location.pathname === '/perfil') {
      setMostrarGeralPerfil(true)
      carregarPerfil();
    } else{
      setMostrarGeralPerfil(false)
    }
  }, [location.pathname]);
  const navegarParaMain = () => {
    navigate('/app');
  };
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
            setMostrarAlterarEndereco(false)
            setMostrarGeralPerfil(true)
            fetch(`${API_URL}/perfil`)
        }
      })
      .catch(error => {
        console.error('Erro ao adicionar aos favoritos', error);
        alert('Erro ao adicionar aos favoritos: ' + error.message);
      });
  };
  const carregarPerfil = () => {
    fetch(`${API_URL}/perfil`, {
      method: "GET",
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
        if (data.perfil && data.perfil.length > 0) {
          setPerfil(data.perfil[0]);
        } else {
          setPerfil(null);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar perfil:', error);
      });
  };
  const Logout = (event) => {
    event.preventDefault(); 

    const formData = new FormData(event.target);

    fetch(`${API_URL}/logout`, {
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
            setMostrarAlterarEndereco(false)
            setMostrarGeralPerfil(false)
            navegarParaMain()
        }else{
          alert("Não foi possível alterar o endereço")
        }
      })
      .catch(error => {
        console.error('Erro ao adicionar aos favoritos', error);
        alert('Erro ao adicionar aos favoritos: ' + error.message);
      });
  };
  const irAlterarEndereco = () => {
                setMostrarAlterarEndereco(true)
                setMostrarGeralPerfil(false)
              }
  return (
    <main>
      <header style={{display: mostrarGeralPerfil? 'flex' : 'none'}}>
      <div className='headerContainer'>
          <img src="/images/logo_dark.png" alt='club raro'></img>
          <form>
            <input type="search" placeholder='Pesquisar perfil'></input>
            <button type='submit'>
              <img src='/images/lupa.png' alt='lupa'></img>
            </button>
          </form>
          <div className='divBotoes'>
              <button ><img alt='Carrinho' src='/images/carrinho.png'></img></button>
              <button onClick={navegarParaMain}> <img  alt='Perfil' src='/images/home.png'></img></button>
          </div>
        </div>
      </header>
      <div>
          <div style={{display:'flex', flexDirection:"column"}}>
            <button>Alterar email</button>
            <button>Alterar telefone</button>
            <button>Alterar nome de usuário</button>
            <button>Alterar senha</button>
            <form><button>Logout</button></form>
            <button onClick={irAlterarEndereco}>Alterar endereço</button>
          </div>
        <div style={{display: mostrarGeralPerfil? 'flex' : 'none',color:"white", flexDirection:"column"}}>
          <h1>Sua conta</h1>
          <div style={{display:"flex"}}>
          {perfil ?(
              <div key={perfil["id"]} className='divInformacoesPerfil'>
                <h3>Nome de usuário</h3>                
                <p>{perfil["usuario"]}</p>
                <h3>Email</h3>                
                <p>{perfil["email"]}</p>
                <h3>Telefone</h3>                
                <p>{perfil["telefone"]}</p>
                <h3>Cep</h3>                
                <p>{perfil["cep"]}</p>
                <h3>Rua</h3>                
                <p>{perfil["rua"]}</p>
                <h3>Número</h3>                
                <p>{perfil["numero"]}</p>
                <h3>Bairro</h3>                
                <p>{perfil["bairro"]}</p>
                <h3>Cidade</h3>                
                <p>{perfil["cidade"]}</p>
                <h3>Estado</h3>                
                <p>{perfil["estado"]}</p>
                <h3>Complemento</h3>                
                <p>{perfil["complemento"]}</p>
              </div>
            ):( 
              <p>Carregando perfil...</p>)}
          </div>
          <div style={{display: mostrarAlterarEndereco? 'flex' : 'none'}}>
            <form onSubmit={alterarEndereco} method='post'>
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
        </div>
      </div>
      <footer style={{display: mostrarGeralPerfil? 'flex' : 'none'}}></footer>
      <Routes>
        <Route path="/app" element={<App />} />
      </Routes>
    </main>
  );
}
export default Perfil;