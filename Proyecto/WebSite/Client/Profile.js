document.addEventListener('DOMContentLoaded', ()=>{
    Validar();
})

async function Validar() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch("/login/client", { 
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });
        if (response.ok) {
            
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}