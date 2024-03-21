import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export abstract class APIClient<TEntity = any> {
  private static _baseURL: string;

  protected constructor(
    protected readonly http: HttpClient,
    protected readonly resourceURL?: string,
  ) {
  }

  protected getBaseURL(): string {
    if (APIClient._baseURL) {
      return APIClient._baseURL;
    }

    const https = environment.api.https;
    const domain = environment.api.domain;
    const port = environment.api.port;
    let prefix = environment.api.prefix ?? '';

    if (prefix) {
      if (!(prefix as string).startsWith('/')) {
        prefix = `/${prefix}`;
      }
      if (!(prefix as string).endsWith('/')) {
        prefix = `${prefix}/`;
      }
    }
    else {
      prefix = '/';
    }

    let version = environment.api.version ? (environment.api.version as number).toString() : '';

    if (version) {
      version = `v${version}/`;
    }

    APIClient._baseURL = `${https ? 'https' : 'http'}://${domain}${port ? `:${port}` : ''}${prefix}${version}`;

    return APIClient._baseURL;
  }

  protected getURL(path?: any): string {
    return `${this.getBaseURL()}${path ?? this.resourceURL ?? ''}`;
  }

  getResourceURL(path?: any, subIds?: Params): string {
    if (!this.resourceURL) {
      throw new Error(`[${this.constructor.name}] Missing resource URL`);
    }

    let url = this.getURL();

    if (subIds) {
      for (const [key, value] of Object.entries(subIds)) {
        url = url.replace(`:${key}`, value);
      }
    }

    if (!path) {
      return url;
    }

    return `${url}${url.endsWith('/') ? '' : '/'}${path}`;
  }

  getAll<TResult = TEntity>(subIds?: Params, params?: Params): Observable<TResult[]> {
    return this.http.get<TResult[]>(this.getResourceURL(undefined, subIds), { params });
  }

  getFilters<TResult = TEntity>(body?: any): Observable<TResult[]> {
    return this.http.post<TResult[]>(this.getResourceURL('filters'), body);
  }

  get<TResult = TEntity>(id: number | string, params?: Params): Observable<TResult>;
  get<TResult = TEntity>(subIds: Params, params?: Params): Observable<TResult>;

  get<TResult = TEntity>(idOrSubIds: number | string | Params, params?: Params): Observable<TResult> {
    if (typeof idOrSubIds === 'object') {
      return this.http.get<TResult>(this.getResourceURL(idOrSubIds['id'] ?? undefined, idOrSubIds), { params });
    }

    return this.http.get<TResult>(this.getResourceURL(idOrSubIds), { params });
  }

  create<TResult = TEntity>(data: any): Observable<TResult>;
  create<TResult = TEntity>(data: any, subIds?: Params): Observable<TResult>;
  create<TResult = TEntity>(data: any, url: string): Observable<TResult>;
  create<TResult = TEntity>(data: any, url: string, asFormData: boolean): Observable<TResult>;

  create<TResult = TEntity>(data: any, urlOrSubIds?: string | Params, asFormData?: boolean): Observable<TResult> {
    if (asFormData) {
      const formData = this.createFormData(data);

      return this.http.post<TResult>((typeof urlOrSubIds === 'object' ? this.getResourceURL(undefined, urlOrSubIds) : urlOrSubIds) ?? this.getResourceURL(), formData);
    }
    return this.http.post<TResult>((typeof urlOrSubIds === 'object' ? this.getResourceURL(undefined, urlOrSubIds) : urlOrSubIds) ?? this.getResourceURL(), data);
  }

  patch<TResult = TEntity>(data: any, id: number, subIds?: Params): Observable<TResult>;
  patch<TResult = TEntity>(data: any, url: string): Observable<TResult>;
  patch<TResult = TEntity>(data: any, idOrUrl: number | string, subIds?: Params): Observable<TResult> {
    return this.http.patch<TResult>(typeof idOrUrl === 'number' ? this.getResourceURL(idOrUrl, subIds) : idOrUrl, data);
  }

  put<TResult = TEntity>(data: any, id: number, subIds?: Params): Observable<TResult>;
  put<TResult = TEntity>(data: any, url: string): Observable<TResult>;
  put<TResult = TEntity>(data: any, idOrUrl: number | string, subIds?: Params): Observable<TResult> {
    return this.http.put<TResult>(typeof idOrUrl === 'number' ? this.getResourceURL(idOrUrl, subIds) : idOrUrl, data);
  }

  delete(id: number, subIds?: Params): Observable<void>;
  delete(url: string): Observable<void>;

  delete(idOrUrlOrSubIds: number | string, subIds?: Params): Observable<void> {
    if (!isNaN(parseInt(idOrUrlOrSubIds.toString()))) {
      return this.http.delete<void>(this.getResourceURL(idOrUrlOrSubIds, subIds));
    }

    return this.http.delete<void>(idOrUrlOrSubIds as string);
  }

  protected createFormData<TBody>(entity: TBody, skipFiles: boolean = false): FormData {
    const body = new FormData();

    this._appendProperties(body, entity, null, skipFiles);

    return body;
  }

  private _appendProperties(body: FormData, entity: any, baseProp: string | null, skipFiles: boolean = false): void {
    for (const property in entity) {
      if (entity.hasOwnProperty(property)) {
        const value = entity[property];

        if (value instanceof File) {
          if (!skipFiles) {
            body.append(this._generatePropName(baseProp, property, null), value, value.name);
          }
          // } else if (value instanceof Date) {
          //   body.append(this._generatePropName(baseProp, property, null), toJSONWithoutMs(value));
        }
        else if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            if (typeof value[i] === 'object') {
              this._appendProperties(body, value[i], this._generatePropName(baseProp, property, i));
            }
            else {
              body.append(this._generatePropName(baseProp, property, i), `${value[i]}`);
            }
          }
        }
        else if (value !== null && typeof value === 'object') {
          this._appendProperties(body, value, this._generatePropName(baseProp, property, null));
        }
        else {
          if (value !== null && value !== undefined) {
            body.append(this._generatePropName(baseProp, property, null), `${entity[property]}`);
          }
        }
      }
    }
  }

  private _generatePropName(baseProp: string | null, property: string, i: number | null): string {
    let name: string;

    if (baseProp === null) {
      name = property;
    }
    else {
      name = `${baseProp}[${property}]`;
    }

    if (i !== null && i !== undefined) {
      name += `[${i}]`;
    }

    return name;
  }
}
