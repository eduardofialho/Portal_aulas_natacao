import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

const Header = () => {
  const handleLogout = () => {
    window.location.href = '/login';
  };

  const user = JSON.parse(localStorage.getItem('user'));
  console.log("user -->", user);

  return (
    <header className="fixed top-0 left-0 w-full h-14 flex items-center bg-blue-400 text-white px-6 z-50">
      {/* Imagem no canto esquerdo */}
      <div className="flex-shrink-0">
        <img
          src="/img_debora.jpg"
          alt="Profile"
          className="h-12 w-12 object-cover rounded-full mr-4"
        />
      </div>

      {/* Conteúdo principal do header */}
      <div className="flex flex-col justify-center flex-grow">
        {
          user.role === 'professora' ? (
            <h1 className="text-lg font-bold ml-10">Seja bem-vinda professora {user.nome}!</h1>
          ) : (
            <h1 className="text-lg font-bold ml-10">Seja bem-vindo(a) {user.nome}!</h1>
          )
            
        }
      </div>

      {/* Botão Instagram */}
      <a href="https://www.instagram.com/debora_recla?igsh=MTMzdzZvMHp1cTJqZg==" target="_blank" rel="noopener noreferrer" className="mr-4">
        <FontAwesomeIcon icon={faInstagram} size="2x" className="text-white hover:text-yellow-300 transition duration-200" />
      </a>

      {/* Botão Sair */}
      <button 
        onClick={handleLogout} 
        className="ml-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-200">
        Sair
      </button>
    </header>
  );
};

export default Header;
