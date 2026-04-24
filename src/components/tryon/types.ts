export type Angle = 'front' | 'three-quarter' | 'side' | 'back';

export const ANGLES: { id: Angle; label: string }[] = [
  { id: 'front', label: 'Front' },
  { id: 'three-quarter', label: '3/4' },
  { id: 'side', label: 'Side' },
  { id: 'back', label: 'Back' },
];

export type AngleViews = Partial<Record<Angle, string>>;
