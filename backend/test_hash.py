from app.auth.hashing import hash_password, verify_password

password = "123456"

hashed = hash_password(password)

print(hashed)

print(verify_password("123456", hashed))