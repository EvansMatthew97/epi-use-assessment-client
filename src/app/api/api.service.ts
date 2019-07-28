import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

const TOKEN_PATH = 'token';

export class AuthException {
  constructor(public message = '') {}
}

/**
 * Service for interacting with the server
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;
  public readonly $authStateChange = new BehaviorSubject(false);

  constructor(
    private readonly httpClient: HttpClient,
  ) {
    console.log('constructed api');
    this.verifyToken();
  }

  /**
   * Verifies the username and password with the server.
   */
  public async logIn(username: string, password: string): Promise<boolean> {
    try {
      const { token } = await this.post('/login', {
        username,
        password,
      });

      console.log('logged in', token);

      await this.setToken(token);
      console.log('set token');
      this.$authStateChange.next(true);
      console.log('next state');
      return true;
    } catch (error) {
      if (error instanceof AuthException) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Check whether the app state is authenticated
   */
  public isAuthenticated(): boolean {
    return this.$authStateChange.value;
  }

  /**
   * Checks whether a token is valid, then sets the
   * authentication state to true/false. Based on whether
   * a token is stored and that stored token is valid
   * according to the server.
   */
  private async verifyToken(): Promise<boolean> {
    try {
      const res = await this.get('/verify-token', {});
      if (res === true) {
        this.$authStateChange.next(true);
        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof AuthException) {
        this.$authStateChange.next(false);
        return false;
      }
      throw error;
    }
  }

  /**
   * Saves a token to browser storage
   */
  private setToken(token: string): Promise<void> {
    return new Promise(resolve => {
      localStorage.setItem(TOKEN_PATH, token);
      resolve();
    });
  }

  /**
   * Retrieves token from browser storage
   */
  private getToken(): Promise<string> {
    return new Promise(resolve => {
      resolve(localStorage.getItem(TOKEN_PATH));
    });
  }

  /**
   * Performs a POST request on the given url.
   * @param url The url to request - should not include base url (e.g. only /employee/save)
   * @param params The body of the post
   */
  public async post(url: string, params: { [key: string]: any }): Promise<any> {
    return await this.request('POST', url, params);
  }

  /**
   * Performs a GET request on the given url
   * @param url the url to request - should not include base url (e.g. only /employee/save)
   * @param params parameters to be added to the url query
   */
  public async get(url: string, params: { [s: string]: any }): Promise<any> {
    const urlWithParams = `${url}?${Object.keys(params)
      .map(param => `param=${params[param]}`)
      .join('&')
    }`;

    return await this.request('GET', urlWithParams, {});
  }

  private async request(method: 'GET' | 'POST', url: string, params: { [s: string]: any }): Promise<any> {
    const headers = await this.createAuthHeaders();

    url = `${this.baseUrl}${url}`;
    try {
      if (method === 'GET') {
        return await this.httpClient.get(url, {
          headers,
        }).toPromise();
      } else if (method === 'POST') {
        return await this.httpClient.post(url, params, {
          headers,
        }).toPromise();
      }
    } catch (error) {
      if (error.status !== 401) {
        throw error;
      }
      this.$authStateChange.next(false);
      throw new AuthException();
    }
  }

  /**
   * Create headers with the stored token as the authorization
   * bearer token.
   */
  private async createAuthHeaders(): Promise<HttpHeaders> {
    const headers = new HttpHeaders();
    headers.set('Authorization', `Bearer ${await this.getToken()}`);
    return headers;
  }
}
