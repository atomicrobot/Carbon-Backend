db.auth('admin', 'admin');

db = db.getSiblingDB('appdb');
db.createUser({
    user: 'appuser',
    pwd: 'appuser',
    roles: [
        {
            role: 'readWrite',
            db: 'appdb',
        },
    ],
});

db.users.insert({ email: 'carbon-backend@project.com' });
