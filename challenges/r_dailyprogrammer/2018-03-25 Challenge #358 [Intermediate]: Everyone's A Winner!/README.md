# Description
Today's challenge comes from the website fivethirtyeight.com, which runs a weekly [Riddler](https://fivethirtyeight.com/tag/the-riddler/) column.  Today's dailyprogrammer challenge was the riddler on [2018-04-06](https://fivethirtyeight.com/features/when-will-the-arithmetic-anarchists-attack/).

> From Matt Gold, a chance, perhaps, to redeem your busted bracket:

> On Monday, Villanova won the NCAA men’s basketball national title. But I recently overheard some boisterous Butler fans calling themselves the “[transitive](http://www.mathwords.com/t/transitive_property.htm) national champions,” because Butler beat Villanova earlier in the season. Of course, other teams also beat Butler during the season and their fans could therefore make exactly the same claim.

> How many transitive national champions were there this season? Or, maybe more descriptively, how many teams weren’t transitive national champions?

> (All of this season’s college basketball results are [here](https://www.masseyratings.com/scores.php?s=298892&sub=12801&all=1). To get you started, Villanova lost to Butler, St. John’s, Providence and Creighton this season, all of whom can claim a transitive title. But remember, teams beat those teams, too.)

# Output Description
Your program should output the number of teams that can claim a "transitive" national championship.  This is any team that beat the national champion, any team that beat one of those teams, any team that beat one of *those* teams, etc...

# Challenge Input
The input is a list of all the NCAA men's basketball games from this past season via [https://www.masseyratings.com/scores.php?s=298892&sub=12801&all=1](https://www.masseyratings.com/scores.php?s=298892&sub=12801&all=1)

# Challenge Output
    1185