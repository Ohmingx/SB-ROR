from backend.shared.db import create_tables, create_demo_user
from backend.shared.auth import get_password_hash

def main():
    create_tables()
    # create demo user with password 'demo'
    hashed = get_password_hash('demo')
    create_demo_user(username='demo', password_hash=hashed)
    print('Initialized DB and created demo user (username=demo, password=demo)')

if __name__ == '__main__':
    main()
