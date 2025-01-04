import * as React from 'react';
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
