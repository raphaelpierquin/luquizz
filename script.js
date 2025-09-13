const quizData = {
    title: "What Animal Are You?",
    description: "Discover your spirit animal with this fun personality quiz!",
    questions: [
        {
            text: "What do you do on weekends?",
            answers: [
                { text: "Stay in bed all day", points: { sloth: 2, cat: 1 } },
                { text: "Go for a run or hike", points: { dog: 2, lion: 1 } },
                { text: "Read a good book", points: { owl: 2, cat: 1 } },
                { text: "Hang out with friends", points: { dog: 2, lion: 1 } }
            ]
        },
        {
            text: "Your ideal vacation would be:",
            answers: [
                { text: "Beach resort with spa", points: { sloth: 2, cat: 1 } },
                { text: "Adventure camping trip", points: { lion: 2, dog: 1 } },
                { text: "Cultural city exploration", points: { owl: 2, cat: 1 } },
                { text: "Fun theme park", points: { dog: 2, lion: 1 } }
            ]
        },
        {
            text: "When faced with a problem, you:",
            answers: [
                { text: "Take time to think it through", points: { owl: 2, sloth: 1 } },
                { text: "Ask friends for help", points: { dog: 2, cat: 1 } },
                { text: "Face it head-on immediately", points: { lion: 2, dog: 1 } },
                { text: "Hope it resolves itself", points: { sloth: 2, cat: 1 } }
            ]
        },
        {
            text: "Your favorite time of day is:",
            answers: [
                { text: "Early morning", points: { lion: 2, dog: 1 } },
                { text: "Late night", points: { owl: 2, cat: 1 } },
                { text: "Afternoon nap time", points: { sloth: 2, cat: 1 } },
                { text: "Evening with friends", points: { dog: 2, lion: 1 } }
            ]
        },
        {
            text: "At a party, you're usually:",
            answers: [
                { text: "The center of attention", points: { lion: 2, dog: 1 } },
                { text: "Having deep conversations", points: { owl: 2, cat: 1 } },
                { text: "Making everyone laugh", points: { dog: 2, lion: 1 } },
                { text: "Finding a quiet corner", points: { cat: 2, sloth: 1 } }
            ]
        }
    ],
    results: {
        cat: {
            title: "You're a Cat!",
            description: "Independent, mysterious, and elegant. You value your alone time and have a selective circle of close friends. You're observant and prefer quality over quantity in all aspects of life."
        },
        dog: {
            title: "You're a Dog!",
            description: "Loyal, energetic, and social. You love being around people and are always ready for an adventure. Your enthusiasm is contagious and you're a great friend to have."
        },
        lion: {
            title: "You're a Lion!",
            description: "Brave, confident, and a natural leader. You're not afraid to take charge and face challenges head-on. Others look up to you for guidance and inspiration."
        },
        owl: {
            title: "You're an Owl!",
            description: "Wise, thoughtful, and introspective. You prefer to observe before acting and your insights are valued by those around you. You're the voice of reason in your group."
        },
        sloth: {
            title: "You're a Sloth!",
            description: "Relaxed, peaceful, and zen. You know the importance of taking things slow and enjoying life's simple pleasures. Your calm presence has a soothing effect on others."
        }
    }
};

class QuizApp {
    constructor() {
        this.currentQuestion = 0;
        this.scores = {};
        this.init();
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