$(document).ready(function () {
    $(window).scroll(function () {
        /* sticky navbar on scroll script */
        if (this.scrollY > 20) {
            $('.navbar').addClass("sticky");
        } else {
            $('.navbar').removeClass("sticky");
        }

        // scroll-up button show/hide script
        if (this.scrollY > 500) {
            $('.scroll-up-btn').addClass("show");
        } else {
            $('.scroll-up-btn').removeClass("show");
        }
    });

        /* slide-up script  */
            $('.scroll-up-btn').click(function () {
                $('html').animate({ scrollTop: 0 });
                // removing smooth scroll on slide-up button click
                $('html').css("scrollBehavior", "auto");
            });
        
            $('.navbar .menu li a').click(function () {
                // applying again smooth scroll on menu items click
                $('html').css("scrollBehavior", "smooth");
            });
      

        /* toggle menu/navbar script */
            $('.menu-btn').click(function () {
                $('.navbar .menu').toggleClass("active");
                $('.menu-btn i').toggleClass("active");
            });
       

        /* typing text animation script */
            var typed = new Typed(".typing", {
                strings: ["Scanați QR coduri", "Adăugați cheltuieli cu ajutorul la AI", "Analizați cheltuielile din ultimile luni"],
                typeSpeed: 100,
                backSpeed: 60,
                loop: true
            });
        
            var typed = new Typed(".typing-2", {
                strings: ["Orientați spre rezultate", "Pasionați de tehnologie", "Creativi", "Deschiși la învățare"],
                typeSpeed: 100,
                backSpeed: 60,
                loop: true
            });
       

        /* owl carousel script*/
            $('.carousel').owlCarousel({
                margin: 20,
                loop: true,
                autoplay: true,
                autoplayTimeOut: 2000,
                autoplayHoverPause: true,
                responsive: {
                    0: {
                        items: 1,
                        nav: false
                    },
                    600: {
                        items: 2,
                        nav: false
                    },
                    1000: {
                        items: 3,
                        nav: false
                    }
                }
            });
        
        
// QR Code Reader - scanare din imagine
const fileInput = document.getElementById('qr-image-upload');
const resultDiv = document.getElementById('qr-reader-results');

if(fileInput && resultDiv){
    fileInput.addEventListener('change', function(e){
        const file = e.target.files[0];
        if(!file) return;

        const reader = new FileReader();
        reader.onload = function(){
            const html5Qr = new Html5Qrcode("qr-reader");
            html5Qr.scanFile(file, true)
                .then(decodedText => {
                    resultDiv.textContent = 'QR Code: ' + decodedText;
                    resultDiv.style.color = '#00ffcc'; // succes
                })
                .catch(err => {
                    resultDiv.textContent = 'Nu s-a găsit niciun QR valid.';
                    resultDiv.style.color = '#ff4d4f'; // eroare
                });
        }
        reader.readAsDataURL(file);
    });
}

    });

    document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    function addMessage(message, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message', sender);
        msgDiv.textContent = message;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function getGPTResponse(userText) {
        addMessage("...", 'bot'); // mesaj temporar
        const messages = Array.from(chatBox.querySelectorAll('.chat-message')).map(msg => {
            return { role: msg.classList.contains('user') ? 'user' : 'assistant', content: msg.textContent };
        });

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_OPENAI_API_KEY' // înlocuiește cu cheia ta
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "Ești un asistent util." },
                        { role: "user", content: userText }
                    ],
                    max_tokens: 200
                })
            });

            const data = await response.json();
            // Eliminăm mesajul temporar "..."
            chatBox.querySelector('.chat-message.bot:last-child').remove();
            addMessage(data.choices[0].message.content, 'bot');
        } catch (err) {
            chatBox.querySelector('.chat-message.bot:last-child').remove();
            addMessage("Eroare la conectarea cu GPT.", 'bot');
            console.error(err);
        }
    }

    async function trimiteCheltuiala(text) {
        const response = await fetch("http://127.0.0.1:5000/api/cheltuieli", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text })
        });
    
        const data = await response.json();
        console.log(data); // aici primești lista de cheltuieli
    }

    function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;
        addMessage(text, 'user');
        userInput.value = '';
        getGPTResponse(text);
    }

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e){
        if(e.key === 'Enter'){
            sendMessage();
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("products-table");
  const rows = table.querySelectorAll("tbody tr");
  let total = 0;

  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    const cantitate = parseFloat(cells[1].textContent);
    const pret = parseFloat(cells[2].textContent);
    const subtotal = cantitate * pret;

    cells[3].textContent = subtotal.toFixed(2);

    total += subtotal;
  });

  document.getElementById("total-sum").textContent = total.toFixed(2) + " lei";
});
