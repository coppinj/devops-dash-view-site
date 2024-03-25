import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEntityDTO } from '@dash-view-common';
import { APIClient } from '@dash-view-core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TestClassService extends APIClient {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'repositories/:repositoryID/pipelines/:pipelineID/test-classes');
  }

  toggleValidated(repositoryID: number, pipelineID: number, id: number): Observable<IEntityDTO> {
    return this.http.post<IEntityDTO>(this.getResourceURL(`${id}/toggle-validated`, {
      repositoryID,
      pipelineID,
    }), null);
  }

  download(repositoryID: number, pipelineID: number, id: number): Observable<HttpResponse<Blob>> {
    return this.http.get(this.getResourceURL(`${id}/download`, {
      repositoryID,
      pipelineID,
    }), { observe: 'response', responseType: 'blob' });
  }
}