import { Component, OnInit } from '@angular/core'; 
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services'; 
import { Account } from '@app/_models';

@Component({ 
  templateUrl: 'list.component.html' 
}) 

export class ListComponent implements OnInit { 
  accounts: any[] = [];

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.accountService.getAll().subscribe(accounts => {
      this.accounts = accounts.map(account => ({
        ...account,
        isDeactivating: false,
        isActivating: false
      }));
    });
  }

  deleteAccount(id: string) {
    const account = this.accounts.find(x => x.id === id); 
    account.isDeleting = true; 
    this.accountService.delete(id)
        .pipe(first())
        .subscribe(() => {
            this.accounts = this.accounts.filter(x => x.id !== id);
        });
  }

  deactivateAccount(id: number) {
    const account = this.accounts.find(x => x.id === id);
    if (account) {
      account.isDeactivating = true;
      this.accountService.deactivateAccount(id)
        .pipe(first())
        .subscribe({
          next: () => {
            account.isActive = false;
            account.isDeactivating = false;
          },
          error: (error) => {
            console.error('Error deactivating account:', error);
            account.isDeactivating = false;
          }
        });
    }
  }

  activateAccount(id: number) {
    const account = this.accounts.find(x => x.id === id);
    if (account) {
      account.isActivating = true;
      this.accountService.activateAccount(id)
        .pipe(first())
        .subscribe({
          next: () => {
            account.isActive = true;
            account.isActivating = false;
          },
          error: (error) => {
            console.error('Error activating account:', error);
            account.isActivating = false;
          }
        });
    }
  }
}
