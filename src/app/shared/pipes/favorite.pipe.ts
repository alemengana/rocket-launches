import { Pipe, PipeTransform } from '@angular/core';
import { Launch } from '../models/launch';
import { SharedService } from '../services/shared.service';

@Pipe({ name: 'favorite' })
export class FavoritePipe implements PipeTransform {
  constructor(private sharedService: SharedService) {}

  transform(value: Launch): boolean {
    return this.sharedService.isFavorite(value);
  }
}
