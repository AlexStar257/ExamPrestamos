// Función para ocultar el mensaje de éxito después de 3 segundos
setTimeout(function () {
    var successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.style.display = 'none';
    }
}, 3000);



