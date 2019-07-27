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
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;
  public $authStateChange = new BehaviorSubject(false);

  constructor(
    private readonly httpClient: HttpClient,
  ) {
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

      await this.setToken(token);
      this.$authStateChange.next(true);
      return true;
    } catch (error) {
      if (error.status instanceof AuthException) {
        return false;
      }
      throw error;
    }
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
    localStorage.setItem(TOKEN_PATH, token);
    return Promise.resolve();
  }

  /**
   * Retrieves token from browser storage
   */
  private getToken(): Promise<string> {
    return Promise.resolve(localStorage.getItem(TOKEN_PATH));
  }

  /**
   * Performs a POST request on the given url.
   * @param url The url to request - should not include base url (e.g. only /employee/save)
   * @param params The body of the post
   */
  public async post(url: string, params: { [key: string]: any }): Promise<any> {
    const headers = await this.createAuthHeaders();

    try {
      return await this.httpClient.post(`${this.baseUrl}${url}`, params, {
        headers,
      }).toPromise();
    } catch (error) {
      if (error.status !== 401) {
        throw error;
      }
      this.$authStateChange.next(false);
      throw new AuthException();
    }
  }

  /**
   * Performs a GET request on the given url
   * @param url the url to request - should not include base url (e.g. only /employee/save)
   * @param params parameters to be added to the url query
   */
  public async get(url: string, params: { [s: string]: any }): Promise<any> {
    const urlWithParams = `${this.baseUrl}${url}?${Object.keys(params)
      .map(param => `param=${params[param]}`)
      .join('&')
    }`;

    const headers = await this.createAuthHeaders();

    try {
      return await this.httpClient.get(urlWithParams, {
        headers,
      }).toPromise();
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
