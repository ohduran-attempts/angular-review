import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of} from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private http: HttpClient,
              private messageService: MessageService) { }

  private heroesUrl = 'api/heroes';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private log(message:string) {
    this.messageService.add('HeroService: ${message}')
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {

      //log to console
      console.error(error);

      //transforming error for user consumption
      this.log('${operation} failed: ${error.message}');

      // Keep running
      return of(result as T);
    };
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((hero: Hero) => this.log('added hero with id=${hero.id}')),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

    /** PUT: update the hero on the server */
  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

    /** GET heroes from the server */
  getHeroes (): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      );
  }
    /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = '${this.heroesUrl}/${id}';

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
        tap(_ => this.log('deleted hero id=${id}')),
        catchError(this.handleError<Hero>('deleteHero'))
    );
  }
}
