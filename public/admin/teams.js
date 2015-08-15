(function() {

    window.createMentomet = function() {
        var teams = ['/ape', '/kake'], score = {'/ape': 0, '/kake': 0}, answers = {'/ape': '', '/kake': ''};

        var nameEl = document.querySelector('.names'),
            karEl = document.querySelector('.karakter'),
            answerlist = document.getElementById('answerslist');


        function updateAnswer(team, alternative) {
            answers[team] = alternative;
        }

        function updateScores(rightAnswer) {

        }

        function updateScore(team, score) {

        }

        function createAnswerList () {
            var listrow, text;
            clearAnswerList();
            teams.forEach(function (name) {
                listrow = document.createElement('li');
                text=document.createTextNode(name + ' ' + answers[name]);
                listrow.appendChild(text);
                answerlist.appendChild(listrow);
            });
        }

        function clearAnswerList () {
            var child;
            while(answerlist.hasChildNodes()){
                child = answerlist.firstElementChild;
                answerlist.removeChild(child);
            }
        }

        function showAnswers() {
            createAnswerList();
        }

        function showScore() {

        }

        return {
            showAnswers: showAnswers,
            showScore: showScore,
            teamNames: function () {
                return teams;
            },
            getAnswer: function () {
              return answers.ape;
            },
            updateAnswer: updateAnswer,
            updateScores:updateScores
        }
    };

})();
