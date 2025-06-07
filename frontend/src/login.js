import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import App from './App.js';
import Perfil from './Perfil.js';
import Admin from './Admin.js'
import './login.css';
function Login() {
const [mensagem, setMensagem] = useState('');
const navigate = useNavigate();
const location = useLocation();
const [mostrarLogin, setMostrarLogin] = useState(true);
const [mostrarCriarConta, setMostrarCriarConta] = useState(false);
const token = localStorage.getItem('token');
const API_URL = process.env.REACT_APP_API_URL;
  const navegarParaMain = () => {
    navigate('/app');
    setMostrarLogin(false)
  };
  const navegarParAdmin = () => {
    navigate('/admin');
    setMostrarLogin(false)
  };
  const logar = (event) => {
    event.preventDefault(); 

    const formData = new FormData(event.target); 

    fetch(`${API_URL}/login`, {
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
        if (data && data.message === "Login realizado com sucesso") {
          localStorage.setItem('token', data.sessao);
          navegarParaMain()
        } else if (data && data.message === "Usuário ou senha incorretos, tente novamente") {
          alert(data.message);
        }else if (data && data.message === "admin") {
  navegarParAdmin();
        }else {
          setMostrarLogin(false)
          alert("Erro desconhecido ao logar.");
        }
      })
      .catch(error => {
        console.error('Erro ao logar:', error);
        alert('Erro ao logar: ' + error.message);
      });
  };
  const criarConta = (event) => {
    event.preventDefault(); // Evita o comportamento padrão de submit

    const formData = new FormData(event.target); // Coleta os perfils do formulário

    fetch(`${API_URL}/cadastro`, {
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
        console.log('Resposta do criar conta:', data);
        if (data && data.message === "Usuário cadastrado com sucesso") {
          setMostrarCriarConta(false)
          setMostrarLogin(true)
        } else if (data && data.message === "Usuário com este email já existe!") {
          alert(data.message);
        }else if (data && data.message === "As senhas não correspondem!") {
          alert(data.message);
        }else if (data && data.message === "CPF inválido!") {
          alert(data.message);
        } else {
          alert("Erro desconhecido ao criar a conta.");
        }
      })
      .catch(error => {
        console.error('Erro ao criar conta:', error);
        alert('Erro ao criar conta: ' + error.message);
      });
  };

  return (
    <main>
       <div style={{display: mostrarLogin? 'flex' : 'none'}} className='divLogin'>
            <form onSubmit={logar} method="post" >
                <label>Email cadastrado</label>
                <br />
                <input type="email" placeholder="Insira o seu email" name="email" />
                <br />
                <label>Senha</label>
                <br />
                <input type="password" placeholder="Insira a sua senha" name="senha" />
                <br></br>
                <button type="submit">Entrar</button>
            </form>
            <button onClick={() => {
                    setMostrarCriarConta(true);
                    setMostrarLogin(false);}}>
                    Criar conta
            </button>
        </div>
        <div style={{display: mostrarCriarConta? 'flex' : 'none', flexDirection:"column"}} className='divCriarConta'>
            <form onSubmit={criarConta} method="post">
                <label>Nome de usuário</label>
                <br />
                <input type="text" placeholder="Insira seu nome de usuário" name="nome" />
                <br />
                <label>CPF</label>
                <br />
                <input type="number" placeholder="Insira o seu cpf" name="cpf" />
                <br />
                <label>Data de nascimento</label>
                <br />
                <input type="date" name="dataNascimento" />
                <br />
                <label>Email</label>
                <br />
                <input type="email" placeholder="Insira o seu email" name="email" />
                <br />
                <label>Telefone</label>
                <br />
                <input type="tel" placeholder="Insira o seu telefone" name="telefone" />
                <br />
                <label>Senha</label>
                <br />
                <input type="password" placeholder="Insira a sua senha" name="senha" />
                <br></br>
                <label>Confirmar senha</label>
                <br />
                <input type="password" placeholder="Confirme aqui sua senha" name="confirmarSenha" />
                <br></br>
                <button type="submit">Criar conta</button>
            </form>
        </div>
      <Routes>
        <Route path="/app" element={<App/>} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </main>
  );
}

export default Login;

