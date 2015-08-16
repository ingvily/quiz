(function() {

    window.createMentometer = function(questions, teams) {
        var chart,
            currentQuestion,
            answers = {},
            allowAnswers = true;

        var answersEl = document.querySelector('.answers'),
            questionNumEl = document.querySelector('.question .num'),
            questionEl = document.querySelector('.question .question-text'),
            nextQuestionEl = document.querySelector('.next-question'),
            nextQuestionLinkEl = document.querySelector('.next-question a'),
            alternativesEl = document.querySelector('.alternatives');


        function show(num, question) {
            nextQuestionEl.style['display'] = 'none';
            nextQuestionLinkEl.setAttribute('href', '#/question/' + (num + 1));
            currentQuestion = num;

            answersEl.innerHTML = '';

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

            chart = answersChart({
                el: answersEl,
                alternatives: alternatives
            });

            chart.update(answers);

            var keepRunning = function(n) {
                return function() {
                    return n === currentQuestion;
                };
            };

            utils.runTimer(20000, keepRunning(num), updateTimerDisplay).then(function() {
                allowAnswers = false;
                teams.updateScores(question.rightanswer);
                teams.showScore(question.rightanswer);
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





                //upgrade users score if right answer


                chart.update(answers);
            }
        }
    }

    function updateTimerDisplay(time) {
        document.querySelector('.timer span').innerHTML = toSeconds(time);
    }

    function toSeconds(time) {
        return (time / 1000).toFixed(2);
    }

    function answersChart(options) {
        var margin = {top: 30, right: 0, bottom: 55, left: 0},
            width = utils.windowWidth() - margin.left - margin.right,
            height = 320 - margin.top - margin.bottom;

        var alternatives = options.alternatives;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickPadding(10)
            .tickSize(1)
            .orient("bottom");

        var svg = d3.select(options.el)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(alternatives.map(function(d) { return d.alt; }));

        svg.append("g")
            .attr("class", "x axis")
            .attr("fill", "#b9b9b9")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.selectAll(".bar")
            .data(alternatives)
            .enter().append("rect")
            .attr("class", function(d) { return "bar alternative-" + d.alt; })
            .attr("x", function(d) { return x(d.answer); })
            .attr("width", x.rangeBand());

        svg.append("g").selectAll("text")
            .data(alternatives)
            .enter().append("text")
            .attr("text-anchor", "middle")
            .attr("class", "alternative-count")
            .attr("fill", "#fff")
            .attr("x", function(d, i) {
                return x.range()[i] + x.rangeBand() / 2;
            });

        var update = function(answers) {
            y.domain([0, d3.max(alternatives, function(d) { return answers[d.alt].length; })]);

            svg.selectAll(".bar")
                .data(alternatives)
                .transition()
                .duration(300)
                .attr("y", function(d) { return y(answers[d.alt].length); })
                .attr("height", function(d) { return height - y(answers[d.alt].length); });

            svg.selectAll(".alternative-count")
                .data(alternatives)
                .transition()
                .duration(300)
                .text(function(d) {
                    var len = answers[d.alt].length;
                    return len == 0 ? '' : len;
                })
                .attr("y", function(d) {
                    var max = y.domain()[1];
                    return height - (answers[d.alt].length * height / max) - 4;
                });
        };

        return {
            update: utils.throttle(update, 500)
        }
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
