import { Component, OnInit } from '@angular/core';
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'public';
  cakes = [];
  ratings = [];
  newCake: any;
  cake = {};
  selectedCake = false;
  newRating: any;

  constructor(private _httpService:
    HttpService) { }
  ngOnInit() {
    this.newCake = { title: "", description: "" }
    this.newRating = { rating: 5, comment: "" }
    this.getAllCakes()
  }

  getAllCakes() {
    this._httpService.getCakes().subscribe(data => {
      // console.log("GOT OUR DATA", data);
      this.cakes = data['cakes'];
    })
  }

  getAllRatings() {
    this._httpService.getRatings().subscribe(data => {
      this.ratings = data['ratings'];
    })
  }

  onSubmitCreateCake() {
    this._httpService.createCake(this.newCake).subscribe((resData) => {
      console.log(resData);
      this.newCake = { baker_name: "", img: "" }
      this.getAllCakes();
    })
  }

  onSubmitCreateRating(cakeId, newRating) {
    let ratingCakeId = cakeId.target.id;
    console.log("on submit rating cake id:", ratingCakeId);
    console.log(newRating)
    this._httpService.createRating(ratingCakeId, this.newRating).subscribe((resData) => {
      console.log(resData);
      this.newRating = { rating: 5, comment: "" }
      this.cakeToShow(this.cake);
    })
  }

  cakeToShow(cake): void {
    this._httpService.showCake(cake).subscribe(data => {
      console.log(data);
      this.selectedCake = true;
      this.cake = data['cake'];
      let sum = 0;
      for (let i = 0; i < this.cake.ratings.length; i++) {
        sum += this.cake.ratings[i].rating;
      }
      this.cake.avg_rating = sum / this.cake.ratings.length;
      // console.log("THIS CAKE'S RATINGS:", this.cake.ratings[0].rating);
    })
  }

  // ratingsToShow(rating): void {
  //   this._httpService.getRatings().subscribe(data => {
  //     console.log(data);
  //     this.ratings = data['ratings'];
  //   })
  // }
}

