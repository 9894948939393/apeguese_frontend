import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Perfil.css';
import Main from './main.js';
function Perfil() {
const [mensagem, setMensagem] = useState('');
const [perfil, setPerfil] = useState('');
const [mostrarGeralPerfil, setMostrarGeralPerfil] = useState(true);
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

useEffect(() => {
    axios.get('${API_URL}/api/hello')//conexão com o backend
      .then(res => setMensagem(res.data.message))
      .catch(err => console.error(err));
  }, []);
  const navegarParaMain = () => {
    navigate('/main');
  };
  const carregarPerfil = () => {
    fetch('${API_URL}/perfil', {
      method: "GET",
      credentials: 'include'
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
        <div style={{display: mostrarGeralPerfil? 'flex' : 'none',color:"white", flexDirection:"column"}}>
          <h1>Sua conta</h1>
          <div style={{display:"flex"}}>
          <div>
            <button>Alterar email</button>
            <button>Alterar telefone</button>
            <button>Alterar nome de usuário</button>
            <button>Alterar senha</button>
            <button>Alterar endereço</button>
          </div>
          {perfil ?(
              <div key={perfil[0]} className='divInformacoesPerfil'>
                <h3>Nome de usuário</h3>                
                <p>{perfil[1]}</p>
                <h3>Email</h3>                
                <p>{perfil[2]}</p>
                <h3>Telefone</h3>                
                <p>{perfil[4]}</p>
                <h3>Cep</h3>                
                <p>{perfil[11]}</p>
                <h3>Rua</h3>                
                <p>{perfil[13]}</p>
                <h3>Número</h3>                
                <p>{perfil[12]}</p>
                <h3>Bairro</h3>                
                <p>{perfil[14]}</p>
                <h3>Cidade</h3>                
                <p>{perfil[15]}</p>
                <h3>Estado</h3>                
                <p>{perfil[16]}</p>
                <h3>Complemento</h3>                
                <p>{perfil[17]}</p>
              </div>
            ):( 
              <p>Carregando perfil...</p>)}
          </div>
        </div>
      </div>
      <footer style={{display: mostrarGeralPerfil? 'flex' : 'none'}}></footer>
      <Routes>
        <Route path="/main" element={<Main />} />
      </Routes>
    </main>
  );
}
export default Perfil;