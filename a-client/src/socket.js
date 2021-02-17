import io from "socket.io-client";
var socketApp = (function () {
    var socket = io("http://localhost:2704", {
        withCredentials: true,
    })

    return {
        getSocket: function () { return socket; }
    }
})();
export default socketApp