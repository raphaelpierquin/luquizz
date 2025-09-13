class QuizConfigurator {
    constructor() {
        this.quizData = {
            title: '',
            description: '',
            image: '',
            questions: [],
            results: {}
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.addInitialResult();
        this.addInitialQuestion();
    }

    bindEvents() {
        document.getElementById('add-result-btn').addEventListener('click', () => this.addResult());
        document.getElementById('add-question-btn').addEventListener('click', () => this.addQuestion());
        document.getElementById('download-btn').addEventListener('click', () => this.showPreview());
        document.getElementById('load-quiz-btn').addEventListener('click', () => this.loadQuiz());
        document.getElementById('close-modal-btn').addEventListener('click', () => this.closeModal());
        document.getElementById('copy-json-btn').addEventListener('click', () => this.copyJSON());
        document.getElementById('confirm-download-btn').addEventListener('click', () => this.downloadJSON());

        document.getElementById('quiz-title').addEventListener('input', (e) => {
            this.quizData.title = e.target.value;
        });
        document.getElementById('quiz-description').addEventListener('input', (e) => {
            this.quizData.description = e.target.value;
        });
        document.getElementById('quiz-image').addEventListener('input', (e) => {
            this.quizData.image = e.target.value;
        });
    }

    addResult(resultData = null) {
        const container = document.getElementById('results-container');
        const resultId = resultData ? resultData.key : `result_${Date.now()}`;
        
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-item';
        resultDiv.dataset.resultId = resultId;
        
        resultDiv.innerHTML = `
            <h4>
                Result: ${resultId}
                <button type="button" class="remove-btn" onclick="this.closest('.result-item').remove(); quizConfig.updateResultsInQuestions();">Remove</button>
            </h4>
            <div class="form-group">
                <label>Result Key (unique identifier)</label>
                <input type="text" class="result-key" value="${resultId}" pattern="[a-zA-Z0-9_-]+" required>
            </div>
            <div class="form-group">
                <label>Title</label>
                <input type="text" class="result-title" value="${resultData ? resultData.title : ''}" placeholder="You're a Cat!" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="result-description" placeholder="Independent and mysterious..." rows="3" required>${resultData ? resultData.description : ''}</textarea>
            </div>
            <div class="form-group">
                <label>Image URL (optional)</label>
                <input type="url" class="result-image" value="${resultData ? resultData.image || '' : ''}" placeholder="https://example.com/cat.jpg">
            </div>
        `;

        container.appendChild(resultDiv);

        resultDiv.querySelector('.result-key').addEventListener('input', () => {
            this.updateResultsInQuestions();
        });

        this.updateResultsInQuestions();
    }

    addQuestion(questionData = null) {
        const container = document.getElementById('questions-container');
        const questionIndex = container.children.length;
        
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        
        questionDiv.innerHTML = `
            <h4>
                Question ${questionIndex + 1}
                <button type="button" class="remove-btn" onclick="this.closest('.question-item').remove();">Remove</button>
            </h4>
            <div class="form-group">
                <label>Question Text</label>
                <input type="text" class="question-text" value="${questionData ? questionData.text : ''}" placeholder="What do you do on weekends?" required>
            </div>
            <div class="form-group">
                <label>Question Image URL (optional)</label>
                <input type="url" class="question-image" value="${questionData ? questionData.image || '' : ''}" placeholder="https://example.com/question.jpg">
            </div>
            <div class="answers-section">
                <h5>Answers</h5>
                <div class="answers-container"></div>
                <button type="button" class="add-btn" onclick="quizConfig.addAnswer(this.closest('.question-item'));">+ Add Answer</button>
            </div>
        `;

        container.appendChild(questionDiv);

        if (questionData && questionData.answers) {
            questionData.answers.forEach(answer => {
                this.addAnswer(questionDiv, answer);
            });
        } else {
            this.addAnswer(questionDiv);
            this.addAnswer(questionDiv);
        }
    }

    addAnswer(questionDiv, answerData = null) {
        const answersContainer = questionDiv.querySelector('.answers-container');
        
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-item';
        
        answerDiv.innerHTML = `
            <div class="form-group">
                <label>Answer Text</label>
                <input type="text" class="answer-text" value="${answerData ? answerData.text : ''}" placeholder="Stay in bed all day" required>
                <button type="button" class="remove-btn" style="margin-top: 10px;" onclick="this.closest('.answer-item').remove();">Remove Answer</button>
            </div>
            <div class="form-group">
                <label>Points Distribution</label>
                <div class="points-grid"></div>
            </div>
        `;

        answersContainer.appendChild(answerDiv);
        this.updatePointsForAnswer(answerDiv, answerData ? answerData.points : {});
    }

    updateResultsInQuestions() {
        const results = this.getCurrentResults();
        document.querySelectorAll('.points-grid').forEach(grid => {
            const currentPoints = this.getPointsFromGrid(grid);
            this.updatePointsForAnswer(grid.closest('.answer-item'), currentPoints);
        });
    }

    updatePointsForAnswer(answerDiv, currentPoints = {}) {
        const pointsGrid = answerDiv.querySelector('.points-grid');
        const results = this.getCurrentResults();
        
        pointsGrid.innerHTML = '';
        
        results.forEach(resultKey => {
            const pointsItem = document.createElement('div');
            pointsItem.className = 'points-item';
            pointsItem.innerHTML = `
                <label>${resultKey}:</label>
                <input type="number" min="0" max="10" value="${currentPoints[resultKey] || 0}" data-result="${resultKey}">
            `;
            pointsGrid.appendChild(pointsItem);
        });
    }

    getPointsFromGrid(grid) {
        const points = {};
        grid.querySelectorAll('input[data-result]').forEach(input => {
            const result = input.dataset.result;
            const value = parseInt(input.value) || 0;
            if (value > 0) {
                points[result] = value;
            }
        });
        return points;
    }

    getCurrentResults() {
        const results = [];
        document.querySelectorAll('.result-key').forEach(input => {
            const key = input.value.trim();
            if (key) results.push(key);
        });
        return results;
    }

    addInitialResult() {
        this.addResult({ key: 'result1', title: 'Result 1', description: 'First possible result', image: '' });
    }

    addInitialQuestion() {
        this.addQuestion();
    }

    validateQuiz() {
        const errors = [];
        
        const title = document.getElementById('quiz-title').value.trim();
        if (!title) errors.push('Quiz title is required');
        
        const filename = document.getElementById('quiz-filename').value.trim();
        if (!filename) errors.push('Filename is required');
        if (!/^[a-zA-Z0-9_-]+$/.test(filename)) errors.push('Filename can only contain letters, numbers, dashes and underscores');
        
        const results = this.getCurrentResults();
        if (results.length < 2) errors.push('At least 2 results are required');
        
        const questions = document.querySelectorAll('.question-item');
        if (questions.length < 1) errors.push('At least 1 question is required');
        
        questions.forEach((question, index) => {
            const text = question.querySelector('.question-text').value.trim();
            if (!text) errors.push(`Question ${index + 1} text is required`);
            
            const answers = question.querySelectorAll('.answer-item');
            if (answers.length < 2) errors.push(`Question ${index + 1} needs at least 2 answers`);
            
            answers.forEach((answer, answerIndex) => {
                const answerText = answer.querySelector('.answer-text').value.trim();
                if (!answerText) errors.push(`Question ${index + 1}, Answer ${answerIndex + 1} text is required`);
            });
        });
        
        return errors;
    }

    generateQuizData() {
        const quizData = {
            title: document.getElementById('quiz-title').value.trim(),
            description: document.getElementById('quiz-description').value.trim(),
            questions: [],
            results: {}
        };

        const image = document.getElementById('quiz-image').value.trim();
        if (image) quizData.image = image;

        document.querySelectorAll('.result-item').forEach(resultDiv => {
            const key = resultDiv.querySelector('.result-key').value.trim();
            const title = resultDiv.querySelector('.result-title').value.trim();
            const description = resultDiv.querySelector('.result-description').value.trim();
            const image = resultDiv.querySelector('.result-image').value.trim();

            quizData.results[key] = { title, description };
            if (image) quizData.results[key].image = image;
        });

        document.querySelectorAll('.question-item').forEach(questionDiv => {
            const questionText = questionDiv.querySelector('.question-text').value.trim();
            const questionImage = questionDiv.querySelector('.question-image').value.trim();
            
            const question = { text: questionText, answers: [] };
            if (questionImage) question.image = questionImage;

            questionDiv.querySelectorAll('.answer-item').forEach(answerDiv => {
                const answerText = answerDiv.querySelector('.answer-text').value.trim();
                const points = this.getPointsFromGrid(answerDiv.querySelector('.points-grid'));
                
                question.answers.push({ text: answerText, points });
            });

            quizData.questions.push(question);
        });

        return quizData;
    }

    showPreview() {
        const errors = this.validateQuiz();
        if (errors.length > 0) {
            alert('Please fix the following errors:\n\n' + errors.join('\n'));
            return;
        }

        const quizData = this.generateQuizData();
        const jsonString = JSON.stringify(quizData, null, 2);
        
        document.getElementById('json-preview').textContent = jsonString;
        document.getElementById('preview-modal').style.display = 'flex';
    }

    closeModal() {
        document.getElementById('preview-modal').style.display = 'none';
    }

    async copyJSON() {
        const jsonText = document.getElementById('json-preview').textContent;
        try {
            await navigator.clipboard.writeText(jsonText);
            alert('JSON copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard');
        }
    }

    downloadJSON() {
        const jsonText = document.getElementById('json-preview').textContent;
        const filename = document.getElementById('quiz-filename').value.trim() || 'quiz';
        
        const blob = new Blob([jsonText], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.closeModal();
        alert('Quiz JSON file downloaded successfully!');
    }

    loadQuiz() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const quizData = JSON.parse(e.target.result);
                    this.loadQuizData(quizData);
                } catch (err) {
                    alert('Invalid JSON file');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    loadQuizData(quizData) {
        document.getElementById('quiz-title').value = quizData.title || '';
        document.getElementById('quiz-description').value = quizData.description || '';
        document.getElementById('quiz-image').value = quizData.image || '';
        
        document.getElementById('results-container').innerHTML = '';
        document.getElementById('questions-container').innerHTML = '';
        
        Object.keys(quizData.results).forEach(key => {
            const result = quizData.results[key];
            this.addResult({ key, title: result.title, description: result.description, image: result.image });
        });
        
        if (quizData.questions) {
            quizData.questions.forEach(question => {
                this.addQuestion(question);
            });
        }
        
        alert('Quiz loaded successfully!');
    }
}

let quizConfig;

document.addEventListener('DOMContentLoaded', () => {
    quizConfig = new QuizConfigurator();
});