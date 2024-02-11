import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIClient } from '@dash-view-core';

@Injectable({ providedIn: 'root' })
export class RepositoryUserAccessService extends APIClient {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'repositories/:repositoryID/accesses');
  }
}