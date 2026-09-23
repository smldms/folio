const photographModules = import.meta.glob(
  '../../photography/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
) as Record<string, string>;

const naturalSort = new Intl.Collator('en', {
  numeric: true,
  sensitivity: 'base'
});

export interface Photograph {
  id: string | number;
  src: string;
  displaySrc: string;
  filename: string;
  alt: string;
  title: string;
  caption: string;
}

export const photographs: Photograph[] = Object.entries(photographModules)
  .sort(([pathA], [pathB]) => naturalSort.compare(pathA, pathB))
  .map(([path, src], index) => ({
    id: index + 1,
    src,
    displaySrc: src,
    filename: path.split('/').pop() || `Photograph ${index + 1}`,
    alt: `Photograph ${String(index + 1).padStart(2, '0')} from the SMLDMS selection`,
    title: '',
    caption: ''
  }));
