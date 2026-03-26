import requests

def test_login(identifier, password):
    url = "http://127.0.0.1:8000/api/auth/token/"
    payload = {
        "email": identifier,
        "password": password
    }
    try:
        response = requests.post(url, json=payload)
        print(f"Testing login for {identifier}...")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Testing with 'anuj@gmail.com' and a guessed password
    test_login("anuj@gmail.com", "password123")
    # Testing with 'anuj' as username
    test_login("anuj", "password123")
