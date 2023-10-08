
import json
from flask import Flask, request, jsonify
app = Flask(__name__)
 
@app.route('/')
def index():
	return "Flask server"
 
@app.route('/postdata', methods = ['POST'])
def postdata():
    data = request.get_json()
    d =str(json.dumps(data["data1"]))
    
    # d is string variable and that you will use to get values form mongodb 
    # here you will place the thumb verification code and set logic on it means if thumb successfully match then bellow code return success mesg and if not match then return not match message
    # 
    #  
    return json.dumps({"newdata":"here is the new data you want to send"})
 
if __name__ == "__main__":
	app.run(debug=True,port=5000)