import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Critere } from '../controller/model/critere.model';
import { Expert } from '../controller/model/expert.model';
import { ProjetPayload } from '../controller/model/projet-payload.model';
import { Projet } from '../controller/model/projet.model';
import { ProjetService } from '../controller/service/projet.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  questionForm: FormGroup;
  error = false;
  ate: any[];

  animals: question[] = [
    { name: "D'importance égale", val: '1,1,1' },
    { name: 'Un peu plus important', val: '1,2,3' },
    { name: 'Modérément plus important', val: '2,3,4' },
    { name: 'En plus Modérément plus important', val: '3,4,5' },
    { name: 'Stronggly plus importante', val: '4,5,6' },
    { name: 'De plus fortement plus important', val: '5,6,7' },
    { name: 'Très fortement plus important', val: '6,7,8' },
    { name: 'Peu extrêmement plus important', val: '7,8,9' },
    { name: 'Extrêmement plus important', val: '8,9,10' },
  ];
  array = ['apple', 'banana', 'lemon', 'mango'];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
    private _snackBar: MatSnackBar,
    private projetService: ProjetService
  ) {
    this.questionForm = this.formBuilder.group({});
    this.ate = [];
  }

  ngOnInit(): void {
    if (!this.cookieService.check('expert')) this.router.navigate(['/home']);
    else {
      this.questionForm = this.formBuilder.group({});

      let projetName = JSON.parse(this.cookieService.get('expert')).projet
        .projetName;
      this.projetService.getCriteres(projetName).subscribe(
        (data: Projet) => {
          this.ate = this.loadQst(data.criteres);
          for (let index = 0; index < this.ate.length; index++) {
            const element = this.ate[index];
            let n = 'qst' + index;
            this.questionForm.addControl(n, new FormControl(''));
          }
        },

        (error) => {
          console.log(error);
        }
      );
    }
  }

  loadQst(arr: Critere[] | any) {
    let array = [];
    for (var key in arr) {
      var obj = arr[key].critereName;
      array.push(obj);
    }
    let results = [];
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = i + 1; j < array.length; j++) {
        results.push(
          `Quelle est votre preferance de "${array[i]}" par rapport a "${array[j]}"`
        );
      }
    }

    return results;
  }
  submitQst() {
    var keys = Object.keys(this.questionForm.value);
    let results = '';

    for (let index = 0; index < this.ate.length; index++) {
      const element = this.questionForm.value[keys[index]];
      results = results + element + ';';
    }
    let expert: Expert = JSON.parse(this.cookieService.get('expert'));
    expert.answers = results;
    this.projetService.answerQst(expert).subscribe(
      (data) => {
        this.cookieService.deleteAll();
        this.router.navigate(['/answered']);
      },

      (error) => {
        console.log(error);
      }
    );
  }
}
interface question {
  name: string;
  val: string;
}
