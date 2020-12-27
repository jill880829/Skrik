db.createUser(
    {
        user: "Skrik User",
        pwd: "password",
        roles: [{
            role: "readWrite",
            db: "skrik"
        }, {
            role: "readWrite",
            db: "session"
        }]
    }
)