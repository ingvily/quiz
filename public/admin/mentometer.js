(function() {

    window.createMentometer = function(questions, teams) {
        var currentQuestion,
            answers = {},
            allowAnswers = true;

        var questionNumEl = document.querySelector('.question .num'),
            questionEl = document.querySelector('.question .question-text'),
            nextQuestionEl = document.querySelector('.next-question'),
            nextQuestionLinkEl = document.querySelector('.next-question a'),
            alternativesEl = document.querySelector('.alternatives');


        function show(num, question) {
            teams.removeScore();
            nextQuestionEl.style['display'] = 'none';
            nextQuestionLinkEl.setAttribute('href', '#/question/' + (num + 1));
            currentQuestion = num;

            answers = { 'a': [], 'b': [], 'c': [], 'd': [] };

            var alternatives = prepareAlternatives(question.alternatives);

            questionNumEl.innerHTML = '#' + num;
            questionEl.innerHTML = question.question;

            alternativesEl.innerHTML = '';
            for (var i = 0; i < alternatives.length; i++) {
                var alt = alternatives[i];
                var li = document.createElement('li');
                li.innerHTML = "<span>" + alt.alt + "</span> " + alt.answer;
                alternativesEl.appendChild(li);
            }

            var keepRunning = function(n) {
                return function() {
                    return n === currentQuestion;
                };
            };

            function showRightAnswerAndScore() {
                alternativesEl.innerHTML = '';

                teams.updateScores(question.rightanswer);
                teams.showScore(question.rightanswer);
                //scoretitle.innerHTML = 'Scorelist';
            }

            utils.runTimer(20000, keepRunning(num), updateTimerDisplay).then(function() {
                showRightAnswerAndScore();
                allowAnswers = false;
                nextQuestionEl.removeAttribute('style');
            });
        }

        return {
            show: function(num) {
                document.querySelector('body').className = '';
                allowAnswers = true;
                show(num, questions[num - 1]);
            },
            startPage: function() {
                document.querySelector('body').setAttribute('class', 'prepare');
            },
            done: function() {
                document.querySelector('body').setAttribute('class', 'done');
            },
            answer: function(user, alternative, name) {
                if (!allowAnswers) return;

                for (var key in answers) {
                    utils.without(answers[key], user);
                }

                answers[alternative].push(user);


                teams.updateAnswer(name, alternative);
                teams.showAnswers();


            }
        }
    }

    function updateTimerDisplay(time) {
        document.querySelector('.timer span').innerHTML = toSeconds(time);
    }

    function toSeconds(time) {
        return (time / 1000).toFixed(2);
    }


    function prepareAlternatives(alternatives) {
        return utils.map(alternatives, function(answer, i) {
            return {
                alt: String.fromCharCode(97 + i),
                answer: answer
            };
        });
    }

})();
