import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Projet } from '../controller/model/projet.model';
import { Response } from '../controller/model/response.model';
import { ProjetService } from '../controller/service/projet.service';
@Component({
  selector: 'app-projet',
  templateUrl: './projet.component.html',
  styleUrls: ['./projet.component.scss'],
})
export class ProjetComponent implements AfterViewInit {
  accordion: MatAccordion = new MatAccordion();
  ate: Projet[];
  res: Response[];
  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource: any[];
  sortedByBrand: Response[];
  tempVal: any;
  k = 0;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    for (const data of this.dataSource) {
      data.sort = this.sort;
    }
  }
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private projetService: ProjetService
  ) {
    this.ate = [];
    this.res = [];
    this.sortedByBrand = [];
    this.dataSource = [];
    this.sort = new MatSort();
  }

  ngOnInit() {
    if (!this.cookieService.check('admin')) this.router.navigate(['/home']);
    let expertName = JSON.parse(this.cookieService.get('admin')).login;
    this.projetService.getProjets(expertName).subscribe(
      (data: Projet[]) => {
        for (var key in data) {
          let proj = new Projet();
          proj.projetName = data[key].projetName;
          proj.id = data[key].id;
          proj.description = data[key].description;
          this.ate.push(proj);
          this.projetService.findAnswers(proj.projetName).subscribe(
            (data) => {
              this.k = 0;
              this.res = [];
              let i = 0;
              let temp: Response;
              for (const [key, value] of Object.entries(data)) {
                temp = new Response();
                temp.name = key;
                temp.weight = value;
                temp.position = i;
                this.res.push(temp);
                i++;
              }

              this.sortedByBrand = this.res.sort(
                (first: any, second: any) => second.weight - first.weight
              );
              this.tempVal = new MatTableDataSource(
                this.cloneData(this.sortedByBrand)
              );
              this.tempVal.sort = this.sort;
              this.dataSource.push(this.tempVal);
            },
            (error) => {
              console.log(error);
            }
          );
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  cloneData(response: Response[]): Response[] {
    let newResponse: any[];
    newResponse = [];
    let minNewRes: Response;
    for (const val of response) {
      minNewRes = new Response();
      minNewRes.name = val.name;
      minNewRes.position = val.position;
      minNewRes.weight = val.weight;
      newResponse.push(minNewRes);
    }
    return newResponse;
  }
}
