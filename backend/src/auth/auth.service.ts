import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email.toLowerCase() });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  async signup(signupDto: SignupDto) {
    if (signupDto.password !== signupDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.userModel.findOne({
      email: signupDto.email.toLowerCase(),
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const user = await this.userModel.create({
      name: signupDto.name,
      email: signupDto.email.toLowerCase(),
      phone: signupDto.phone,
      password: hashedPassword,
    });

    const token = this.generateToken(user);
    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({
      email: forgotPasswordDto.email.toLowerCase(),
    });

    if (!user) {
      // Ne pas révéler si l'utilisateur existe pour la sécurité
      return { message: 'If the email exists, a password reset link has been sent' };
    }

    // Générer le token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    // TODO: Envoyer un email avec le token de réinitialisation
    // Pour l'instant, on retourne un message (en production, envoyer un email)

    return {
      message: 'If the email exists, a password reset link has been sent',
      // En développement, vous pourriez vouloir retourner le token pour les tests
      // token: resetToken,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(resetPasswordDto.token)
      .digest('hex');

    const user = await this.userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(resetPasswordDto.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: 'Password reset successfully' };
  }

  async createInitialAdmin(createAdminDto: CreateAdminDto) {
    if (createAdminDto.password !== createAdminDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Vérifier si un administrateur existe déjà
    const existingAdmin = await this.userModel.findOne({ role: 'admin' });

    // Obtenir la clé secrète depuis les variables d'environnement
    const adminSecretKey = this.configService.get<string>('ADMIN_SECRET_KEY');
    const providedSecretKey = createAdminDto.secretKey;

    // Si un admin existe, exiger une clé secrète pour en créer un autre
    if (existingAdmin) {
      if (!adminSecretKey || providedSecretKey !== adminSecretKey) {
        throw new UnauthorizedException(
          'An admin user already exists. To create an additional admin, provide a valid secret key.',
        );
      }
    }

    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await this.userModel.findOne({
      email: createAdminDto.email.toLowerCase(),
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    // Créer l'utilisateur administrateur
    const admin = await this.userModel.create({
      name: createAdminDto.name,
      email: createAdminDto.email.toLowerCase(),
      phone: createAdminDto.phone,
      password: hashedPassword,
      role: 'admin',
      emailVerified: true, // Vérifier automatiquement les emails admin
    });

    // Générer le token
    const token = this.generateToken(admin);

    return {
      message: 'Admin user created successfully',
      token,
      user: {
        ...this.sanitizeUser(admin),
        role: admin.role,
      },
    };
  }

  private generateToken(user: UserDocument): string {
    const payload = { 
      email: user.email, 
      sub: user._id.toString(),
      userId: user._id.toString(),
      role: user.role || 'user',
    };
    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: UserDocument) {
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.resetPasswordToken;
    delete userObj.resetPasswordExpires;
    return {
      id: userObj._id,
      name: userObj.name,
      email: userObj.email,
      phone: userObj.phone,
      profileImage: userObj.profileImage,
      membershipType: userObj.membershipType,
      emailVerified: userObj.emailVerified,
      role: userObj.role || 'user',
    };
  }
}

