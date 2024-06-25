import express from 'express';
import session from 'express-session';
import { createClient } from 'pexels';

const app = express();
const client = createClient('qjQA6DMfI1v9xO7POnghqnnBtSMZZODVEfg4Y8oUEjn8YzIIr816NYrC'); // Replace with your Pexels API key

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'your_secret_key', // Replace with a secret key for session management
    resave: false,
    saveUninitialized: true
}));

app.get("/", (req, res) => {
    const query = "nature";
    const page = 1;
    client.photos.search({ query, per_page: 9, page })
        .then(photos => {
            const totalPages = Math.ceil(photos.total_results / 9); // Adjust the total pages calculation
            res.render("index", { photos: photos.photos, query, page, totalPages });
        })
        .catch(err => {
            console.error(err);
            res.render("index", { photos: [], query, page: 1, totalPages: 0 });
        });
});

app.post("/search", (req, res) => {

    const query = req.body.query || "nature";
    const page = req.body.page || 1; // Use body to get the page number

    client.photos.search({ query, per_page: 100, page })
        .then(photos => {
            const totalPages = Math.ceil(photos.total_results / 9); // Adjust the total pages calculation
            res.render("images", { photos: photos.photos, query, page, totalPages });
        })
        .catch(err => {
            console.error(err);
            res.render("images", { photos: [], query, page: 1, totalPages: 0 });
        });
});

app.post("/video", (req, res) => {
    console.log("videos");
    const query = req.body.query || 'Nature'; // Default query if not provided
    client.videos.search({ query, per_page: 10 }) // Change per_page to the number of videos you want to fetch
        .then(videos => {
            if (videos && videos.videos.length > 0) {
                res.render("videos", { videos: videos.videos }); // Render the 'videos' view with all fetched videos
            } else {
                res.render("videos", { videos: [] }); // Handle case where no videos are found
            }
        })
        .catch(err => {
            console.error(err);
            res.render("videos", { videos: [] }); // Handle error
        });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
