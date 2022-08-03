# Binary Search Tree

## BST Phases of [7,5,1,8,3,6,0,9,4,2]

* Root = 7
* 5 is less than 7 so places left
* 1 is less than 7 and 5 so places left of 5
* 8 is greater than 7 so places right
* 3 is less than 7,5 and greater than 1 so places right of 1
* 6 is less than 7 and greater than 5 so places right of 5
* 0 is less than 7,5 and 1 so places left of 1
* 9 is greater than 7 and 8 so places right of 8
* 4 is less than 7,5, greater than 1 and 3 so places right of 3
* 2 is less than 7,5 greater than 1 and less than 3 so places left of 3


             7
           /   \
          5     8
         / \     \
        1   6     9
       / \       
      0    3    
          / \
         2   4