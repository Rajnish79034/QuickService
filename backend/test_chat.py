import requests
try:
    r = requests.post('http://localhost:5001/api/chat', json={
        "message": "find best electrician near me",
        "history": [],
        "location": "Chandigarh"
    }, timeout=30)
    print(f"Status: {r.status_code}")
    data = r.json()
    if 'response' in data:
        with open("chat_output.txt", "w", encoding="utf-8") as f:
            f.write(data['response'])
        print(data['response'])
    else:
        print(f"Error: {data}")
except Exception as e:
    print(f"Error: {e}")
