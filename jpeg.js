const rtsp = require('./rtsp-ffmpeg');
module.exports = (app, io) => {

  var cams = [
    "rtsp://192.168.1.108:554/user=admin&password=&channel=1&stream=0.sdp",
    "rtsp://192.168.1.108:554/user=admin&password=&channel=2&stream=0.sdp",
    "rtsp://192.168.1.108:554/user=admin&password=&channel=4&stream=0.sdp"
  ].map(function (uri, i) {
    var stream = new rtsp.FFMpeg({
      input: uri,
    });
    stream.on('start', function () {
      console.log('stream ' + (i + 1) + ' started');
    });
    stream.on('stop', function () {
      console.log('stream ' + (i + 1) + ' stopped');
    });
    stream.on('error', function (error) {
      console.log(error);
    });
    return stream;
  });

  cams.forEach(function (camStream, i) {
    var ns = io.of('/cam' + (i + 1));
    ns.on('connection', function (wsocket) {
      console.log('connected to /cam' + (i + 1));
      var pipeStream = function (data) {
        wsocket.emit('data', data);
      };
      camStream.on('data', pipeStream);

      wsocket.on('disconnect', function () {
        console.log('disconnected from /cam' + (i + 1));
        camStream.removeListener('data', pipeStream);
      });
    });
  });

  io.on('connection', function (socket) {
    console.log(socket.id);
    socket.emit('start', cams.length);
  });
};