import cv2
import face_recognition
import os
from datetime import datetime
import sys

def find_encodings(images):
    encode_list = []
    for img in images:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encode = face_recognition.face_encodings(img)[0]
        encode_list.append(encode)
    return encode_list

def mark_attendance(name):
    with open('Attendance.csv', 'a') as f:
        now = datetime.now()
        date = datetime.today().strftime('%d/%m/%Y')
        dt_string = now.strftime('%H:%M:%S')
        f.write(f'{name},{date},{dt_string}\n')

def recognize_faces(image_path, known_encodings, known_names):
    img = cv2.imread(image_path)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    faces_cur_frame = face_recognition.face_locations(img_rgb)
    encodes_cur_frame = face_recognition.face_encodings(img_rgb, faces_cur_frame)

    for encode_face, face_loc in zip(encodes_cur_frame, faces_cur_frame):
        matches = face_recognition.compare_faces(known_encodings, encode_face)
        face_dis = face_recognition.face_distance(known_encodings, encode_face)
        match_index = min(range(len(face_dis)), key=face_dis.__getitem__)

        if matches[match_index]:
            name = known_names[match_index].upper()
            y1, x2, y2, x1 = face_loc
            y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.rectangle(img, (x1, y2 - 35), (x2, y2), (0, 255, 0), cv2.FILLED)
            cv2.putText(img, name, (x1 + 6, y2 - 6), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)
            mark_attendance(name)

    cv2.imshow('Recognized Faces', img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python image_face_recognition_attendance.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]

    path = 'Training_images'

    # Load known images and their encodings
    known_images = []
    known_class_names = []

    for cl in os.listdir(path):
        cur_img = cv2.imread(f'{path}/{cl}')
        known_images.append(cur_img)
        known_class_names.append(os.path.splitext(cl)[0])

    known_encodings = find_encodings(known_images)

    # Process the specified image
    recognize_faces(image_path, known_encodings, known_class_names)
