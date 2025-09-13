let quizData = null;

class QuizApp {
    constructor() {
        this.currentQuestion = 0;
        this.scores = {};
        this.loadQuizData();
    }

    async loadQuizData() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const quizName = urlParams.get('q') || 'default-quiz';
            const response = await fetch(`${quizName}.json`);
            quizData = await response.json();
            this.init();
        } catch (error) {
            console.error('Error loading quiz data:', error);
            document.body.innerHTML = '<div style="text-align: center; padding: 50px;"><h2>Error loading quiz data</h2></div>';
        }
    }

    init() {
        this.showStartScreen();
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startQuiz();
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restart();
        });
    }

    showStartScreen() {
        document.getElementById('quiz-title').textContent = quizData.title;
        document.getElementById('quiz-description').textContent = quizData.description;
        
        if (quizData.image) {
            const img = document.getElementById('quiz-image');
            img.src = quizData.image;
            img.style.display = 'block';
        }

        this.showScreen('start-screen');
    }

    startQuiz() {
        this.currentQuestion = 0;
        this.scores = {};
        Object.keys(quizData.results).forEach(key => {
            this.scores[key] = 0;
        });
        this.showQuestion();
    }

    showQuestion() {
        const question = quizData.questions[this.currentQuestion];
        
        document.getElementById('question-text').textContent = question.text;
        
        if (question.image) {
            const img = document.getElementById('question-image');
            img.src = question.image;
            img.style.display = 'block';
        } else {
            document.getElementById('question-image').style.display = 'none';
        }

        this.updateProgress();
        this.renderAnswers(question.answers);
        this.showScreen('question-screen');
    }

    updateProgress() {
        const progress = ((this.currentQuestion) / quizData.questions.length) * 100;
        document.getElementById('progress').style.width = progress + '%';
    }

    renderAnswers(answers) {
        const container = document.getElementById('answers-container');
        container.innerHTML = '';

        answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = answer.text;
            button.addEventListener('click', () => {
                this.selectAnswer(answer);
            });
            container.appendChild(button);
        });
    }

    selectAnswer(answer) {
        Object.keys(answer.points).forEach(key => {
            this.scores[key] += answer.points[key];
        });

        this.currentQuestion++;

        if (this.currentQuestion < quizData.questions.length) {
            this.showQuestion();
        } else {
            this.showResult();
        }
    }

    showResult() {
        const winner = Object.keys(this.scores).reduce((a, b) => 
            this.scores[a] > this.scores[b] ? a : b
        );

        const result = quizData.results[winner];
        
        document.getElementById('result-title').textContent = result.title;
        document.getElementById('result-description').textContent = result.description;
        
        if (result.image) {
            const img = document.getElementById('result-image');
            img.src = result.image;
            img.style.display = 'block';
        } else {
            document.getElementById('result-image').style.display = 'none';
        }

        this.showScreen('result-screen');
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
        });
        document.getElementById(screenId).style.display = 'block';
    }

    restart() {
        this.showStartScreen();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});
