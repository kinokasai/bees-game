get-the-ace: aces: 1 -> 1, 2 -> 3, 3 -> 5, 4 -> win 
7-wheel: 7 -> 1pt, 777 -> win
tricks: +1 pt / trick
<!-- even odd c'est relou il y en a plein -->
even: +1pt / even
odd: +1pt / odd
pairs: +1pt (x, x) in plis
sour: 2*x = 3pt, 3*x = -2 pt
no-tricks: no tricks = 5 pts
avoid _x_: _x_ = -1pt


| Effect | Points |
|------|-------|
| increasing, heart trump | get-the-ace|
| increasing, spades trump | 7-wheel |
| increasing, clubs trump | avoid 3 |
| increasing, diamonds trump | |
| decreasing, heart trump | +1 diamonds |
| decreasing, spades trump |  |
| decreasing, clubs trump | tricks |
| decreasing, diamonds trump | even |
| crazy-8  | odd |
| biggest wins, simultaneous | sour |
| lowest wins, simulateneous | no-tricks | 
| chèvre ? | each trick won on this world is worth -3 points |

