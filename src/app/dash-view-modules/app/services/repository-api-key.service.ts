import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIClient } from '@dash-view-core';

@Injectable({ providedIn: 'root' })
export class RepositoryApiKeyService extends APIClient {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'repositories/:repositoryID/api-keys');
  }
}