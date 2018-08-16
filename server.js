let express = require('express');
let app = express();
app.use(express.static(__dirname + '/public/dist/public'));

let bodyParser = require('body-parser');
app.use(bodyParser.json());

let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rate_my_cakes');

let RatingSchema = new mongoose.Schema({
    rating: { type: Number, required: true },
    comment: { type: String }
}, { timestamps: true });

let CakeSchema = new mongoose.Schema({
    baker_name: { type: String, required: true, minlength: 1 },
    img: { type: String, data: Buffer, required: true },
    ratings: [RatingSchema],
    avg_rating: { type: Number }
}, { timestamps: true });

let Cake = mongoose.model('Cake', CakeSchema);
let Rating = mongoose.model('Rating', RatingSchema);

mongoose.Promise = global.Promise;

app.use(express.static(__dirname + '/static'));

app.get('/cakes', function (req, res) {
    Cake.find({}, function (err, cakes) {
        if (err) {
            console.log('something went wrong finding all the cakes', err);
            res.json({ message: "Error", error: err })
        }
        else {
            console.log('successfully found all cakes yo!');
            cakes = cakes;
            console.log(cakes);
            res.json({ message: "Success", cakes: cakes });
        }
    })
})

app.get('/ratings', function (req, res) {
    Rating.find({}, function (err, ratings) {
        if (err) {
            console.log('something went wrong finding all the ratings', err);
            res.json({ message: "Error", error: err })
        }
        else {
            console.log('successfully found all ratings yo!');
            ratings = ratings;
            console.log(ratings);
            res.json({ message: "Success", ratings: ratings });
        }
    })
})

//to show cake
app.get('/:_id', function (req, res) {
    console.log("req.params.id:", req.params._id)
    Cake.findOne({ _id: req.params._id }, function (err, cake) {
        console.log(cake);
        if (err) {
            console.log('something went wrong finding the cake yo', err);
            res.json({ message: "Error", error: err })
        }
        else {
            console.log('successfully found the cake yo!');
            cake = cake;
            res.json({ message: "Success", cake: cake });
        }
    })
})


app.post('/new_cake', function (req, res) {
    console.log(req.body)
    let cake = new Cake({
        baker_name: req.body.baker_name,
        img: req.body.img,
    });
    cake.save(function (err) {
        if (err) {
            console.log('something went wrong creating a new cake');
            res.json({ message: "Error", error: err })
        }
        else {
            console.log('successfully created this cake!');
            cake = cake;
            console.log(cake);
            res.json({ message: "Success", cake: cake });
        }
    })
})

app.put('/new_rating/:_id', function (req, res) {
    console.log("REQ.BODY:", req.body)
    console.log('REQ.PARAMS._ID:', req.params._id)
    Cake.findOne({ _id: req.params._id },
        function (err, cake) {
            let rating = new Rating({
                rating: req.body.rating,
                comment: req.body.comment,
            });
            rating.save(function (err) {
                if (err) {
                    console.log('something went wrong creating a new rating');
                    res.json({ message: "Error", error: err })
                }
                else {
                    console.log('successfully created this rating!');
                    rating = rating;
                    console.log(rating);
                    console.log("CAKE TO RATE", cake);
                    cake['ratings'].push(rating);
                    cake.save(function (err) {
                        if (err) {
                            console.log("Failed adding rating to cake");
                            res.json({ message: "Error", error: err })
                        }
                        else {
                            console.log("Successfully added rating to cake");
                            cake = cake;
                            console.log(cake)
                            res.json({ message: "Success", rating: rating, cake: cake });
                        }
                    })
                }
            })
        })
    // let rating = new Rating({
    //     rating: req.body.rating,
    //     comment: req.body.comment,
    // });
    // rating.save(function (err) {
    //     if (err) {
    //         console.log('something went wrong creating a new rating');
    //         res.json({ message: "Error", error: err })
    //     }
    //     else {
    //         console.log('successfully created this rating!');
    //         rating = rating;
    //         console.log(rating);
    //         res.json({ message: "Success", rating: rating });
    //     }
    // })
})

// app.put('/update/:_id', function (req, res) {
//     Task.find({ _id: req.params._id }, function (err, task) {
//         console.log("TASK IN SERVER:", task);
//         task[0].title = req.body.title;
//         task[0].description = req.body.description;
//         task[0].completed = req.body.completed;
//         task[0].save(function (err) {
//             if (err) {
//                 console.log("updating task didn't go so well yo");
//                 res.json({ message: "Error", error: err })
//             }
//             else {
//                 console.log("successfully updated task yo!");
//                 task = task;
//                 res.json({ message: "Success", task: task })
//             }
//         })
//     })
// })

// app.delete('/delete/:_id', function (req, res) {
//     Task.remove({ _id: req.params._id }, function (err) {
//         if (err) {
//             console.log('something went wrong w/ deleting yo');
//             res.json({ message: 'Error', error: err });
//         }
//         else {
//             console.log('successfully deleted task yo!');
//             Task.find({}, function (err, tasks) {
//                 if (err) {
//                     console.log('something went wrong finding all the tasks yo', err);
//                     res.json({ message: "Error", error: err })
//                 }
//                 else {
//                     console.log('successfully found all tasks yo!');
//                     tasks = tasks;
//                     console.log(tasks);
//                     res.json({ message: "Success", tasks: tasks });
//                 }
//             })
//         }
//     })
// })

app.listen(8000, function () {
    console.log("listening on port 8000");
})