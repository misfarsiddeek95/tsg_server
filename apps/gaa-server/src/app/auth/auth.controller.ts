import { Controller, Patch, Body, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // update the editable_count of the session evaluation.
  @Patch("url-redirect-update")
  async updateUrlRedirectTable(@Body() data: any) {
    return await this.authService.updateUrlRedirectTable(data);
  }

  @Post("create-jwt-token")
  async createJWTToken(@Body() data: any) {
    return await this.authService.createJWTToken(data);
  }
}
