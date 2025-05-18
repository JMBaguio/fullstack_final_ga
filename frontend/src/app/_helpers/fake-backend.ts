import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

import { AlertService } from '@app/_services';
import { Role } from '@app/_models';

// array in local storage for accounts
const accountsKey = 'angular-10-signup-verification-boilerplate-accountss';
let accounts = JSON.parse(localStorage.getItem(accountsKey)) || [];

// array in local storage for requests
const requestsKey = 'angular-10-signup-verification-boilerplate-requests';
let requests = JSON.parse(localStorage.getItem(requestsKey)) || [];

// array in local storage for employees
const employeesKey = 'angular-10-signup-verification-boilerplate-employees';
let employees = JSON.parse(localStorage.getItem(employeesKey)) || [];

// array in local storage for departments
const departmentsKey = 'angular-10-signup-verification-boilerplate-departments';
let departments = JSON.parse(localStorage.getItem(departmentsKey)) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    constructor(private alertService: AlertService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;
        const alertService = this.alertService;

        return handleRoute();
 
        function handleRoute() {
            switch (true) {
                case url.endsWith('/accounts/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/accounts/refresh-token') && method === 'POST':
                    return refreshToken();
                case url.endsWith('/accounts/revoke-token') && method === 'POST':
                    return revokeToken();
                case url.endsWith('/accounts/register') && method === 'POST':
                    return register();
                case url.endsWith('/accounts/verify-email') && method === 'POST':
                    return verifyEmail();
                case url.endsWith('/accounts/forgot-password') && method === 'POST':
                    return forgotPassword();
                case url.endsWith('/accounts/validate-reset-token') && method === 'POST':
                    return validateResetToken();
                case url.endsWith('/accounts/reset-password') && method === 'POST':
                    return resetPassword();
                case url.endsWith('/accounts') && method === 'GET':
                    return getAccounts();
                case url.match(/\/accounts\/\d+$/) && method === 'GET':
                    return getAccountById();
                case url.endsWith('/accounts') && method === 'POST':
                    return createAccount();
                case url.match(/\/accounts\/\d+$/) && method === 'PUT':
                    return updateAccount();
                case url.endsWith('/accounts/deactivate') && method === 'PUT':
                        return deactivateAccount();  
                case url.endsWith('/accounts/activate') && method === 'PUT':
                    return activateAccount();        
                case url.endsWith('/requests') && method === 'GET':
                    return getRequests();
                case url.match(/\/requests\/\d+$/) && method === 'GET':
                    return getRequestById();
                case url.endsWith('/requests') && method === 'POST':
                    return createRequest();
                case url.match(/\/requests\/\d+$/) && method === 'PUT':
                    return updateRequest();
                case url.match(/\/requests\/\d+$/) && method === 'DELETE':
                    return deleteRequest();
                case url.match(/\/requests\/\d+\/approve$/) && method === 'PUT':
                    return approveRequest();
                case url.match(/\/requests\/\d+\/reject$/) && method === 'PUT':
                    return rejectRequest();
                case url.endsWith('/employees') && method === 'GET':
                    return getEmployees();
                case url.match(/\/employees\/\w+$/) && method === 'GET':
                    return getEmployeeById();
                case url.endsWith('/employees') && method === 'POST':
                    return createEmployee();
                case url.match(/\/employees\/\w+$/) && method === 'PUT':
                    return updateEmployee();
                case url.match(/\/employees\/\w+$/) && method === 'DELETE':
                    return deleteEmployee();
                case url.endsWith('/departments') && method === 'GET':
                    return getDepartments();
                case url.match(/\/departments\/[^/]+$/) && method === 'GET':
                    return getDepartmentById();
                case url.endsWith('/departments') && method === 'POST':
                    return createDepartment();
                case url.match(/\/departments\/[^/]+$/) && method === 'PUT':
                    return updateDepartment();
                case url.match(/\/departments\/[^/]+$/) && method === 'DELETE':
                    return deleteDepartment();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions

        function authenticate() {
            const { email, password } = body;
            const account = accounts.find(x => x.email === email && x.password === password && x.isVerified);
        
            if (!account) return error('Email or password is incorrect');
            if (!account.isActive) return error('Account is deactivated');
        
            // add refresh token to account
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            return ok({
                ...basicDetails(account),
                jwtToken: generateJwtToken(account)
            });
        }

        //deactivate account
        function deactivateAccount() {
            const { id } = body; // Extract the account ID from the request body
            const account = accounts.find(x => x.id === id); // Find the account by ID

            if (account) {
                if (!account.isActive) {
                    return error('Account is already deactivated'); // Prevent redundant deactivation
                }

                account.isActive = false; // Set the account as deactivated
                localStorage.setItem(accountsKey, JSON.stringify(accounts)); // Save changes to localStorage
                return ok({ message: 'Account deactivated successfully' }); // Return success response
            } else {
                return error('Account not found'); // Return error if account doesn't exist
            }
        }
        function activateAccount() {
            const { id } = body; // Extract the account ID from the request body
            const account = accounts.find(x => x.id === id); // Find the account by ID
        
            if (account) {
                if (account.isActive) {
                    return error('Account is already active'); // Prevent redundant activation
                }
        
                account.isActive = true; // Set the account as active
                localStorage.setItem(accountsKey, JSON.stringify(accounts)); // Save changes to localStorage
                return ok({ message: 'Account activated successfully' }); // Return success response
            } else {
                return error('Account not found'); // Return error if account doesn't exist
            }
        }
        

        function refreshToken() {
            const refreshToken = getRefreshToken();
            
            if (!refreshToken) return unauthorized();

            const account = accounts.find(x => x.refreshTokens.includes(refreshToken));
            
            if (!account) return unauthorized();

            // replace old refresh token with a new one and save
            account.refreshTokens = account.refreshTokens.filter(x => x !== refreshToken);
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok({
                ...basicDetails(account),
                jwtToken: generateJwtToken(account)
            });

        }

        function revokeToken() {
            if (!isAuthenticated()) return unauthorized();

            const refreshToken = getRefreshToken();
            const account = accounts.find(x => x.refreshTokens.includes(refreshToken));

            // revoke token and save
            account.refreshTokens = account.refreshTokens.filter(x => x !== refreshToken);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok();
        }

        function register() {
            const account = body;

            if (accounts.find(x => x.email === account.email)) {
                // display email already registered "email" in alert
                setTimeout(() => {
                    alertService.info(
                        `<h4>Email Already Registered</h4>
                        <p>Your email ${account.email} is already registered.</p>
                        <p>If you don't know your password please visit the <a href="${location.origin}/account/forgot-password">forgot password</a> page.</p>
                        <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an api. A real backend would send a real email.</div>`,
                        { autoClose: false });
                }, 1000);

                // always return ok() response to prevent email enumeration
                return ok();
            }

            // assign account id and a few other properties then save
            account.id = newAccountId();
            if (account.id === 1) {
                // first registered account is an admin
                account.role = Role.Admin;
            } else {
                account.role = Role.User;
            }
            account.dateCreated = new Date().toISOString();
            account.verificationToken = new Date().getTime().toString();
            account.isVerified = false;
            account.isActive = true; // New property added to ensure account is active by default
            account.refreshTokens = [];
            delete account.confirmPassword;
            accounts.push(account);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            // display verification email in alert
            setTimeout(() => {
                const verifyUrl = `${location.origin}/account/verify-email?token=${account.verificationToken}`;
                alertService.info(`
                    <h4>Verification Email</h4>
                    <p>Thanks for registering!</p>
                    <p>Please click the below link to verify your email address:</p>
                    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
                    <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an api. A real backend would send a real email.</div>
                `, { autoClose: false });
            }, 1000);

            return ok();
        }

        function verifyEmail() {
            const { token } = body;
            const account = accounts.find(x => x.verificationToken && x.verificationToken === token);

            if (!account) return error('Verification failed');

            // set is verified flag to true if token is valid
            account.isVerified = true;
            delete account.verificationToken; // Remove the token after verification
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok();
        }

        function forgotPassword() {
            const { email } = body;
            const account = accounts.find(x => x.email === email);
        
            // always return ok() response to prevent email enumeration
            if (!account) return ok();
        
            // create reset token that expires after 24 hours
            account.resetToken = new Date().getTime().toString();
            account.resetTokenExpires = new Date(Date.now() + 24*60*60*1000).toISOString();
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            // display password reset email in alert
            setTimeout(() => {
                const resetUrl = `${location.origin}/account/reset-password?token=${account.resetToken}`;
                alertService.info(
                    `<h4>Reset Password Email</h4>
                    <p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                    <p><a href="${resetUrl}">${resetUrl}</a></p>
                    <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an api. A real backend would send a real email.</div>`,
                    { autoClose: false });
            }, 1000);
        
            return ok();
        }
        
        function validateResetToken() {
            const { token } = body;
            const account = accounts.find(x =>
                !!x.resetToken === token && x.resetToken === token &&
                new Date() < new Date(x.resetTokenExpires)
            );
        
            if (!account) return error('Invalid token');
        
            return ok();
        }
        
        function resetPassword() {
            const { token, password } = body;
            const account = accounts.find(x => 
                !!x.resetToken && x.resetToken === token &&
                new Date() < new Date(x.resetTokenExpires)
            );

            if (!account) return error('Invalid token');

            // update password and remove reset token
            account.password = password;
            account.isVerified = true;
            delete account.resetToken;
            delete account.resetTokenExpires;
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok();
        }

        function getAccounts() {
            if (!isAuthenticated()) return unauthorized();
            return ok(accounts.map(x => basicDetails(x)));
        }

        function getAccountById() {
            if (!isAuthenticated()) return unauthorized();

            let account = accounts.find(x => x.id === idFromUrl());

            // user accounts can get own profile and admin accounts can get all profiles
            if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) {
                return unauthorized();
            }

            return ok(basicDetails(account));
        }

        function createAccount() {
            if (!isAuthorized(Role.Admin)) return unauthorized();

            const account = body;
            if (accounts.find(x => x.email === account.email)) {
                return error(`Email ${account.email} is already registered`);
            }

            // assign account id and a few other properties then save
            account.id = newAccountId();
            if (account.id === 1) {
                // first registered account is an admin
                account.role = Role.Admin;
            } else {
                account.role = Role.User;
            }
            account.dateCreated = new Date().toISOString();
            account.isVerified = true;
            account.refreshTokens = [];
            delete account.confirmPassword;
            accounts.push(account);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok();
        }

        function updateAccount() {
            if (!isAuthenticated()) return unauthorized();

            let params = body;
            let account = accounts.find(x => x.id === idFromUrl());

            // user accounts can update own profile and admin accounts can update all profiles
            if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) {
                return unauthorized();
            }

            // only update password if included
            if (!params.password) {
                delete params.password;
            }
            // don't save confirm password
            delete params.confirmPassword;

            // update and save account
            Object.assign(account, params);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok(basicDetails(account));
        }

        // function deleteAccount() {
        //     if (!isAuthenticated()) return unauthorized();

        //     let account = accounts.find(x => x.id === idFromUrl());

        //     // user accounts can delete own account and admin accounts can delete any account
        //     if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) {
        //         return unauthorized();
        //     }

        //     // delete account then save
        //     accounts = accounts.filter(x => x.id !== idFromUrl());
        //     localStorage.setItem(accountsKey, JSON.stringify(accounts));
        //     return ok();
        // }

        // request functions
        function getRequests() {
            if (!isAuthenticated()) return unauthorized();
            return ok(requests);
        }

        function getRequestById() {
            if (!isAuthenticated()) return unauthorized();
            const request = requests.find(x => x.id === idFromUrl());
            return ok(request);
        }

        function createRequest() {
            if (!isAuthenticated()) return unauthorized();
            const request = body;
            request.id = newRequestId();
            request.status = 'pending';
            request.createdAt = new Date().toISOString();
            request.updatedAt = new Date().toISOString();
            request.userId = currentAccount().id;
            request.userName = currentAccount().firstName + ' ' + currentAccount().lastName;
            requests.push(request);
            localStorage.setItem(requestsKey, JSON.stringify(requests));
            return ok(request);
        }

        function updateRequest() {
            if (!isAuthenticated()) return unauthorized();
            const request = requests.find(x => x.id === idFromUrl());
            if (!request) return error('Request not found');
            
            // only allow updating title and description
            request.title = body.title;
            request.description = body.description;
            request.updatedAt = new Date().toISOString();
            localStorage.setItem(requestsKey, JSON.stringify(requests));
            return ok(request);
        }

        function deleteRequest() {
            if (!isAuthenticated()) return unauthorized();
            if (!isAuthorized(Role.Admin)) return unauthorized();
            
            requests = requests.filter(x => x.id !== idFromUrl());
            localStorage.setItem(requestsKey, JSON.stringify(requests));
            return ok();
        }

        function approveRequest() {
            if (!isAuthenticated()) return unauthorized();
            if (!isAuthorized(Role.Admin)) return unauthorized();
            
            const request = requests.find(x => x.id === idFromUrl());
            if (!request) return error('Request not found');
            
            if (request.status === 'approved') {
                return error('Request is already approved');
            }
            
            request.status = 'approved';
            request.updatedAt = new Date().toISOString();
            localStorage.setItem(requestsKey, JSON.stringify(requests));
            return ok(request);
        }

        function rejectRequest() {
            if (!isAuthenticated()) return unauthorized();
            if (!isAuthorized(Role.Admin)) return unauthorized();
            
            const request = requests.find(x => x.id === idFromUrl());
            if (!request) return error('Request not found');
            
            if (request.status === 'rejected') {
                return error('Request is already rejected');
            }
            
            request.status = 'rejected';
            request.updatedAt = new Date().toISOString();
            localStorage.setItem(requestsKey, JSON.stringify(requests));
            return ok(request);
        }

        function newRequestId() {
            return requests.length ? Math.max(...requests.map(x => x.id)) + 1 : 1;
        }

        // Employee functions
        function getEmployees() {
            if (!isAuthenticated()) return unauthorized();
            return ok(employees.map(mapEmployeeToFrontend));
        }

        function getEmployeeById() {
            if (!isAuthenticated()) return unauthorized();
            const employee = employees.find(x => x.id == idFromUrl());
            return ok(mapEmployeeToFrontend(employee));
        }

        function createEmployee() {
            if (!isAuthenticated()) return unauthorized();
            const employee = body;

            // Find account by email or id
            const account = accounts.find(x => x.email === employee.account || x.id === employee.accountId);
            if (!account) {
                return error('Account does not exist. Please create an account first.');
            }

            // Check for duplicate employeeId
            if (employees.some(e => e.employeeId === employee.employeeId)) {
                return error('Employee ID already exists.');
            }

            employee.id = newEmployeeId();
            employee.accountId = account.id; // Store the relationship
            employee.account = account.email; // For display
            employee.isActive = employee.status === 'Active';
            employees.push(employee);
            localStorage.setItem(employeesKey, JSON.stringify(employees));
            return ok(mapEmployeeToFrontend(employee));
        }

        function updateEmployee() {
            if (!isAuthenticated()) return unauthorized();
            const employee = employees.find(x => x.id == idFromUrl());
            if (!employee) return error('Employee not found');
            Object.assign(employee, body);
            employee.isActive = employee.status === 'Active';
            localStorage.setItem(employeesKey, JSON.stringify(employees));
            return ok(mapEmployeeToFrontend(employee));
        }

        function deleteEmployee() {
            if (!isAuthenticated()) return unauthorized();
            employees = employees.filter(x => x.id != idFromUrl());
            localStorage.setItem(employeesKey, JSON.stringify(employees));
            return ok();
        }

        function newEmployeeId() {
            return (Date.now() + Math.random()).toString();
        }

        function mapEmployeeToFrontend(employee) {
            if (!employee) return employee;
            return {
                ...employee,
                status: employee.isActive ? 'Active' : 'Inactive'
            };
        }

        // Department functions
        function getDepartments() {
            if (!isAuthenticated()) return unauthorized();
            return ok(departments);
        }

        function getDepartmentById() {
            if (!isAuthenticated()) return unauthorized();
            const department = departments.find(x => x.id == idFromUrl());
            return ok(department);
        }

        function createDepartment() {
            if (!isAuthenticated()) return unauthorized();
            const department = body;
            department.id = newDepartmentId();
            departments.push(department);
            localStorage.setItem(departmentsKey, JSON.stringify(departments));
            return ok(department);
        }

        function updateDepartment() {
            if (!isAuthenticated()) return unauthorized();
            const department = departments.find(x => x.id == idFromUrl());
            if (!department) return error('Department not found');
            Object.assign(department, body);
            localStorage.setItem(departmentsKey, JSON.stringify(departments));
            return ok(department);
        }

        function deleteDepartment() {
            if (!isAuthenticated()) return unauthorized();
            departments = departments.filter(x => x.id != idFromUrl());
            localStorage.setItem(departmentsKey, JSON.stringify(departments));
            return ok();
        }

        function newDepartmentId() {
            return (Date.now() + Math.random()).toString();
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)); // delay observable to simulate server api call
        }

        function error(message) {
            return throwError({ error: { message } })
                .pipe(materialize(), delay(500), dematerialize());
            // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/6487)
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorized' } })
                .pipe(materialize(), delay(500), dematerialize());
        }

        function basicDetails(account) {
            const { id, title, firstName, lastName, email, role, dateCreated, isVerified } = account;
            return { id, title, firstName, lastName, email, role, dateCreated, isVerified };
        }

        function isAuthenticated() {
            return !!currentAccount();
        }

        function isAuthorized(role: string) {
            const account = currentAccount();
            if (!account) return false;
            return account.role === role;
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return urlParts[urlParts.length - 1];
        }

        function newAccountId() {
            return accounts.length ? Math.max(...accounts.map(x => x.id)) + 1 : 1;
        }

        function currentAccount() {
            // check if jwt token is in auth header
            const authHeader = headers.get('Authorization');
            if (!authHeader?.startsWith('Bearer fake-jwt-token')) return;

            // check if token is expired
            const jwtToken = JSON.parse(atob(authHeader.split('.')[1]));
            const tokenExpired = Date.now() > (jwtToken.exp * 1000);
            if (tokenExpired) return;

            const account = accounts.find(x => x.id === jwtToken.id);
            return account;
        }

        function generateJwtToken(account) {
            // create token that expires in 15 minutes
            const tokenPayload = {
                exp: Math.round(new Date(Date.now() + 15*60*1000).getTime() / 1000),
                id: account.id
            }
            return `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;
        }

        function generateRefreshToken() {
            const token = new Date().getTime().toString();

            // add token cookie that expires in 7 days
            const expires = new Date(Date.now() + 7*24*60*60*1000).toUTCString();
            document.cookie = `fakeRefreshToken=${token}; expires=${expires}; path=/`;

            return token;
        }

        function getRefreshToken() {
            // get refresh token from cookie
            return (document.cookie.split(';').find(x => x.includes('fakeRefreshToken')) || '').split('=')[1];
        }
    }

    
}
    
export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};