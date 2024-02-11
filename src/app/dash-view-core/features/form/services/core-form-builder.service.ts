import { Injectable } from '@angular/core';
import { CoreFormGroup } from "../model";
import { AbstractControlOptions, FormBuilder } from "@angular/forms";
import { ToastService } from "../../toast";
import { TranslateService } from "../../translations";

@Injectable({ providedIn: 'root' })
export class CoreFormBuilder {
  constructor(
    private readonly fb: FormBuilder,
    private readonly toastService: ToastService,
    private readonly translateService: TranslateService,
  ) {
  }

  group<T extends {}>(controls: T, options?: AbstractControlOptions | null): CoreFormGroup {
    const group = this.fb.group(controls, options);

    return new CoreFormGroup(group, this.toastService, this.translateService);
  }
}