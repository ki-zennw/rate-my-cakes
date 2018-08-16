import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) {  }

  getCakes() {
    return this._http.get('/cakes');
  }

  getRatings() {
    return this._http.get('/ratings');
  }

  showCake(cake) {
    console.log("SHOW CAKE:", cake);
    return this._http.get('/' + cake._id);
  }

  createCake(cake) {
    return this._http.post('/new_cake', cake);
  }

  createRating(ratingCakeId, newRating) {
    console.log("create rating service data:", ratingCakeId, newRating)
    return this._http.put('/new_rating/' + ratingCakeId, newRating);
  }

  // deleteTask(id) {
  //   console.log("DELETE TASK:", id);
  //   return this._http.delete('/delete/' + id);
  // }

  // updateTask(task) {
  //   console.log("UPDATE TASK ID:", task);
  //   console.log(task._id)
  //   return this._http.put('/update/' + task._id, task);
  // }
}
