(function() {

    var questions = [
        {
            "question": "Er dere&nbsp;klare?",
            "alternatives": [
                "Ja",
                "Nei"
            ],
            "rightanswer": "a"
        },
        {
            "question": "Uttrykket “sjakk matt stammer fra persisk, og betyr ...”?",
            "alternatives": [
                "Kongen er beseiret",
                "Kongen er død",
                "Det er over",
                "Du er død"
            ],
            "rightanswer": "a"

        },
        {
            "question": "Hva står CIA for?",
            "alternatives": [
                "Criminal investigation agency",
                "Central Intelligence Agency",
                "Central Investigation Agency",
                "Civillian Intelligence Agency"
            ],
            "rightanswer": "b"
        },
        {
            "question": "Hvilket grunnstoff har det kjemiske symbolet Ag?",
            "alternatives": [
                "Gull",
                "Sølv",
                "Kvittsølv",
                "Jern"
            ],
            "rightanswer": "b"
        },
        {
            "question": "Hvilke av disse vindstyrkene er sterkest? ",
            "alternatives": [
                "Laber bris",
                "Lett bris",
                "Flau vind",
                "Svak vind"
            ],
            "rightanswer": "a"
        },
        {
            "question": "Hva heter landet med dette flagget? ",
            "alternatives": [
                "Malaysia",
                "Burma",
                "Kambodsja",
                "Thailand"
            ],
            "rightanswer": "c"
        },
        {
            "question": "Hva heter kunnskapsminister vår? ",
            "alternatives": [
                "Bent Høie",
                "Børge Brende",
                "Bård Vegar Solhjell",
                "Torbjørn Røe Isaksen"
            ],
            "rightanswer": "d"
        },
        {
            "question": "Hvilket år ble BEKK stiftet? ",
            "alternatives": [
                "2000",
                "2001",
                "2002",
                "2003"
            ],
            "rightanswer": "a"
        },
        {
            "question": "Hvem av disse er sjefen i BEKK?",
            "alternatives": [
                "Bernt",
                "frode",
                "fredrik",
                "olav"
            ],
            "rightanswer": "d"
        },
        {
            "question": "Hva er kallenavnet på BEKK sine to kontorer?",
            "alternatives": [
                "Brakka og Festningen",
                "Skuret og Brakka",
                "Blikkboksen og Skuret",
                "Blikkboksen og Festningen"
            ],
            "rightanswer": "c"
        },
        {
            "question": "Hvor mange faggrupper er det i BEKK? ",
            "alternatives": [
                "40",
                "30",
                "20",
                "15"
            ],
            "rightanswer": "b"
        },
        {
            "question": "I fjor vant BEKK designprisen Merket for god design, for hvilken kunde var det?",
            "alternatives": [
                "Sparebank1",
                "Statens vegvesen",
                "Posten",
                "Den Norske Opera & Ballett"
            ],
            "rightanswer": "d"
        },
        {
            "question": "Hva skjedde på innflytningsfesten til BEKK?",
            "alternatives": [
                "Gulvet knakk sammen",
                "Gulvet knakk sammen",
                "Gulvet knakk sammen",
                "Gulvet knakk sammen"
            ],
            "rightanswer": "d"
        },
        {
            "question": "Hvor mange liter øl er det i en pint øl?",
            "alternatives": [
                "ca. 0,473",
                "0,5",
                "ca. 0,563",
                "ca. 0,673"
            ],
            "rightanswer": "a"
        },
        {
            "question": "Hvilke av disse alternativene er fri for gluten?",
            "alternatives": [
                "bilde",
                "bilde",
                "bilde",
                "bilde"
            ],
            "rightanswer": "a"
        },
        {
            "question": "Hva er det som gjør at rødvinen er rød og hvitvinen er hvit?",
            "alternatives": [
                "Rød/grønne druer",
                "Over-/undergjæring",
                "Sukkertype",
                "Med/uten skall"
            ],
            "rightanswer": "d"
        },
        {
            "question": "Hvilke av disse har flest/færrest kcal per 100 gram?",
            "alternatives": [
                "bilde",
                "bilde",
                "bilde",
                "bilde"
            ],
            "rightanswer": "a"
        }
    ];

    var teams = createTeams();
    var mentometer = createMentometer(questions, teams);

    dispatch.on("/", function() {
        mentometer.startPage();
    });

    dispatch.on("/question/:num", function(params) {
        var num = parseInt(params.num, 10);
        if (num > questions.length) return mentometer.done();
        mentometer.show(num);
    });

    dispatch.on("/done", function() {
        mentometer.done();
    });

    dispatch.start("/");

    var sock = new SockJS('/echo');

    sock.onopen = function() {
        sock.send(JSON.stringify({ type: "connect", isAdmin: true }));
    };

    sock.onmessage = function(e) {
        var data = JSON.parse(e.data);

        if (data.numberOfUsers) {
            document.querySelector('.connected span').innerHTML = data.numberOfUsers;
        }

        if (data.type === 'answer') {
            mentometer.answer(data.user, data.alternative, data.name);
        }
    };

    sock.onclose = function() {
        alert("WebSocket-tilkoblingen er brutt, refresh siden");
    };

})();
