;(function() {

    var sock = new SockJS('/echo');

    sock.onopen = createSend({ type: "connect" });
    sock.onclose = function() { location.reload() };

    function answer(alternative) {
        return createSend({ type: 'answer', alternative: alternative });
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

})();