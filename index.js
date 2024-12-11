//load lowdb module

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

//Set up the server
import express from 'express';
let app = express();

//Serve static files from a public folder
app.use('/', express.static('public'));
app.use(express.json());

//Set port variable to listen for requests
let port = process.env.PORT || 3000;
app.listen(port, () => {
console.log('listening at ', port);
});

//set up database
let defaultData = { JHStories: [] };
let adapter = new JSONFile('db.json');
let db = new Low(adapter, defaultData);

// Ensure database is loaded and initialized
db.read()
  .then(() => {
    db.data = db.data || defaultData; // Initialize db.data if empty
    db.data.JHStories = db.data.JHStories || []; // Ensure JHStories is an array
    return db.write(); // Write initial structure to file if needed
  })
  .catch((err) => console.error('Error initializing database:', err));

/*ROUTES */
app.get('/storyupload', (req, res) => {
  // db.read --> get the latest value from db.data
  db.read()
    .then(() => {
      //save the stories to an object
      let theStories = {data : db.data.JHStories};
      //send the messages to the client
      res.json(theStories);
    });
});

app.post("/submit-story", async (req, res) => {
  let { story, author, place } = req.body;

  if (story && author && place) {
    try {
      // Read database
      await db.read();

      // Add story to database
      db.data.JHStories.push({
        story,
        author,
        place,
        timestamp: new Date().toISOString(),
      });

      // Write to database
      await db.write();

      res.status(200).json({ message: "Thank you for your story!" });
    } catch (error) {
      console.error("Error saving story:", error);
      res.status(500).json({ error: "Failed to save the story. Please try again." });
    }
  } else {
    res.status(400).json({ error: "All fields are required." });
  }
});