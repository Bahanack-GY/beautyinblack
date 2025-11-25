import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    console.log('=== FILTRE D\'EXCEPTION DÉCLENCHÉ ===');
    console.log('Chemin:', request.url);
    console.log('Méthode:', request.method);
    console.log('Type d\'exception:', exception?.constructor?.name);
    
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Journaliser les informations détaillées de l'erreur
    if (exception instanceof HttpException) {
      console.log('Statut de l\'exception HTTP:', status);
      console.log('Message de l\'exception HTTP:', message);
    } else {
      console.error('Exception non-HTTP:', exception);
      console.error('Message d\'erreur:', (exception as Error)?.message);
      console.error('Pile d\'erreur:', (exception as Error)?.stack);
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: typeof message === 'string' ? message : (message as any).message || 'Error',
      message: typeof message === 'string' ? message : (message as any).error || 'An error occurred',
    };

    console.log('Envoi de la réponse d\'erreur:', errorResponse);
    response.status(status).json(errorResponse);
  }
}

