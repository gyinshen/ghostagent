# ghostagent

AI researcher - search, scrape, summarize - You can deploy your own GPT Researcher with history or view demo here [GhostAgent.me](https://ghostagent.me/report)

![web-demo](https://raw.githubusercontent.com/gyinshen/ghostagent/main/frontend/public/demo1.png)




## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

## Installation

There are two services you have to start locally, namely frontend and backend.

Frontend - inspired by - [Quiver](https://github.com/StanGirard/quivr)
```bash
yarn install
yarn dev
```
You also have to register for a Supabase account and replace the environmental variables in /frontend/.env.example

Backend - inspired by - [gpt-researcher](https://github.com/assafelovic/gpt-researcher)

```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 5050
```

You also have to register for a Supabase account and replace the environmental variables in /backend/.env.example

## Usage
Quick demo [GhostAgent.me](https://ghostagent.me/report)

There are some limitations:
* Does not work well with PDF.
* Some websites will return error
* Unable to specify market research in certain time period, only latest
* Does not work well with economic bloc research (such as ASEAN, SEA or APAC) → individual countries work better



## Credits
This repo is inspired by [Quiver](https://github.com/StanGirard/quivr) and [gpt-researcher](https://github.com/assafelovic/gpt-researcher)


## License
MIT License. Feel free to redistribute.