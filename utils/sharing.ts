import { Share } from 'react-native';
import { Album } from '../types';

export async function shareAlbum(album: Album) {
  const message = `Check out this vinyl in my collection!
${album.title} by ${album.artist}
Year: ${album.year}
${album.genres?.length ? `Genres: ${album.genres.join(', ')}` : ''}
${album.condition ? `Condition: Vinyl - ${album.condition.vinyl}, Sleeve - ${album.condition.sleeve}` : ''}
${album.purchaseInfo?.marketValue ? `Current Value: $${album.purchaseInfo.marketValue.toFixed(2)}` : ''}
${album.spotifyUrl ? `Listen on Spotify: ${album.spotifyUrl}` : ''}`;

  try {
    await Share.share({
      message,
      title: `${album.title} by ${album.artist}`,
    });
  } catch (error) {
    console.error('Error sharing album:', error);
  }
}

export async function shareCollection(albums: Album[]) {
  const totalValue = albums.reduce((sum, album) => 
    sum + (album.purchaseInfo?.marketValue || 0), 0);

  const message = `My Vinyl Collection
Total Albums: ${albums.length}
Total Value: $${totalValue.toFixed(2)}

Top Albums:
${albums.slice(0, 5).map(album => 
  `- ${album.title} by ${album.artist} (${album.year})`
).join('\n')}`;

  try {
    await Share.share({
      message,
      title: 'My Vinyl Collection',
    });
  } catch (error) {
    console.error('Error sharing collection:', error);
  }
}
