// Con este socket, que trabaja de lo otro importado en el html, se establece la comunicación con el servidor.
const socket = io();

// Swal.fire({
//     title:'Saludo',
//     text:'Mensaje inicial',
//     icon:'success'
// })

// Desarrollo del modal de autenticación
const chatBox = document.getElementById('chatBox');

const messagesLog = document.getElementById('messageLogs');

let user;

Swal.fire({
    title: 'Ingresa tus datos',
    input: 'text',
    text: 'Ingresa tu usuario para poder chatear!',
    inputValidator: (value) => {
        return !value && 'Necesitas escribir un nombre para ingresar!'
    },
    allowOutsideClick: false,
    allowEscapeKey: false
}).then(result => {
    user = result.value;
    socket.emit('authenticated', user);
});


chatBox.addEventListener('keyup', e => {
    if (e.key == 'Enter') {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', { user, message: chatBox.value });
            chatBox.value = '';
        }
    }
})


socket.on('messageLogs', data => {
    let messages = '';
    data.forEach(message => {
        messages += `${message.user} dice: ${message.message} </br>`
    });
    messagesLog.innerHTML=messages;

});

socket.on('newUserConnected', data => {
    Swal.fire({
        toast:true,
        position:'top-end',
        showConfirmationButton: false,
        timer: 3000,
        title:`${data} se ha unido al chat`,
        icon:'success'

    })
})


