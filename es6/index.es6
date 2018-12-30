'use strict';

(function init() {
    const socket = io();
    const jpegImg = document.getElementById('jpegImg');
    var jpegSocket;
    socket.on('start', function (cou) {
        $(".mdl-navigation__link").on("click", function () {
            console.log("CAM: " + $(this)[0].id);
            if (jpegSocket) {
                jpegSocket.disconnect();
            }
            jpegSocket = io(location.origin + "/cam" + $(this)[0].id);
            jpegSocket.on('data', (data) => {
                const arrayBufferView = new Uint8Array(data);
                const blob = new window.Blob([arrayBufferView], {
                    type: 'image/jpeg'
                });
                const urlCreator = window.URL || window.webkitURL;
                jpegImg.src = urlCreator.createObjectURL(blob);
            });
        });
        /* -------------------- cleanup -------------------- */
        window.addEventListener('beforeunload', (evt) => {
            jpegSocket.disconnect();
        });
    });
})();