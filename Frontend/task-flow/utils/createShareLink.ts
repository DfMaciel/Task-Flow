import Constants from 'expo-constants';

export function createShareLink(path: string): string {
  const owner = Constants.expoConfig?.owner;
  const slug = Constants.expoConfig?.slug;

  if (!owner || !slug) {
    console.warn("Não foi possível encontrar owner ou slug. Usando link local.");
    return "https://expo.dev/project-not-found";
  }

  return `https://expo.dev/@${owner}/${slug}/--/${path}`;
}