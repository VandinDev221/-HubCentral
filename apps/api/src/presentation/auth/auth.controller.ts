import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from '../../application/auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResendCodeDto } from './dto/resend-code.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login com email e senha' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Iniciar cadastro — envia código por e-mail' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.name);
  }

  @Post('register/verify')
  @Public()
  @ApiOperation({ summary: 'Confirmar cadastro com código recebido por e-mail' })
  verifyRegistration(@Body() dto: VerifyCodeDto) {
    return this.authService.verifyRegistration(dto.email, dto.code);
  }

  @Post('register/resend')
  @Public()
  @ApiOperation({ summary: 'Reenviar código de verificação' })
  resendCode(@Body() dto: ResendCodeDto) {
    return this.authService.resendCode(dto.email);
  }

  @Post('google')
  @Public()
  @ApiOperation({ summary: 'Login ou cadastro com Google (ID token)' })
  googleAuth(@Body() dto: GoogleAuthDto) {
    return this.authService.loginWithGoogle(dto.credential);
  }
}
