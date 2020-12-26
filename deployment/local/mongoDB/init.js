db.createUser(
    {
        user: "skrik",
        pwd: "qrghfvbhfggiyreghruqoqhfriegyireygr",
        roles: [{
            role: "readWrite",
            db: "skrik"
        }, {
            role: "readWrite",
            db: "session"
        }]
    }
)