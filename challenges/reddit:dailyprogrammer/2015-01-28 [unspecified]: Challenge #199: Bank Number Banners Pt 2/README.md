# Description

To do this challenge, first you must complete this weeks [Easy](http://www.reddit.com/r/dailyprogrammer/comments/2tr6yn/2015126_challenge_199_bank_number_banners_pt_1/) challenge.

Now, when we purchased these fax machines and wrote the programme to enable us to send numbers to our machine, we realised something... We couldn't translate it back!
This meant that sending a fax of this number format was useless as no one could interpret it.

Your job is to parse **back** the fax numbers into normal digits.

# Inputs & Outputs

## Input
As input, you should take the output of the easy challenge

## Output
Output will consists of integers that translate to what the fax read out.

These numbers : 

	 _  _  _  _  _  _  _  _  _ 
	| || || || || || || || || |
	|_||_||_||_||_||_||_||_||_|


	 |  |  |  |  |  |  |  |  |
	 |  |  |  |  |  |  |  |  |

	    _  _  _  _  _  _     _ 
	|_||_|| || ||_   |  |  ||_ 
	  | _||_||_||_|  |  |  | _|

Would translate back to :

000000000

111111111

490067715

---

[Link to origin](https://www.reddit.com/r/dailyprogrammer/2u0fyx)