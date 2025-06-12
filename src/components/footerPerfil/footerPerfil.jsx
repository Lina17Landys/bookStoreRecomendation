import "./fPerfil.css"

const FooterPerfil = () => {
  return (
    <div id="footerUser">
 
 <div className="enlacesCom">
<h1>Compañia</h1>
<p style={{ cursor: 'pointer', color: '#382110' }} onClick={() => window.open('https://t.me/Imula_bot', '_blank')}>
  Telegram
</p>
<p>Contacto</p>
</div>

<div className="redesSociales">
    <h1>Conéctate</h1>
    <img src="./src/assets/img/red1.svg"></img>
    <img src="./src/assets/img/red2.svg"></img>
    <img src="./src/assets/img/red3.svg"></img>
    <img src="./src/assets/img/red4.svg"></img>
</div>

<p>© 2025 Goodrecoms, Inc.</p>
</div>
  );
};

export default FooterPerfil;