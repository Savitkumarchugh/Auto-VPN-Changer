from flask import Flask, request, render_template, jsonify
from flask_cors import CORS 
import pyautogui
import time

app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/change_vpn', methods=['POST'])
def change_vpn():
    location = request.json.get('location')  # Getting the location from the request
    
    if location:

        current_location = location

        if current_location == "tokyo - 2":
            current_location = "tokyo"  

        # Simulate moving and clicking using PyAutoGUI
        try:
            pyautogui.moveTo(204  , 1055)
            pyautogui.click()

            time.sleep(0.3)
            pyautogui.press('enter')
            time.sleep(0.3)
            pyautogui.press('tab')
            time.sleep(0.3)
            pyautogui.write(current_location)
            time.sleep(0.5)
            pyautogui.press('tab')
            time.sleep(0.3)
            pyautogui.press('enter')
            time.sleep(0.3)
            pyautogui.hotkey('win', 'down')  # Minimize window
            time.sleep(0.2)
            pyautogui.moveTo(265  , 1047)
            time.sleep(0.3)
            # THIS TO CHANGE (Filter Location)
            pyautogui.moveTo(798   , 352)
           
            time.sleep(0.3)
            pyautogui.click()
            time.sleep(0.5)
            # THIS TO CHANGE (Parameter Selection)
            pyautogui.moveTo(542    , 762)
            pyautogui.click()
            pyautogui.write(current_location)
            time.sleep(0.5)
            pyautogui.press("enter")
            time.sleep(0.3)
            pyautogui.press('tab')
            time.sleep(0.3)
            pyautogui.press('tab')
            time.sleep(0.3)
            pyautogui.press("enter")


            # Send success message to frontend
            return jsonify({"message": f"VPN changed to {location}!"}), 200

        except Exception as e:
            return jsonify({"error": f"Failed to change VPN: {str(e)}"}), 500

    return jsonify({"error": "No location provided"}), 400


if __name__ == '__main__':
    app.run(debug=True, port=8080, use_reloader=True)
