# Contributing

Adding challenge prompts and solutions is encouraged! Please follow the formatting guide below.

---

## Challenge Prompts

__Prompts must be stored as GitHub-compliant markdown in the following location:__

<a name=challenge-prompt></a>_/challenges/[`{ORIGIN_TAG}`](#origin-tag)/[`{CHALLENGE_ID}`](#challenge-id)/README.md_

+ <a name=origin-tag></a>__ORIGIN_TAG:__ The origin of the challenge.
  + If from an external source, please describe the location.
    + _e.g.: `reddit:programmingchallenges`_
    + _e.g.: `github:jpcx:programming-challenges`_
  + If self-submitted, please use your GitHub username.
    + _e.g.: `jpcx`_
  + _Note: Cannot contain forward slashes. Substitute with a `U+2044` character if necessary._
+ <a name=challenge-id></a>__CHALLENGE_ID:__ An identifier that stores information about the challenge.
  + [`{CREATION_DATE}`](#creation-date) [[`{DIFFICULTY}`](#difficulty)]: [`{CHALLENGE_TITLE}`](#challenge-title)
    + <a name=creation-date></a>__CREATION_DATE:__ The date the challenge was created.
      + `YYYY-MM-DD` _(ISO 8601)_
      + _Note: If external, the creation date is the date that the challenge was submitted to its source (if available). Otherwise, please use the pull request date._
    + <a name=difficulty></a>__DIFFICULTY:__ Must be one of the following choices (lower case):
      + `extremely easy`
      + `very easy`
      + `easy`
      + `easy-intermediate`
      + `intermediate`
      + `hard-intermediate`
      + `hard`
      + `very hard`
      + `extremely hard`
      + `unspecified`
        + _Note: Only use if scraping from an external source and a difficulty cannot be determined._
    + <a name=challenge-title></a>__CHALLENGE_TITLE:__ A short description of the challenge.
      + _Note: Cannot contain forward slashes. Substitute with a `U+2044` character if necessary._
      + Use square brackets [] for any additional tags you would like to add.
        + Tags should be space-less and in lower case.
        + Multiple tags should be separated with a comma and a space ', '.
        + Tags should precede the text title.
      + _e.g.: `Sum the digits from 1 to n`_
      + _e.g.: `[facebook, interview] Prime factoring`_
      + _e.g.: `[physics] Calculate time dilation`_
      + _e.g.: `Untitled`_
        + _Note: Only use if scraping from an external source and a title cannot be determined._
+ _e.g.: `/challenges/jpcx/2018-09-05 [intermediate]: [example] Write this repository!`_

__Citation:__

+ README files should contain a citation if not self-submitted.
  + The citation should be a footer following a horizontal line break padded with empty lines.
  + If possible, provide a direct link to the source.
  
+ If the challenge is licensed, please include a copy of the license as _/challenges/[`{ORIGIN_TAG}`](#origin-tag)/[`{CHALLENGE_ID}`](#challenge-id)/LICENSE_.

---

## Challenge Solutions

__Solutions must be located within the following directory:__

<a name=solution-directory></a>_/challenges/[`{ORIGIN_TAG}`](#origin-tag)/[`{CHALLENGE_ID}`](#challenge-id)/[`{SOLUTION_ID}`](#solution-id)/_

+ __ORIGIN_TAG:__ See [above](#ORIGIN_TAG).
+ __CHALLENGE_ID:__ See [above](#CHALLENGE_ID)
+ __<a name=solution-id></a>SOLUTION_ID:__ A solution identifier in the following format:
  + `{SOLUTION_DATE}` <[`{SOLUTION_WRITER}`](#solution-writer)> [[`{LANGUAGE}`](#language)]: [`{SOLUTION_TITLE}`](solution-title)
    + __<a name=solution-date></a>SOLUTION_DATE:__ The date the solution was __initially added__ to the repository.
      + `YYYY-MM-DD` _(ISO 8601)_
    + __<a name=solution-writer></a>SOLUTION_WRITER:__ The associated GitHub username.
      + _e.g.: `jpcx`_
    + __<a name=language></a>LANGUAGE:__ The language of the solution.
      + Use one of [these language identifiers](https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers) if possible.
        + If the language is not listed, use a lowercase name without spaces.
    + __<a name=solution-title></a>SOLUTION_TITLE:__ A short description of the solution.
      + _e.g.: `Using p5.js`_
      + _e.g.: `Purely functional`_
      + _e.g.: `One-liner`_
      + _e.g.: `Solution #1`_
      + _Note: Cannot contain forward slashes. Substitute with a `U+2044` character if necessary._
  + This should not change with future revisions.
  + _e.g. `2018-09-03 <jpcx> [javascript]: One-liner with Array.reduce.`_

__Within the [solution directory](#solution-directory):__

+ If documentation is required, write a README.md.
  + If necessary, create additional markdown files in a _docs/_ folder.
+ If licensing, please use an MIT-compatible license.

---

## Bonus

Writing a script is encouraged when adding challenges from external sources- especially when the source contains multiple challenges and grows over time.

__Scraping scripts must be located within the following directory:__

<a name=script-directory></a>_/dev/lib/scrape/[`{ORIGIN_TAG}`](origin-tag)/

+ _e.g.: `reddit:dailyprogrammer`_
+ __ORIGIN_TAG:__ See [above](#ORIGIN_TAG)

__Functionality:__

Scripts should export an object from an index.js file with two functions: `listenActivity` and `run`.

_Note: See /dev/lib/scrape/reddit:dailyprogrammer/index.js for an example._

+ `listenActivity`
  + Takes a callback function as its only parameter.
  + Any status updates (e.g. 'Scraped Challenge ...') should be passed to this callback.
+ `run`
  + Returns a promise that resolves with an object that maps [`{CHALLENGE_ID}`](#challenge-id)s to markdown text.

Scripts must:

+ Use the user agent provided in _/dev/buildConfig.json_.
+ Retrieve all available challenges from the source.
+ Be readable JavaScript.
  + Consider using JSDoc comments.
+ Not write to stdout (_use `listenActivity` instead_)

The script will be run by _/dev/build.js_, which will use the folder name as an [`ORIGIN_TAG`](#origin-tag) and will save all challenges resolved by `run`.

__Within the [script directory](#script-directory):__

+ If documentation is required, write a README.md.
  + If necessary, create additional markdown files in a _docs/_ folder.
+ If licensing, please use an MIT-compatible license.

As multiple scripts for a single origin are not necessary, please modify any existing scraping scripts that need improvement.

Feel free to use any of the tools provided in _/dev/lib/tools_ and/or add your own.

---

If you have any proposed changes to this structure, please make a pull request!

Thank you!