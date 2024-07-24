from flask import Flask


app = Flask(__name__)


@app.route('/analyze')
def analyze():
    pass

@app.route('/analyze-by-quiz', methods=['POST'])
def analyze_by_quiz():
    pass

@app.route('/get-score')
def get_score():
    pass

@app.route('/get-score-by-quiz', methods=['POST'])
def get_score_by_quiz():
    pass

if __name__ == '__main__':
    app.run(debug=True)
