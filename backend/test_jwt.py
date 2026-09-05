from app.auth.jwt_handler import create_access_token

token = create_access_token(
    {"sub": "praneeth@gmail.com"}
)

print(token)