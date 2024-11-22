from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'pattFile' not in request.files or 'videoFile' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    patt_file = request.files['pattFile']
    video_file = request.files['videoFile']

    if not os.path.exists('./file'):
        os.makedirs('./file')

    serial_number = 1
    while os.path.exists(f'./file/{serial_number:X}'):
        serial_number += 1

    new_folder_path = f'./file/{serial_number:X}'
    os.makedirs(new_folder_path)
    
    patt_file.save(f'{new_folder_path}/{patt_file.filename}')
    video_file.save(f'{new_folder_path}/{video_file.filename}')

    
    return jsonify({'message': 'Files uploaded successfully', 
                    'pattFile': patt_file.filename, 
                    'videoFile': video_file.filename}), 200

@app.route('/get', methods=['GET'])
def download_file():
    file_id = request.args.get('id')
    
    if not file_id:
        return jsonify({'error': 'Missing file ID'}), 400

    folder_path = f'./file/{file_id}'

    if not os.path.exists(folder_path):
        return jsonify({'error': 'File not found'}), 404

    file_urls = {}

    for file_name in os.listdir(folder_path):
        if file_name.endswith('.mp4'):
            file_urls['mp4'] = f'http://127.0.0.1:5000/get_file/{file_id}/{file_name}'
        elif file_name.endswith('.patt'):
            file_urls['mptt'] = f'http://127.0.0.1:5000/get_file/{file_id}/{file_name}'

    if not file_urls:
        return jsonify({'error': 'Files not found'}), 404

    return jsonify(file_urls), 200



@app.route('/get_file/<file_id>/<file_name>', methods=['GET'])
def send_file(file_id, file_name):
    
    folder_path = f'D:\\Data\\project\\eazyar\\file\\{file_id}'
    if not os.path.exists(folder_path):
        return jsonify({'error': 'File not found'}), 404
    return send_from_directory(folder_path, file_name)

if __name__ == '__main__':
    app.run(debug=True)
