import { Sorting } from './Sorting';

export default {
  title: 'Sorting'
};

export const BubbleSortStory = () => {
  return (
    <Sorting
      data={[
        [5, 1, 4, 2, 8], // Initial array
        [1, 5, 4, 2, 8], // After first comparison and swap
        [1, 4, 5, 2, 8], // After second comparison and swap
        [1, 4, 2, 5, 8], // After third comparison and swap
        [1, 4, 2, 5, 8], // After fourth comparison (no swap)
        [1, 4, 2, 5, 8], // After fifth comparison (no swap)
        [1, 2, 4, 5, 8], // After sixth comparison and swap
        [1, 2, 4, 5, 8], // After seventh comparison (no swap)
        [1, 2, 4, 5, 8], // After eighth comparison (no swap)
        [1, 2, 4, 5, 8], // After ninth comparison (no swap)
        [1, 2, 4, 5, 8] // Final sorted array
      ]}
      steps={[
        'Initial array',
        'Compare 5,1: Swap since 5 > 1',
        'Compare 5,4: Swap since 5 > 4',
        'Compare 5,2: Swap since 5 > 2',
        'Compare 5,8: No swap since 5 < 8 (largest element bubbled to end)',
        'Compare 1,4: No swap since 1 < 4',
        'Compare 4,2: Swap since 4 > 2',
        'Compare 4,5: No swap since 4 < 5',
        'Compare 1,2: No swap since 1 < 2',
        'Compare 2,4: No swap since 2 < 4',
        'Array is now sorted!'
      ]}
    />
  );
};

export const SelectionSortStory = () => {
  return (
    <>
      <br />
      <Sorting
        data={[
          [29, 72, 98, 13, 87, 66, 52, 51, 36], // Initial array
          [13, 72, 98, 29, 87, 66, 52, 51, 36], // After first swap
          [13, 29, 98, 72, 87, 66, 52, 51, 36], // After second swap
          [13, 29, 36, 72, 87, 66, 52, 51, 98], // After third swap
          [13, 29, 36, 51, 87, 66, 52, 72, 98], // After fourth swap
          [13, 29, 36, 51, 52, 66, 87, 72, 98], // After fifth swap
          [13, 29, 36, 51, 52, 66, 72, 87, 98] // Final sorted array
        ]}
        steps={[
          'Initial array',
          'Find minimum (13) and swap with first element',
          'Find minimum in remaining array (29) and swap with second element',
          'Find minimum (36) and swap with third element',
          'Find minimum (51) and swap with fourth element',
          'Find minimum (52) and swap with fifth element',
          'Array is now sorted'
        ]}
      />
    </>
  );
};

export const MergeSortStory = () => {
  const colorRanges = [
    [], // Initial array - no colors
    [
      // First division
      { start: 0, end: 3, color: '#0066cc' }, // First half - strong blue
      { start: 4, end: 7, color: '#ff6600' } // Second half - strong orange
    ],
    [
      // Divide left half
      { start: 0, end: 1, color: '#3385d6' }, // First quarter - lighter blue
      { start: 2, end: 3, color: '#66a3e0' }, // Second quarter - even lighter blue
      { start: 4, end: 7, color: '#ff6600' } // Second half unchanged - strong orange
    ],
    [
      // Divide further left
      { start: 0, end: 0, color: '#4d94db' }, // lighter blue
      { start: 1, end: 1, color: '#80b3e6' }, // even lighter blue
      { start: 2, end: 2, color: '#99c2eb' }, // lighter blue from second quarter
      { start: 3, end: 3, color: '#b3d1f0' }, // even lighter blue from second quarter
      { start: 4, end: 7, color: '#ff6600' } // strong orange
    ],
    [
      // First merge
      { start: 0, end: 1, color: '#3385d6' }, // Merged pair - lighter blue
      { start: 2, end: 3, color: '#66a3e0' }, // lighter blue
      { start: 4, end: 7, color: '#ff6600' } // strong orange
    ],
    [
      // Divide right part of left half
      { start: 0, end: 1, color: '#3385d6' }, // lighter blue
      { start: 2, end: 2, color: '#99c2eb' }, // lighter blue from second quarter
      { start: 3, end: 3, color: '#b3d1f0' }, // even lighter blue from second quarter
      { start: 4, end: 7, color: '#ff6600' } // strong orange
    ],
    [
      // Second merge
      { start: 0, end: 1, color: '#3385d6' }, // lighter blue
      { start: 2, end: 3, color: '#66a3e0' }, // Merged pair - lighter blue
      { start: 4, end: 7, color: '#ff6600' } // strong orange
    ],
    [
      // Merge left halves
      { start: 0, end: 3, color: '#0066cc' }, // Fully merged left half - strong blue
      { start: 4, end: 7, color: '#ff6600' } // strong orange
    ],
    [
      // Merge part of right half
      { start: 0, end: 3, color: '#0066cc' }, // strong blue
      { start: 4, end: 5, color: '#ff8533' }, // lighter orange
      { start: 6, end: 7, color: '#ffa366' } // even lighter orange
    ],
    [
      // Merge right halves
      { start: 0, end: 3, color: '#0066cc' }, // strong blue
      { start: 4, end: 7, color: '#ff6600' } // Merged right half - strong orange
    ],
    [
      // Final merged array
      { start: 0, end: 7, color: '#0066cc' } // Fully merged array - strong blue
    ]
  ];

  return (
    <Sorting
      data={[
        [17, 7, 23, 2, 11, 3, 13, 5], // Initial array
        [17, 7, 23, 2, 11, 3, 13, 5], // After first division
        [17, 7, 23, 2, 11, 3, 13, 5], // Divide left half
        [17, 7, 23, 2, 11, 3, 13, 5], // Divide further left
        [7, 17, 23, 2, 11, 3, 13, 5], // First merge
        [7, 17, 2, 23, 11, 3, 13, 5], // Divide right part of left half
        [7, 17, 2, 23, 11, 3, 13, 5], // Second merge
        [2, 7, 17, 23, 11, 3, 13, 5], // Merge left halves
        [2, 7, 17, 23, 3, 11, 13, 5], // Merge part of right half
        [2, 7, 17, 23, 3, 5, 11, 13], // Merge right halves
        [2, 3, 5, 7, 11, 13, 17, 23] // Final merged array
      ]}
      steps={[
        'Initial array',
        'Divide into [17,7,23,2] and [11,3,13,5]',
        'Divide left: [17,7] and [23,2]',
        'Divide further: [17] and [7]',
        'Merge: [7,17] (sorted pair)',
        'Divide right: [23] and [2]',
        'Merge: [2,23] (sorted pair)',
        'Merge left halves: [2,7,17,23]',
        'Divide right half: [11,3] and [13,5]',
        'Merge right halves: [3,5,11,13]',
        'Final merge: [2,3,5,7,11,13,17,23]'
      ]}
      colorRanges={colorRanges}
    />
  );
};
