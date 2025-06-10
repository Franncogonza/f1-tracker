import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getFlag',
  standalone: true
})
export class GetFlagPipe implements PipeTransform {
  private readonly flags: Record<string, string> = {
    'American': '🇺🇸',
    'Argentine': '🇦🇷',
    'Argentina': '🇦🇷',
    'Austrian': '🇦🇹',
    'Austria': '🇦🇹',
    'Australian': '🇦🇺',
    'Australia': '🇦🇺',
    'Brazil': '🇧🇷',
    'Brazilian': '🇧🇷',
    'British': '🇬🇧',
    'Canada': '🇨🇦',
    'Dutch': '🇳🇱',
    'Finnish': '🇫🇮',
    'France': '🇫🇷',
    'French': '🇫🇷',
    'Germany': '🇩🇪',
    'German': '🇩🇪',
    'Great Britain': '🇬🇧',
    'India': '🇮🇳',
    'Indian': '🇮🇳',
    'Italy': '🇮🇹',
    'Italian': '🇮🇹',
    'Japan': '🇯🇵',
    'Japanese': '🇯🇵',
    'Monaco': '🇲🇨',
    'Netherlands': '🇳🇱',
    'New Zealander': '🇳🇿',
    'Polish': '🇵🇱',
    'Russia': '🇷🇺',
    'Russian': '🇷🇺',
    'Spain': '🇪🇸',
    'Spanish': '🇪🇸',
    'Switzerland': '🇨🇭',
    'Swiss': '🇨🇭',
    'Thailand': '🇹🇭',
    'United States': '🇺🇸',
    'USA': '🇺🇸',
    'default': ''
  };

transform(nationality: string): string {
    const flag = this.flags[nationality] || this.flags['default'];
    return `${flag} ${nationality}`;
  }
}

