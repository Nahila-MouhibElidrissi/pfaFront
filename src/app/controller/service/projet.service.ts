import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Expert } from '../model/expert.model';
import { ProjetPayload } from '../model/projet-payload.model';
import { Projet } from '../model/projet.model';

@Injectable({
  providedIn: 'root',
})
export class ProjetService {
  constructor(private httpClient: HttpClient) {}

  createProjet(projetPayload: ProjetPayload) {
    return this.httpClient.post(
      'https://pfaback.herokuapp.com/api/projet/create/',
      projetPayload
    );
  }
  getCriteres(projetName: string) {
    return this.httpClient.get(
      `https://pfaback.herokuapp.com/api/projet/email/${projetName}`
    );
  }
  answerQst(expert: Expert) {
    return this.httpClient.put(
      'https://pfaback.herokuapp.com/api/expert/answer/',
      expert
    );
  }
  getProjets(expertName: string): Observable<Projet[]> {
    return this.httpClient.get<Projet[]>(
      `https://pfaback.herokuapp.com/api/admin/projets/${expertName}`
    );
  }
}
