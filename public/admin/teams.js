(function() {

    window.createTeams = function() {
        var teams = ['/monkey', '/zebra', '/rhino', '/lion', '/tiger', '/hippo', '/panda', '/tapir', '/koala', '/camel', '/bear', '/wolf', '/zimba'],
            score = createEmptyList(0),
            answers = createEmptyList(''),
            names = createNameList();

        function createEmptyList(emptyElement) {
            var list = {};
            teams.forEach(function (name){
                list[name] = emptyElement;
            });
            return list;
        }

        function createNameList() {
            var list = {};
            teams.forEach(function (name){
                list[name] = name.substr(1);
            });
            return list;
        }

        var nameEl = document.querySelector('.names'),
            karEl = document.querySelector('.karakter'),
            answerlist = document.getElementById('answerslist'),
            answertitle = document.getElementById('answertitle'),
            scorelist = document.getElementById('scorelist'),
            rightanswer = document.getElementById('rightanswer'),
            scoretitle = document.getElementById('scoretitle');


        function updateScores(rightAnswer) {
            teams.forEach(function (name) {
                if(answers[name] === rightAnswer) {
                    updateScore(name, 1)
                }
            });
        }

        function updateScore(name, pluss) {
            score[name] += pluss;
        }

        function showScore(rightAnswer) {
            clearAnswerList();
            rightanswer.innerHTML = '<span> Riktig svar:     </span><span>' + rightAnswer + '</span>';
            scoretitle.innerHTML = 'Scorelist';
            clearScoreList();
            createScoreList();
        }

        function createScoreList () {
            var listrow, text;
            teams.forEach(function (name) {
                listrow = document.createElement('li');
                text=document.createTextNode(names[name] + ' ' + score[name]);
                listrow.appendChild(text);
                scorelist.appendChild(listrow);
            });
        }

        function removeScore() {
            rightanswer.innerHTML = '';
            scoretitle.innerHTML = '';
            clearScoreList();
        }

        function clearScoreList () {
            var child;
            while(scorelist.hasChildNodes()){
                child = scorelist.firstElementChild;
                scorelist.removeChild(child);
            }
        }

        function updateAnswer(team, alternative) {
            answers[team] = alternative;
        }

        function showAnswers() {
            clearAnswerList();
            answertitle.innerHTML = 'Lag som har besvart';
            createAnswerList();
        }

        function createAnswerList () {
            var listrow, text;
            teams.forEach(function (name) {
                if(answers[name] != ''){
                    listrow = document.createElement('li');
                    text=document.createTextNode(names[name]);
                    listrow.appendChild(text);
                    answerlist.appendChild(listrow);
                }
            });
        }

        function clearAnswerList () {
            answertitle.innerHTML = '';
            var child;
            while(answerlist.hasChildNodes()){
                child = answerlist.firstElementChild;
                answerlist.removeChild(child);
            }
        }


        return {
            showAnswers: showAnswers,
            showScore: showScore,
            removeScore: removeScore,
            updateAnswer: updateAnswer,
            updateScores:updateScores
        }
    };

})();
