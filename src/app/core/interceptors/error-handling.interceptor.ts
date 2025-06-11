import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {

  constructor(
    private readonly notification: NzNotificationService,
    private readonly router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';
        console.error('HTTP Error:', error); 

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
          this.notification.error('Error de Cliente', `Ocurrió un error en el navegador: ${error.error.message}`);
        } else {
          // Server-side error
          if (error.status) {
             switch (error.status) {
              case 0:
                errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a Internet.';
                this.notification.error('Error de Conexión', errorMessage);
                break;
              case 400: // Bad Request
                errorMessage = error.error?.message || 'Solicitud inválida.';
                this.notification.warning('Solicitud Inválida', errorMessage);
                break;
              case 401: // Unauthorized
                errorMessage = 'No autorizado. Por favor, inicie sesión de nuevo.';
                this.notification.error('Acceso Denegado', errorMessage);
                // Ejemplo: aca podriamos redirigir al usuario donde quiera
                // this.router.navigate(['/login']);
                break;
              case 403: // Forbidden
                errorMessage = 'Acceso prohibido. No tiene permisos para realizar esta acción.';
                this.notification.error('Acceso Prohibido', errorMessage);
                break;
              case 404: // Not Found
                errorMessage = 'El recurso solicitado no fue encontrado.';
                this.notification.warning('Recurso no Encontrado', errorMessage);
                break;
              case 500: // Internal Server Error
                errorMessage = 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.';
                this.notification.error('Error del Servidor', errorMessage);
                break;
              default:
                errorMessage = `Error del servidor: ${error.status} - ${error.statusText || 'Desconocido'}`;
                this.notification.error('Error de API', errorMessage);
                break;
            }
          } else {
            // Error sin status (ej. CORS issue antes de que llegue el status)
            errorMessage = 'Ocurrió un error inesperado al comunicarse con el servidor.';
            this.notification.error('Error de Red', errorMessage);
          }
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}