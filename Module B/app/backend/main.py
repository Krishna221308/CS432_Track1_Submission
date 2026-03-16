from flask import Flask
from flask_cors import CORS
from apis import init_apis

app = Flask(__name__)
CORS(app)

init_apis(app)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)