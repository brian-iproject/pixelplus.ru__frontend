class QuizStep {
    constructor({title, answers, tariffs}) {
        this.title = title;
        this.answers = answers;
        this.tariffs = tariffs;
    }
}

class Quiz {
    constructor(steps, initialStepId) {
        this.container = document.querySelector('.quiz');
        if (!this.container) return;

        this.steps = [];
        steps.forEach(this.addStep.bind(this));
        this.initialStepId = initialStepId;
        this.start();
    }

    addStep(step) {
        this.steps.push(new QuizStep(step));
    };

    start() {
        this.currentStepId = this.initialStepId;
        this.renderCurrentStep();
    };

    reset() {
        const backButton = Object.assign(document.createElement('button'), {
            className: 'button button--not-fill',
            type: 'button',
            textContent: 'Вернуться назад'
        });
        this.container.querySelector('.quiz__item-back').appendChild(backButton);

        backButton.addEventListener('click', () => {
            this.start();
            this.container.querySelectorAll('.quiz__card').forEach(elem => {
                elem.classList.add('-d-none');
            });
            backButton.remove();
        });
    }

    nextStep(event) {
        this.currentStepId = event.target.dataset.next;
        this.renderCurrentStep();
    }

    renderCurrentStep() {
        this.container.querySelector('.quiz__item-title').innerHTML = this.steps[this.currentStepId].title;

        if (this.steps[this.currentStepId].tariffs) {
            this.steps[this.currentStepId].tariffs.forEach(id => {
                this.container.querySelector(`[data-id="${id}"]`).classList.remove('-d-none');
            });

            this.removeAnswerButtons(this.container.querySelector('.quiz__form-buttons'));
            this.reset();
        } else {
            this.renderAnswerButtons();
        }
    }

    renderAnswerButtons() {
        const answersContainer = this.container.querySelector('.quiz__form-buttons');
        this.removeAnswerButtons(answersContainer);

        this.steps[this.currentStepId].answers.forEach(({text, next}) => {
            const answerButton = Object.assign(document.createElement('button'), {
                className: 'button button--not-fill',
                type: 'button',
                textContent: text
            });
            answerButton.setAttribute('data-next', next);
            answerButton.addEventListener('click', this.nextStep.bind(this));
            answersContainer.appendChild(answerButton);
        })
    }

    removeAnswerButtons(parentElement) {
        while (parentElement.firstChild) {
            parentElement.removeChild(parentElement.firstChild);
        }
    }
}

export default Quiz;
