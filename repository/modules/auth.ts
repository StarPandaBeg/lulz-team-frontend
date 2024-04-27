import HttpFactory from "../factory";

class AuthModule extends HttpFactory {
  private Resource = "/auth";

  auth(email: string, password: string) {
    return this.call<number>(
      "POST",
      this.Resource,
      JSON.stringify({ email, password })
    );
  }
}

export default AuthModule;
