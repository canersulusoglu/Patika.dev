# Insertion Sort

## Sorting [22,27,16,2,18,6] From Smallest To Largest

    [2|,27,16,22,18,6]
    [2,6|,16,22,18,27]
    [2,6,16|,22,18,27]
    [2,6,16,18|,22,27]
    [2,6,16,18,22|,27]
    [2,6,16,18,22,27|]

    Sorting Result => [2,6,16,18,22,27]

## Big-O

    Best Case:    O(n)
    Average Case: O(n^2) 
    Worst Case:   O(n^2)

## Time Complexity

    For example, we are looking for 2 in this array. 

    Best Case:     [2,6,16,18,22,27]
    Average Case:  [18,6,16,2,22,27]
    Worst Case:    [22,27,16,6,18,2]

## After Sorting, Which Case Would 18 Suit?

    Sorting Result => [2,6,16,18,22,27]
    18 suits average case because it is in the middle of the array.

## Sorting [7,3,5,8,2,9,4,15,6] From Smallest To Largest First 4 Step

    [2|,3,5,8,7,9,4,15,6]
    [2,3|,5,8,7,9,4,15,6]
    [2,3,4|,8,7,9,5,15,6]
    [2,3,4,5|,7,9,8,15,6]