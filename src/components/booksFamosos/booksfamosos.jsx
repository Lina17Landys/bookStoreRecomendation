import React from 'react';
import './booksf.css';

const BooksFamosos = () => {
    return (
        <div id="booksFamosos-container">

            <h1 className='title-booksFamous'>Las 6 lecturas más recomendadas</h1>

            <div id='bookWrapper'>

                <div id='bookCover'>
                    <img src='./src/assets/img/Spare-prince-harry.png'></img>
                    <h1>Spare</h1>
                    <p>Prince Harry</p>
                </div>

                <div id='bookCover'>
                    <img src='./src/assets/img/im-glad-my-mom-died.png'></img>
                    <h1>I’m Glad My Mom Died</h1>
                    <p>Jennette McCurdy</p>
                </div>

                <div id='bookCover'>
                    <img src='./src/assets/img/atomic-habits.png'></img>
                    <h1>Atomic Habits</h1>
                    <p>James Clear</p>
                </div>
                
                <div id='bookCover'>
                    <img src='./src/assets/img/someone-elses-shoes.png'></img>
                    <h1>Someone Else’s Shoes</h1>
                    <p>Jojo Moyes</p>
                </div>

                <div id='bookCover'>
                    <img src='./src/assets/img/not-give-a-fuck.png'></img>
                    <h1>The Subtle Art Of Not Giving A F*ck</h1>
                    <p>Mark Manson</p>
                </div>
                
                <div id='bookCover'>
                    <img src='./src/assets/img/8-rules-of-love.png'></img>
                    <h1>8 Rules Of Love</h1>
                    <p>Jay Shetty</p>
                </div>
            </div>

        </div>
    );
};

export default BooksFamosos;