'use strict';

(function init() {
  var socket = io();
  var jpegImg = document.getElementById('jpegImg');
  var jpegSocket;
  socket.on('start', function (cou) {
    $(".mdl-navigation__link").on("click", function () {
      console.log("CAM: " + $(this)[0].id);

      if (jpegSocket) {
        jpegSocket.disconnect();
      }

      jpegSocket = io(location.origin + "/cam" + $(this)[0].id);
      jpegSocket.on('data', function (data) {
        var arrayBufferView = new Uint8Array(data);
        var blob = new window.Blob([arrayBufferView], {
          type: 'image/jpeg'
        });
        var urlCreator = window.URL || window.webkitURL;
        jpegImg.src = urlCreator.createObjectURL(blob);
      });
    });
    /* -------------------- cleanup -------------------- */

    window.addEventListener('beforeunload', function (evt) {
      jpegSocket.disconnect();
    });
  });
})();