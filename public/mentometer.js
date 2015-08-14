(function() {

    var sock = new SockJS('/echo');

    sock.onopen = createSend({ type: "connect", name: window.location.hash.substr(1) });
    sock.onclose = function() { location.reload() };

    function answer(alternative) {
        var type = window.location.hash.substr(1);
        return createSend({ type: 'answer', alternative: alternative, name: type });
    }

    function createSend(data) {
        return function() {
            sock.send(JSON.stringify(data));
        }
    }

    document.querySelector('.alternative-a').addEventListener('click', answer('a'));
    document.querySelector('.alternative-b').addEventListener('click', answer('b'));
    document.querySelector('.alternative-c').addEventListener('click', answer('c'));
    document.querySelector('.alternative-d').addEventListener('click', answer('d'));

    document.getElementById('alternative-a').href = '#' + window.location.hash.substr(1);
    document.getElementById('alternative-b').href = '#' + window.location.hash.substr(1);
    document.getElementById('alternative-c').href = '#' + window.location.hash.substr(1);
    document.getElementById('alternative-d').href = '#' + window.location.hash.substr(1);

})();