# Description

Have you ever seen one of those puzzles where you have to try and fit a collection of various shapes into a certain area?

The [Pentomino](https://en.wikipedia.org/wiki/Pentomino) was first devised by American professor Solomon Golomb in 1953. A Pentomino is a single polygon made up of 5 congruent squares. A full set of Pentominos consists of all 12 of the possible combinations of the 5 squares (excluding reflections and rotations).

Pentominos have the special property of being able to be packed into many different shapes. For example, with a full set of 12 Pentominos, you could create a rectangle of size 6x10, 5x12, 4x15, and 3x20. Other smaller shapes can be made, but with less Pentominos. Additionally, you can also fill an 8x8 square with 4 holes in it ([although certain positions of the holes can make it impossible](https://en.wikipedia.org/wiki/Pentomino#/media/File:Pentomino_unsolvable.svg)).

The challenge is to output one solution for the given rectangle. 

# Challenge Input

The input is a single line with two numbers. The first number is the width of the rectangle, and the second number is the height.

    10 6
    12 5
    15 4
    20 3
    5 5
    7 5
    5 4
    10 5

# Challenge Output

The output should be a representation of the board. This can be anything from an ASCII representation to a graphical view. If you go for the ASCII representation, [choose one of the nomenclatures here](https://en.wikipedia.org/wiki/File:Pentomino_Naming_Conventions.svg). For example, the ASCII representation could look like this:

Input:

    10 6

Output:
    
    𝙸𝙿𝙿𝚈𝚈𝚈𝚈𝚅𝚅𝚅
    𝙸𝙿𝙿𝚇𝚈𝙻𝙻𝙻𝙻𝚅
    𝙸𝙿𝚇𝚇𝚇𝙵𝚉𝚉𝙻𝚅
    𝙸𝚃𝚆𝚇𝙵𝙵𝙵𝚉𝚄𝚄
    𝙸𝚃𝚆𝚆𝙽𝙽𝙵𝚉𝚉𝚄
    𝚃𝚃𝚃𝚆𝚆𝙽𝙽𝙽𝚄𝚄

# Bonus Challenge

Given the positions of 4 holes, give a solution for an 8x8 square. Output "No Solution" if it is not possible

# Bonus Input

The bonus input is given by one line containing the size of the square (always 8x8), and then 4 lines each with the coordinate of one hole. The first number is the x position of the hole, the second number is the y position of the hole. Treat 0, 0 as the top-left corner.
    
    8 8  
    3,3  
    4,3  
    3,4  
    4,4
    
    8 8  
    0,7  
    1,3  
    2,4  
    3,5  
    
    8 8  
    1,0  
    3,0  
    0,3  
    1,2  

# Tips

[Here is an online solver that might help you visualize this problem](http://math.hws.edu/eck/js/pentominos/pentominos.html)

Look into [Backtracking](https://en.wikipedia.org/wiki/Backtracking)

# Credit

This challenge was suggested by user /u/DXPower, many thanks! If you have a challeng idea please share it in /r/dailyprogrammer_ideas and there's a good chance we'll use it.

---

[Link to origin](https://www.reddit.com/r/dailyprogrammer/8t4440)