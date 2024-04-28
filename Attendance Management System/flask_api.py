from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import subprocess
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route('/run_live_face_recognition', methods=['POST'])
def run_live_face_recognition():
    try:
        # Run the live_face_recognition_attendance.py script using subprocess
        subprocess.run(['python', 'live_face_recognition_attendance.py'])
        return jsonify({'status': 'success', 'results': ['Execution completed.']})
    except Exception as e:
        return jsonify({'status': 'error', 'error_message': str(e)})

@app.route('/run_image_face_recognition', methods=['POST'])
def run_image_face_recognition():
    try:
        # Handle image file upload and run image_face_recognition_attendance.py
        # Access the uploaded image using request.files['image']
        # Your image processing logic goes here

        # if 'image' not in request.files:
        #     return jsonify({'status': 'error', 'error_message': 'No image file provided'})
        
        if 'images[]' not in request.files:
            return jsonify({'status': 'error', 'error_message': 'No image file provided'})

        # image_file = request.files['image']
        image_files = request.files.getlist('images[]')

        # Save the uploaded image temporarily
        # image_path = 'temp_image.jpg'
        # image_file.save(image_path)

        # Run the image_face_recognition_attendance.py script with the uploaded image
        # subprocess.run(['python', 'image_face_recognition_attendance.py', image_path])

        for image_file in image_files:
            image_path = 'temp_image.jpg'
            image_file.save(image_path)

            subprocess.run(['python', 'image_face_recognition_attendance.py', image_path])


        return jsonify({'status': 'success', 'results': ['Execution completed.']})
    except Exception as e:
        return jsonify({'status': 'error', 'error_message': str(e)})

@app.route('/query_attendance', methods=['GET'])
def query_attendance():
    try:
        # Access parameters using request.args.get('date'), request.args.get('fromTime'), request.args.get('toTime')
        date = request.args.get('date')
        from_time = request.args.get('fromTime')+":00"
        to_time = request.args.get('toTime')+":00"

        # Read 'Attendance.csv' file
        with open('Attendance.csv', 'r') as file:
            reader = csv.reader(file)
            next(reader)  # Skip the header row
            attendance_data = list(reader)

        date = datetime.strptime(date,'%Y-%m-%d').strftime('%d/%m/%Y')
        from_time=datetime.strptime(from_time,'%H:%M:%S').strftime('%H:%M:%S')
        to_time=datetime.strptime(to_time,'%H:%M:%S').strftime('%H:%M:%S')

        # Filter entries based on date, from time, and to time
        filtered_entries = [
            entry for entry in attendance_data
            if entry[1] == date and from_time <= entry[2] <= to_time
        ]

        if not filtered_entries:
            return jsonify({'status': 'success', 'results': ['No Students Found']})

        # Extract unique names from the filtered entries
        unique_names = set(entry[0] for entry in filtered_entries)

        return jsonify({'status': 'success', 'results': list(unique_names)})
    except Exception as e:
        return jsonify({'status': 'error', 'error_message': str(e)})

if __name__ == "__main__":
    app.run(debug=True)
