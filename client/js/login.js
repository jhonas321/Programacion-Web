document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const contrasena = document.getElementById('contrasena').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuario, contrasena })
            });

            const data = await response.json();

            if (data.valido) {
                                
                sessionStorage.setItem('user', data.nom);
                sessionStorage.setItem('userId', data.idUser);

                if (data.admi) {
                    window.location.href = '../html/administrador.html';                   
                } else {        
                    window.location.href = '../html/principal.html';
                }
            } else {          
                alert('Usuario o contraseña incorrecta');
            }
        } catch (error) {
            console.error('Hubo un error:', error);
            alert('Hubo un problema al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
        }
    });
});
