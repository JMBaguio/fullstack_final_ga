import { AccountService } from "../../app/_services";
import { finalize } from "rxjs/operators";

export function appInitializer(accountService: AccountService) {
  return () =>
    new Promise<void>((resolve) => {
      // attempt to refresh token on app start up to auto authenticate
      accountService
        .refreshToken()
        .pipe(finalize(() => resolve()))
        .subscribe();
    });
}
