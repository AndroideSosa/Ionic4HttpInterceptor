import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const apiUrl = "http://localhost:8484/Intranet/api/";

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  token:any;

  constructor(private http: HttpClient) { }
          
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  //Función para obtener la respuesta del servicio de lado del backend
  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  //Servicio para autenticarse
  authenticateUser(data): Observable<any> {
    return this.http.post(apiUrl+"authenticate", data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  //Servicio para obtener los datos del usuario en sesión
  getUserInfo(){
    return this.http.get(apiUrl+"userInfo").pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  //Servicio para obtener las areas sin token de autenticación(registro)
  getInitialAreas(): Observable<any> {
    return this.http.get(apiUrl+"areasNames").pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

   //Servicio para registrar un usuario
   postNewUser(data): Observable<any> {
    return this.http.post(apiUrl+"register", data)
      .pipe(
        catchError(this.handleError)
      );
  }

   //Servicio para registrar una nueva área (Administrador)
   postNewArea(data): Observable<any> {
    return this.http.post(apiUrl+"areas", data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }


  //Servicio para obtener todas las áreas registradas
  getAreas(): Observable<any> {
    return this.http.get(apiUrl+"areas").pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  //Servicio para editar una área en específico
  editArea(data): Observable<any> {
    return this.http.put(apiUrl+"areas", data)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  //Servicio para eliminar el registro de una área
  deleteArea(id: string): Observable<{}> {
    return this.http.delete(apiUrl+"areas/"+id)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

   //Servicio para registrar un usuario (Administrador)
   postAdminNewUser(data): Observable<any> {
    return this.http.post(apiUrl+"users", data)
      .pipe(
        catchError(this.handleError)
      );
  }

  //Servicio para obtener los datos de los usuarios asociados al área indicida
  getUsersByArea(id: string): Observable<any> {
    return this.http.get(apiUrl+"usersByArea/"+id).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  //Servicio para modificar la informacion de un usuario (Administrador)
  editUser(data): Observable<any> {
    return this.http.put(apiUrl+"users", data)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  //Servicio para eliminar usuario (Administrador)
  deleteUser(id: string): Observable<{}> {
    return this.http.delete(apiUrl+"users/"+id)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

}
