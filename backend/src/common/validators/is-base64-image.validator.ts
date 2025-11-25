import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsBase64ImageConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    // Gérer les tableaux
    if (Array.isArray(value)) {
      return value.every((item) => this.isValidBase64Image(item));
    }

    // Gérer une valeur unique
    return this.isValidBase64Image(value);
  }

  private isValidBase64Image(value: any): boolean {
    // Autoriser undefined/null pour les champs optionnels
    if (value === undefined || value === null || value === '') {
      return true; // Laisser @IsOptional gérer la logique requis/optionnel
    }

    if (typeof value !== 'string') {
      return false;
    }

    // Vérifier si c'est un format URI de données base64 : data:image/<type>;base64,<data>
    const base64ImageRegex = /^data:image\/(png|jpg|jpeg|gif|webp|svg\+xml);base64,[A-Za-z0-9+/=\s]+$/;
    
    // Autoriser aussi les chaînes base64 pures (sans préfixe URI de données) pour compatibilité ascendante
    const pureBase64Regex = /^[A-Za-z0-9+/=\s]+$/;
    
    // Vérifier si c'est une URL (pour compatibilité ascendante pendant la migration)
    const urlRegex = /^https?:\/\//;

    // Accepter l'URI de données base64
    if (base64ImageRegex.test(value.trim())) {
      return true;
    }

    // Pour base64 pur (sans URI de données), valider que c'est un base64 valide
    const trimmedValue = value.trim();
    if (pureBase64Regex.test(trimmedValue) && trimmedValue.length > 50) {
      try {
        // Essayer de décoder pour vérifier que c'est un base64 valide
        atob(trimmedValue.substring(0, Math.min(100, trimmedValue.length)).replace(/\s/g, ''));
        return true;
      } catch {
        // Pas un base64 valide, continuer à vérifier d'autres formats
      }
    }

    // Autoriser les URL pour compatibilité ascendante
    if (urlRegex.test(value)) {
      return true;
    }

    // Si chaîne vide et champ optionnel, cela devrait passer (géré par @IsOptional)
    if (value === '') {
      return true;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Image must be a valid base64 encoded string in the format: data:image/<type>;base64,<data>';
  }
}

/**
 * Valide qu'une chaîne est une image encodée en base64
 * Accepte :
 * - data:image/<type>;base64,<base64string> (recommandé)
 * - Chaîne base64 pure (pour compatibilité ascendante)
 * - URL (pour compatibilité ascendante pendant la migration)
 */
export function IsBase64Image(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBase64ImageConstraint,
    });
  };
}

