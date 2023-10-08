const sqlite3 = require('sqlite3').verbose(); // Import the sqlite3 library

// Create a new database or open an existing one
const db = new sqlite3.Database('messages.db');

// Create a table for messages
db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, sender TEXT, content TEXT)");

    // Function to insert a new message
    function insertMessage(sender, content) {
        const stmt = db.prepare("INSERT INTO messages (sender, content) VALUES (?, ?)");
        stmt.run(sender, content);
        stmt.finalize();
    }

    // Function to retrieve all messages
    function getAllMessages(callback) {
        db.all("SELECT * FROM messages", function (err, rows) {
            if (err) {
                console.error(err);
                return;
            }
            callback(rows);
        });
    }

    // Insert a message
    insertMessage('Alice', 'Hello, world!');

    // Query all messages and print them
    getAllMessages(function (messages) {
        messages.forEach(function (message) {
            console.log(`Sender: ${message.sender}, Message: ${message.content}`);
        });
    });
});

// Close the database when done
db.close();
